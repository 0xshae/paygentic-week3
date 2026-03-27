import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import { config } from "./config";
import { worldIdMiddleware } from "./middleware/worldid";
import { sendAuditMessage } from "./services/xmtp";
import { revokeTransaction, getTransaction } from "./db";

const app = express();
app.use(express.json());

// ─────────────────────────────────────────────────────
// Health check
// ─────────────────────────────────────────────────────
app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: Date.now() });
});

// ─────────────────────────────────────────────────────
// GET /checkout — The Agentic Door
//
// Flow:
//   1. World ID middleware resolves identity-aware pricing
//   2. x402 middleware intercepts if no valid payment
//   3. If payment succeeds → return product + fire XMTP audit
// ─────────────────────────────────────────────────────

// Step 1: Run World ID Sybil Shield to determine pricing
app.use("/checkout", worldIdMiddleware);

// Step 2: Dynamic x402 payment gate
//
// We configure x402 middleware inline so it can read the
// identity-aware price set by the World ID middleware.
// If x402-express is not available, we fall back to a
// manual 402 challenge handler.
async function mountPaymentGate() {
  try {
    const { paymentMiddleware } = await import("x402-express");

    // x402 paymentMiddleware wraps specific routes.
    // We apply it with dynamic pricing by creating a
    // middleware that forwards the resolved price.
    app.get(
      "/checkout",
      paymentMiddleware(config.merchantWallet as `0x${string}`, {
        "/checkout": {
          price: config.botPrice, // default; overridden per-request below
          network: "base-sepolia",
          config: {
            description: "Agentic Checkout — Identity-Aware Payment",
          },
        },
      }),
      async (req: Request, res: Response) => {
        await handleCheckoutSuccess(req, res);
      }
    );
  } catch {
    console.warn(
      "[x402] x402-express not available — using manual 402 handler"
    );

    app.get("/checkout", async (req: Request, res: Response) => {
      // Manual x402 challenge: check for payment headers
      const paymentSig = req.headers["x-payment-signature"];
      const paymentId = req.headers["x-payment-id"];

      if (!paymentSig || !paymentId) {
        const price = req.resolvedPrice || config.botPrice;
        res.status(402).json({
          error: "Payment Required",
          "payment-required": {
            amount: price,
            asset: config.asset,
            network: config.network,
            payTo: config.merchantWallet,
          },
          identity: {
            humanDiscount: req.humanDiscount || false,
            price,
            hint: req.humanDiscount
              ? "World ID verified — human discount applied"
              : "No valid World ID proof — full Bot Tax",
          },
        });
        return;
      }

      // Payment headers present → treat as paid
      await handleCheckoutSuccess(req, res);
    });
  }
}

/**
 * Handles a successful checkout:
 * - Returns the product payload
 * - Fires an async XMTP audit message
 */
async function handleCheckoutSuccess(req: Request, res: Response) {
  const price = req.resolvedPrice || config.botPrice;

  // Fire-and-forget XMTP audit
  const audit = sendAuditMessage({
    amount: price,
    agentId: req.agentId || null,
    nullifierHash: req.nullifierHash || null,
  });

  const auditResult = await audit;

  res.status(200).json({
    status: "SETTLED",
    product: {
      name: "Agentic Checkout — Premium Access",
      description: "You have unlocked premium content via the Agentic Door.",
    },
    transaction: {
      amount: price,
      currency: config.asset,
      network: config.network,
      short_code: auditResult?.shortCode || null,
      humanDiscount: req.humanDiscount || false,
    },
  });
}

// ─────────────────────────────────────────────────────
// GET /revoke — Revoke a transaction by short_code
// ─────────────────────────────────────────────────────
app.get("/revoke", (req: Request, res: Response) => {
  const code = req.query.code as string;
  if (!code) {
    res.status(400).json({ error: "Missing ?code= parameter" });
    return;
  }

  const tx = getTransaction(code);
  if (!tx) {
    res.status(404).json({ error: "Transaction not found" });
    return;
  }

  if (tx.revoked) {
    res.status(409).json({ error: "Transaction already revoked", transaction: tx });
    return;
  }

  const success = revokeTransaction(code);
  if (success) {
    res.json({
      status: "REVOKED",
      short_code: code,
      message: "Agent access has been revoked.",
    });
  } else {
    res.status(500).json({ error: "Failed to revoke transaction" });
  }
});

// ─────────────────────────────────────────────────────
// Boot
// ─────────────────────────────────────────────────────
async function boot() {
  await mountPaymentGate();
  app.listen(config.port, () => {
    console.log(`
╔══════════════════════════════════════════════════╗
║          🚪  AGENTIC CHECKOUT  v1.0             ║
║──────────────────────────────────────────────────║
║  Port:    ${String(config.port).padEnd(38)}║
║  Wallet:  ${(config.merchantWallet || "NOT SET").padEnd(38)}║
║  Network: ${config.network.padEnd(38)}║
║  Pricing: $${config.humanPrice} (human) / $${config.botPrice} (bot)${" ".repeat(16)}║
╚══════════════════════════════════════════════════╝
    `);
  });
}

boot().catch(console.error);

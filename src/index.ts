import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import {
  paymentMiddlewareFromHTTPServer,
  x402ResourceServer,
  x402HTTPResourceServer,
} from "@x402/express";
import { ExactEvmScheme } from "@x402/evm/exact/server";
import { HTTPFacilitatorClient } from "@x402/core/server";
import { config } from "./config";
import {
  agentkitHooks,
  agentkitResourceServerExtension,
  getAgentkitExtension,
} from "./agentkit";
import { sendAuditMessage } from "./services/xmtp";
import { getTransaction, revokeTransaction } from "./db";

const app = express();
app.use(express.json());

// ─────────────────────────────────────────────────────
// x402 Resource Server + AgentKit Extension
// ─────────────────────────────────────────────────────

const facilitatorClient = new HTTPFacilitatorClient({
  url: config.facilitatorUrl,
});

const resourceServer = new x402ResourceServer(facilitatorClient)
  .register(config.baseSepolia, new ExactEvmScheme())
  .registerExtension(agentkitResourceServerExtension);

// ─────────────────────────────────────────────────────
// Route configuration — Identity-Aware Pricing
// ─────────────────────────────────────────────────────

const routes = {
  "GET /checkout": {
    accepts: [
      {
        scheme: "exact" as const,
        price: config.botPrice,        // $1.00 — full Bot Tax
        network: config.baseSepolia,   // Base Sepolia (CAIP-2)
        payTo: config.merchantWallet,
      },
    ],
    description: "Agentic Checkout — Identity-Aware Payment Gateway",
    mimeType: "application/json",
    // AgentKit extension: verified humans get 99% discount ($0.01)
    extensions: getAgentkitExtension(),
  },
};

// ─────────────────────────────────────────────────────
// HTTP Server with AgentKit hooks
// ─────────────────────────────────────────────────────

const httpServer = new x402HTTPResourceServer(resourceServer, routes)
  .onProtectedRequest(agentkitHooks.requestHook);

// Mount x402 + AgentKit payment middleware
app.use(paymentMiddlewareFromHTTPServer(httpServer));

// ─────────────────────────────────────────────────────
// Health check
// ─────────────────────────────────────────────────────

app.get("/health", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    version: "2.0.0",
    gateway: "Agentic Checkout",
    timestamp: Date.now(),
  });
});

// ─────────────────────────────────────────────────────
// GET /checkout — The Agentic Door
// ─────────────────────────────────────────────────────

app.get("/checkout", async (req: Request, res: Response) => {
  // If we reach here, x402 payment was verified
  const agentId = req.headers["x-agent-id"] as string | undefined;

  // Fire XMTP audit (non-blocking)
  const auditResult = await sendAuditMessage({
    amount: config.botPrice,
    agentId: agentId || null,
    humanId: null,
  });

  res.status(200).json({
    status: "SETTLED",
    product: {
      name: "Agentic Checkout — Premium Access",
      description: "You have unlocked premium content via the Agentic Door.",
    },
    transaction: {
      amount: config.botPrice,
      currency: config.asset,
      network: config.baseSepolia,
      short_code: auditResult?.shortCode || null,
    },
    gateway: {
      name: "Agentic Checkout",
      version: "2.0.0",
    },
  });
});

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

app.listen(config.port, () => {
  console.log(`
╔══════════════════════════════════════════════════╗
║        🚪  AGENTIC CHECKOUT  v2.0               ║
║          The Agentic Door Gateway                ║
║──────────────────────────────────────────────────║
║  Port:       ${String(config.port).padEnd(35)}║
║  Wallet:     ${(config.merchantWallet.slice(0, 10) + "...").padEnd(35)}║
║  Network:    ${config.baseSepolia.padEnd(35)}║
║  Facilitator:${config.facilitatorUrl.slice(0, 35).padEnd(35)}║
║  Pricing:    $0.01 (human) / ${config.botPrice} (bot)${" ".repeat(12)}║
║  Stack:      x402 + AgentKit + XMTP             ║
╚══════════════════════════════════════════════════╝
  `);
});

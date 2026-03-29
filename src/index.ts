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
import { glideMiddleware, GlideTier } from "./middleware/glide";
import { sendAuditMessage } from "./services/xmtp";
import { getTransaction, revokeTransaction, insertTransaction, getAllTransactions } from "./db";
import { nanoid } from "nanoid";
import { EventEmitter } from "events";

const eventBus = new EventEmitter();

const app = express();
app.use(express.json());
app.use(express.static("public"));

// ─────────────────────────────────────────────────────
// x402 Resource Server + AgentKit Extension
// ─────────────────────────────────────────────────────

const facilitatorClient = new HTTPFacilitatorClient({
  url: config.facilitatorUrl,
});

const resourceServer = new x402ResourceServer(facilitatorClient)
  .register(config.baseSepolia, new ExactEvmScheme())
  // Note: World Sepolia (eip155:4801) not yet supported by x402.org facilitator
  .registerExtension(agentkitResourceServerExtension);

// ─────────────────────────────────────────────────────
// Route configuration — x402 Payment Gate
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
    description: "Glide Gateway — Human-Aware Payment Middleware",
    mimeType: "application/json",
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
    version: "3.0.0",
    gateway: "Glide — Human-Aware API Gateway",
    timestamp: Date.now(),
  });
});

// ─────────────────────────────────────────────────────
// GET /checkout — Legacy x402 Payment Gate
// ─────────────────────────────────────────────────────

app.get("/checkout", (req: Request, res: Response) => {
  // If we reach here, x402 payment was verified
  const agentId = req.headers["x-agent-id"] as string | undefined;

  const short_code = nanoid(10);
  insertTransaction({
    shortCode: short_code,
    humanId: null,
    amount: config.botPrice,
    agentId: agentId || null,
  });

  const txRecord = getTransaction(short_code);
  if (txRecord) eventBus.emit("transaction", txRecord);

  sendAuditMessage({
    shortCode: short_code,
    amount: config.botPrice,
    agentId: agentId || null,
    humanId: null,
  }).catch(console.error);

  res.status(200).json({
    status: "SETTLED",
    transaction: {
      amount: config.botPrice,
      currency: config.asset,
      network: config.baseSepolia,
      short_code: short_code,
    },
    gateway: {
      name: "Glide",
      version: "3.0.0",
    },
    message: "Payment verified. Use the short_code as a Bearer token to access /premium-data",
  });
});

// ─────────────────────────────────────────────────────
// 🌟 GET /api/generate — The Glide Demo Endpoint
//    3-Tier Human-Aware Access:
//      bot     → slow + expensive (2s delay)
//      human   → fast + free
//      premium → instant + premium
// ─────────────────────────────────────────────────────

app.get(
  "/api/generate",
  glideMiddleware({ requireWorldId: true, fallback: "rate-limit", botDelayMs: 2000 }),
  (req: Request, res: Response) => {
    const tier = (req as any).glideTier as GlideTier;
    const priority = (req as any).glidePriority as string;
    const verified = (req as any).glideVerified as boolean;
    const agentId = req.headers["x-agent-id"] as string || "anonymous";

    // Record the request as a transaction for the dashboard
    const short_code = nanoid(10);
    insertTransaction({
      shortCode: short_code,
      humanId: verified ? agentId : null,
      amount: tier === "bot" ? config.botPrice : tier === "premium" ? "$0.50" : "$0.00",
      agentId,
    });

    const txRecord = getTransaction(short_code);
    if (txRecord) eventBus.emit("transaction", txRecord);

    // Build tiered response
    const now = new Date().toISOString();
    const responses: Record<GlideTier, object> = {
      bot: {
        status: "OK",
        tier: "bot",
        priority: "low",
        verified: false,
        latency: "~2000ms (throttled)",
        message: "Request processed. No World ID detected — throttled and expensive.",
        hint: "Add X-World-ID-Proof header for instant, free access.",
        data: {
          imageUrl: "https://placeholder.co/512x512/222/666?text=Low+Priority",
          quality: "standard",
          timestamp: now,
        },
      },
      human: {
        status: "OK",
        tier: "human",
        priority: "high",
        verified: true,
        latency: "<50ms",
        message: "World ID verified — instant access, no payment required.",
        data: {
          imageUrl: "https://placeholder.co/1024x1024/1a1a2e/e0e0ff?text=Human+Verified",
          quality: "high",
          resolution: "1024x1024",
          timestamp: now,
        },
      },
      premium: {
        status: "OK",
        tier: "premium",
        priority: "instant",
        verified: true,
        latency: "<10ms",
        message: "World ID + Payment — premium tier unlocked.",
        data: {
          imageUrl: "https://placeholder.co/2048x2048/0d0d1a/c0c0ff?text=Premium+Tier",
          quality: "ultra",
          resolution: "2048x2048",
          upscaled: true,
          timestamp: now,
        },
      },
    };

    res.status(200).json(responses[tier]);
  }
);

// ─────────────────────────────────────────────────────
// GET /premium-data — Content Consumption
// ─────────────────────────────────────────────────────

app.get("/premium-data", (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized: Missing Bearer token" });
    return;
  }

  const token = authHeader.split(" ")[1];
  const tx = getTransaction(token);

  if (!tx) {
    res.status(401).json({ error: "Unauthorized: Invalid token" });
    return;
  }

  if (tx.revoked === 1) {
    res.status(403).json({ error: "Access revoked by human owner." });
    return;
  }

  res.status(200).json({
    status: "SUCCESS",
    data: {
      metrics: "Top Secret Alpha Metrics",
      art: "\\n  _._     _,-'\"\"\\`-._\\n (,-.\\`._,'(       |\\`-e/|\\n     `-.-' \\ )-'( , o o)\\n           `-    \\`_`\"'-\\n      "
    }
  });
});

// ─────────────────────────────────────────────────────
// Dashboard APIs — Live Data
// ─────────────────────────────────────────────────────

app.get("/api/transactions", (req: Request, res: Response) => {
  res.json(getAllTransactions());
});

app.get("/api/events", (req: Request, res: Response) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const onTx = (data: any) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  eventBus.on("transaction", onTx);

  req.on("close", () => {
    eventBus.off("transaction", onTx);
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
    const updatedTx = getTransaction(code);
    if (updatedTx) eventBus.emit("transaction", updatedTx);

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
║    ✦  GLIDE  v3.0                               ║
║    Human-Aware API Gateway                       ║
║──────────────────────────────────────────────────║
║  Port:       ${String(config.port).padEnd(35)}║
║  Wallet:     ${(config.merchantWallet.slice(0, 10) + "...").padEnd(35)}║
║  Network:    ${config.baseSepolia.padEnd(35)}║
║  Facilitator:${config.facilitatorUrl.slice(0, 35).padEnd(35)}║
║──────────────────────────────────────────────────║
║  Access Tiers:                                   ║
║    🤖  No World ID  → slow + $${config.botPrice.replace("$", "").padEnd(19)}║
║    🧬  World ID     → fast + free                ║
║    ⚡  World ID+Pay → instant + premium           ║
║──────────────────────────────────────────────────║
║  Stack:  World ID + x402 + XMTP                 ║
╚══════════════════════════════════════════════════╝
  `);
});

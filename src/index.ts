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
// GET /checkout — Authorization (The Agentic Door)
// ─────────────────────────────────────────────────────

app.get("/checkout", (req: Request, res: Response) => {
  // If we reach here, x402 payment was verified
  const agentId = req.headers["x-agent-id"] as string | undefined;

  // Generate short code and persist transaction immediately
  const short_code = nanoid(10);
  insertTransaction({
    shortCode: short_code,
    humanId: null,
    amount: config.botPrice,
    agentId: agentId || null,
  });
  
  const txRecord = getTransaction(short_code);
  if (txRecord) eventBus.emit("transaction", txRecord);

  // Fire XMTP audit asynchronously (non-blocking)
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
      name: "Agentic Checkout",
      version: "2.0.0",
    },
    message: "Payment verified. Use the short_code as a Bearer token to access /premium-data",
  });
});

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
      art: "\\n  _._     _,-'\"\"`-._\\n (,-.`._,'(       |\\`-e/|\\n     `-.-' \\ )-'( , o o)\\n           `-    \\`_`\"'-\\n      "
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
║        🚪  AGENTIC CHECKOUT  v2.0               ║
║          The Agentic Door Gateway                ║
║──────────────────────────────────────────────────║
║  Port:       ${String(config.port).padEnd(35)}║
║  Wallet:     ${(config.merchantWallet.slice(0, 10) + "...").padEnd(35)}║
║  Network:    ${config.baseSepolia.padEnd(35)}║
║              ${config.worldSepolia.padEnd(35)}║
║  Facilitator:${config.facilitatorUrl.slice(0, 35).padEnd(35)}║
║  Pricing:    3 free (human) / ${config.botPrice} (bot)${" ".repeat(11)}║
║  Stack:      x402 + AgentKit + XMTP             ║
╚══════════════════════════════════════════════════╝
  `);
});

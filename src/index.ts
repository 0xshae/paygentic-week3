import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import { config } from "./config";
import { reputationMiddleware, type ReputationData } from "./middleware/reputation";
import { getReputation, getTier, updateAfterCall } from "./reputation";
import {
  getAgent,
  ensureAgent,
  getTopAgents,
  getAllAgents,
  getCallLog,
  getRecentCalls,
  getAgentStats,
  recordCall,
  addStake,
} from "./db";
import { handleWebhook, handleSimulateWebhook } from "./locus";
import { EventEmitter } from "events";

const eventBus = new EventEmitter();

const app = express();
app.use(express.json());
app.use(express.static("public"));

// ─────────────────────────────────────────────────────
// Health Check
// ─────────────────────────────────────────────────────

app.get("/health", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    version: "1.0.0",
    gateway: "AgentCred — Reputation-Gated API Gateway",
    timestamp: Date.now(),
  });
});

// ─────────────────────────────────────────────────────
// POST /v1/generate — The Protected API Endpoint
//   1. Reputation middleware gates access
//   2. Forward to target API
//   3. Update reputation based on response
//   4. Return response with reputation metadata
// ─────────────────────────────────────────────────────

app.post(
  "/v1/generate",
  reputationMiddleware(),
  async (req: Request, res: Response) => {
    const repData = (req as any).repData as ReputationData;
    const prompt = req.body?.prompt || req.query?.prompt || "Hello, world!";

    console.log(`[Proxy] → Forwarding request for ${repData.wallet.slice(0, 10)}... (prompt: "${String(prompt).slice(0, 50)}")`);

    let statusCode = 200;
    let apiResponse: any;

    try {
      // Forward to target API (httpbin.org/post for demo)
      const targetRes = await fetch(config.targetApiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          agent: repData.wallet,
          tier: repData.tierName,
          timestamp: new Date().toISOString(),
        }),
      });

      statusCode = targetRes.status;
      apiResponse = await targetRes.json().catch(() => ({ status: statusCode }));
    } catch (err: any) {
      console.error(`[Proxy] ❌ Target API error: ${err.message}`);
      statusCode = 502;
      apiResponse = { error: "Target API unavailable", message: err.message };
    }

    // Update reputation based on response status
    const scoreBefore = repData.score;
    updateAfterCall(repData.wallet, statusCode);
    const scoreAfter = getReputation(repData.wallet);
    const tierAfter = getTier(scoreAfter);

    // Record the call in the audit log
    recordCall({
      wallet: repData.wallet,
      endpoint: "/v1/generate",
      statusCode,
      cost: repData.costPerCall,
      reputationBefore: scoreBefore,
      reputationAfter: scoreAfter,
      balanceBefore: repData.balanceBefore,
      balanceAfter: repData.balanceAfter,
    });

    // Emit event for SSE dashboard
    eventBus.emit("call", {
      wallet: repData.wallet,
      endpoint: "/v1/generate",
      statusCode,
      cost: repData.costPerCall,
      scoreBefore,
      scoreAfter,
      tierBefore: repData.tierName,
      tierAfter: tierAfter.name,
      balanceBefore: repData.balanceBefore,
      balanceAfter: repData.balanceAfter,
      timestamp: Date.now(),
    });

    const scoreChange = scoreAfter - scoreBefore;
    const arrow = scoreChange >= 0 ? "↑" : "↓";
    console.log(
      `[Proxy] ← ${statusCode} | Reputation: ${scoreBefore} → ${scoreAfter} (${arrow}${Math.abs(scoreChange)}) | Tier: ${tierAfter.name} | Cost: $${repData.costPerCall}`
    );

    // Return response with reputation metadata in headers
    res.set("X-AgentCred-Score", String(scoreAfter));
    res.set("X-AgentCred-Tier", tierAfter.name);
    res.set("X-AgentCred-Cost", String(repData.costPerCall));
    res.set("X-AgentCred-Balance", String(repData.balanceAfter));

    res.status(statusCode >= 400 ? statusCode : 200).json({
      // Wrap the actual API response with reputation metadata
      data: apiResponse,
      agentcred: {
        wallet: repData.wallet,
        reputation: scoreAfter,
        tier: tierAfter.name,
        cost_deducted: repData.costPerCall,
        balance_remaining: Math.round(repData.balanceAfter * 10000) / 10000,
        next_call_cost: tierAfter.costPerCall,
      },
    });
  }
);

// Also support GET for convenience
app.get(
  "/v1/generate",
  reputationMiddleware(),
  async (req: Request, res: Response) => {
    const repData = (req as any).repData as ReputationData;
    const prompt = req.query?.prompt || "Hello, world!";

    let statusCode = 200;
    let apiResponse: any;

    try {
      const targetRes = await fetch(config.targetApiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          agent: repData.wallet,
          tier: repData.tierName,
          timestamp: new Date().toISOString(),
        }),
      });
      statusCode = targetRes.status;
      apiResponse = await targetRes.json().catch(() => ({ status: statusCode }));
    } catch (err: any) {
      statusCode = 502;
      apiResponse = { error: "Target API unavailable", message: err.message };
    }

    const scoreBefore = repData.score;
    updateAfterCall(repData.wallet, statusCode);
    const scoreAfter = getReputation(repData.wallet);
    const tierAfter = getTier(scoreAfter);

    recordCall({
      wallet: repData.wallet,
      endpoint: "/v1/generate",
      statusCode,
      cost: repData.costPerCall,
      reputationBefore: scoreBefore,
      reputationAfter: scoreAfter,
      balanceBefore: repData.balanceBefore,
      balanceAfter: repData.balanceAfter,
    });

    eventBus.emit("call", {
      wallet: repData.wallet,
      endpoint: "/v1/generate",
      statusCode,
      cost: repData.costPerCall,
      scoreBefore,
      scoreAfter,
      tierBefore: repData.tierName,
      tierAfter: tierAfter.name,
      balanceBefore: repData.balanceBefore,
      balanceAfter: repData.balanceAfter,
      timestamp: Date.now(),
    });

    const scoreChange = scoreAfter - scoreBefore;
    console.log(
      `[Proxy] ← ${statusCode} | Rep: ${scoreBefore} → ${scoreAfter} | Tier: ${tierAfter.name} | Cost: $${repData.costPerCall}`
    );

    res.set("X-AgentCred-Score", String(scoreAfter));
    res.set("X-AgentCred-Tier", tierAfter.name);
    res.set("X-AgentCred-Cost", String(repData.costPerCall));
    res.set("X-AgentCred-Balance", String(repData.balanceAfter));

    res.status(200).json({
      data: apiResponse,
      agentcred: {
        wallet: repData.wallet,
        reputation: scoreAfter,
        tier: tierAfter.name,
        cost_deducted: repData.costPerCall,
        balance_remaining: Math.round(repData.balanceAfter * 10000) / 10000,
        next_call_cost: tierAfter.costPerCall,
      },
    });
  }
);

// ─────────────────────────────────────────────────────
// Webhooks
// ─────────────────────────────────────────────────────

// Real Locus webhook endpoint
app.post("/webhook/locus", handleWebhook);

// Simulate webhook for demo (no real Locus payment needed)
app.post("/webhook/locus/simulate", handleSimulateWebhook);

// ─────────────────────────────────────────────────────
// Agent API — Dashboard Data
// ─────────────────────────────────────────────────────

// Get all agents with reputation scores
app.get("/api/agents", (_req: Request, res: Response) => {
  const agents = getTopAgents();
  const enriched = agents.map((agent) => {
    const score = getReputation(agent.wallet);
    const tier = getTier(score);
    return {
      ...agent,
      reputation: score,
      tier: tier.name,
      cost_per_call: tier.costPerCall,
    };
  });
  res.json(enriched);
});

// Get single agent details
app.get("/api/agents/:wallet", (req: Request, res: Response) => {
  const wallet = req.params.wallet as string;
  const agent = getAgent(wallet);
  if (!agent) {
    res.status(404).json({ error: "Agent not found" });
    return;
  }
  const score = getReputation(wallet as string);
  const tier = getTier(score);
  res.json({
    ...agent,
    reputation: score,
    tier: tier.name,
    cost_per_call: tier.costPerCall,
  });
});

// Get call log for an agent
app.get("/api/agents/:wallet/log", (req: Request, res: Response) => {
  const wallet = req.params.wallet as string;
  res.json(getCallLog(wallet));
});

// Get recent calls across all agents
app.get("/api/calls", (_req: Request, res: Response) => {
  res.json(getRecentCalls());
});

// Get aggregate stats
app.get("/api/stats", (_req: Request, res: Response) => {
  res.json(getAgentStats());
});

// Seed an agent (for demo — pre-fund Agent B)
app.post("/api/seed", (req: Request, res: Response) => {
  const { wallet, stake, successful_calls } = req.body;
  if (!wallet) {
    res.status(400).json({ error: "Missing wallet" });
    return;
  }

  const agent = ensureAgent(wallet);
  const stakeAmount = parseFloat(stake) || 0;
  if (stakeAmount > 0) {
    addStake(wallet, stakeAmount);
  }

  // Simulate successful calls for reputation
  const calls = parseInt(successful_calls) || 0;
  if (calls > 0) {
    const dbModule = require("./db");
    dbModule.default.prepare("UPDATE agents SET successful_calls = ? WHERE wallet = ?").run(calls, wallet);
  }

  const updated = getAgent(wallet)!;
  const score = getReputation(wallet);
  const tier = getTier(score);

  console.log(`[Seed] ✅ Agent seeded: ${wallet} | Stake: $${stakeAmount} | Calls: ${calls} | Score: ${score} | Tier: ${tier.name}`);

  res.json({
    ...updated,
    reputation: score,
    tier: tier.name,
    cost_per_call: tier.costPerCall,
  });
});

// ─────────────────────────────────────────────────────
// SSE — Live Event Stream for Dashboard
// ─────────────────────────────────────────────────────

app.get("/api/events", (req: Request, res: Response) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const onCall = (data: any) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  eventBus.on("call", onCall);

  req.on("close", () => {
    eventBus.off("call", onCall);
  });
});

// ─────────────────────────────────────────────────────
// Boot
// ─────────────────────────────────────────────────────

app.listen(config.port, () => {
  console.log(`
╔══════════════════════════════════════════════════════╗
║    ⚡ AGENTCRED v1.0                                   ║
║    Reputation-Gated API Gateway                      ║
║──────────────────────────────────────────────────────║
║  Port:       ${String(config.port).padEnd(39)}║
║  Target:     ${config.targetApiUrl.slice(0, 39).padEnd(39)}║
║  Locus API:  ${(config.locusApiKey ? "✅ Configured" : "❌ Not set").padEnd(39)}║
║──────────────────────────────────────────────────────║
║  Tier Pricing:                                       ║
║    🥉 Bronze (0–20):  $0.01/call  (must stake $1)   ║
║    🥈 Silver (21–50): $0.005/call                    ║
║    🥇 Gold   (51+):   $0.001/call                    ║
║──────────────────────────────────────────────────────║
║  Endpoints:                                          ║
║    POST /v1/generate        — Protected API          ║
║    POST /webhook/locus      — Locus webhook          ║
║    POST /webhook/locus/sim  — Simulate payment       ║
║    GET  /api/agents         — Agent leaderboard      ║
║    GET  /api/events         — Live SSE stream        ║
║    GET  /                   — Dashboard              ║
╚══════════════════════════════════════════════════════╝
  `);
});

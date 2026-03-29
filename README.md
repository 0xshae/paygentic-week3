# GLIDE — Human-Aware API Gateway

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Stack: World ID + x402 + XMTP](https://img.shields.io/badge/Stack-World%20ID%20+%20x402%20+%20XMTP-blueviolet)](https://world.org/)
[![NPM Version](https://img.shields.io/npm/v/@0xshae/glide-gateway.svg)](https://www.npmjs.com/package/@0xshae/glide-gateway)

**Middleware that verifies World ID and unlocks payments for human-backed agent requests.**

The internet wasn't built for machines. APIs can't tell if a request comes from a real human or a bot. Glide sits in front of any API and enforces a 3-tier access model based on **proof of humanity** — powered by World ID, x402 payments, and XMTP audit receipts.

---

## Table of Contents
- [Problem Statement](#problem-statement)
- [How It Works (3-Tier Model)](#how-it-works)
- [Technological Stack](#technological-stack)
- [Architecture & File Structure](#architecture--file-structure)
- [Technical Deep Dive — Middleware](#technical-deep-dive--middleware)
- [Audit System — XMTP & Revocation](#audit-system--xmtp--revocation)
- [Integration Guide](#integration-guide)
- [Known Issues & Workarounds](#known-issues--workarounds)

---

## The Problem Statement
In the agentic economy, APIs are flooded by autonomous agents. Traditional "Pay-Per-API" models create a "Bot Tax" for humans: you shouldn't have to pay for every single request once you've proven you're a human person. Simultaneously, bots should pay to prevent spam and resource exhaustion.

**Glide solves this by:**
1. **Granting free, high-speed access** to verified humans (World ID).
2. **Enforcing on-chain settlement** for unverified bot traffic (x402).
3. **Offering "Instant Premium" access** for humans who also pay for extra features.
4. **Enabling "Strict Mode"**: Merchants can choose to completely block all bot traffic, ensuring their APIs are strictly human-only.

---

## How It Works
Glide enforces a 3-Tier Access Model directly at the middleware layer:

| Tier | Requirement | Priority | Cost | UX Effect |
| :--- | :--- | :--- | :--- | :--- |
| **BOT** | No World ID | Low | **$1.00 USDC** | 2000ms Throttle |
| **HUMAN** | World ID (Proof of Personhood) | High | **$0.00** | <50ms Latency |
| **PREMIUM**| World ID + x402 Payment | Instant | **$0.50 USDC**| <10ms + Ultra Quality |

> [!TIP]
> **Human-Only Integration**: For sensitive endpoints, Glide allows you to skip the payment tier entirely and reject any request that doesn't carry a valid Proof of Personhood.

---

## Technological Stack
- **Identity Layer**: [World ID](https://world.org/world-id) (Zk-Proofs for personhood).
- **Payment Layer**: [x402 protocol](https://x402.org) (The HTTP-native payment standard).
- **Network**: [Base Sepolia](https://base.org) (Fast, low-cost L2).
- **Communication Layer**: [XMTP](https://xmtp.org) (Audit logs & receipts).
- **Backend**: Node.js, Express, TypeScript, Better-SQLite3.
- **Frontend**: Next.js 15 (Tailwind CSS, Framer Motion).

---

## Architecture & File Structure

```text
.
├── src/
│   ├── index.ts           # Main Gateway entry (Express + x402 Resource Server)
│   ├── config.ts          # Environment & Pricing configuration
│   ├── db.ts              # SQLite layer for transaction persistence
│   ├── agentkit.ts        # World ID AgentKit hooks & extensions
│   ├── middleware/
│   │   └── glide.ts       # THE CORE: 3-tier access control logic
│   └── services/
│       └── xmtp.ts        # Fire-and-forget Audit delivery system
├── glide/                 # Next.js Dashboard & Landing Page
├── scripts/               # End-to-end demo simulations (Bot/Human/Premium)
└── README.md              # You are here
```

---

## Technical Deep Dive — Middleware

The heart of Glide is the `glideMiddleware` which resolves the access tier before the request even reaches your business logic.

### Tier Resolution Logic
The system inspects incoming HTTP headers to determine the request's "DNA":
```typescript
function resolveTier(req: Request): GlideTier {
  const hasWorldId = !!req.headers["x-world-id-proof"];
  const hasPaid = !!req.headers["x-payment-verified"];

  if (hasWorldId && hasPaid) return "premium";
  if (hasWorldId)            return "human";
  return "bot";
}
```

### Policy Enforcement
Once the tier is resolved, Glide applies the policy (throtlling, payment gating, or instant passthrough):
- **Bot Tier**: If no payment is detected, it triggers a 402 Payment Required response via the `@x402/express` server. In demo mode, it applies a `botDelayMs` (default 2s) to simulate resource throttling. 
  - *Strict Mode*: Developers can configure the middleware to return a `403 Forbidden` if no World ID is present, effectively purging all non-human traffic.
- **Human Tier**: Bypasses payment requirements entirely if a valid World ID proof is detected.

---

## Audit System — XMTP & Revocation

Every paid or human-verified transaction generates a structured audit receipt sent via XMTP. This allows human owners to monitor what their autonomous agents are doing in real-time.

### The Payload
Glide uses `@xmtp/agent-sdk` to deliver JSON payloads:
```json
{
  "type": "AGENT_TRANSACTION",
  "merchant": "AgenticStore_v1",
  "cost": "1.00",
  "currency": "USDC",
  "status": "SETTLED",
  "short_code": "xJ8-7k2P1",
  "revoke_url": "https://gateway.glide.com/revoke?code=xJ8-7k2P1"
}
```

### The Kill Switch
The `revoke_url` included in the XMTP message allows a human to instantly revoke an agent's access token stored in Glide's SQLite database. If a token is revoked, the `/premium-data` endpoint will reject all subsequent requests from that agent.

---

## Integration Guide

Glide is designed to be developer-first. You can wrap any existing API endpoint in less than 5 minutes.

1. **Install Glide**:
   `npm install @0xshae/glide-gateway`

2. **Mount the Middleware**:
```typescript
import { glideMiddleware } from "@0xshae/glide-gateway";

app.get("/api/ai-generate", 
  glideMiddleware({ 
    requireWorldId: true, 
    fallback: "pay", 
    botDelayMs: 2000 
  }), 
  (req, res) => {
    // Your actual business logic reached after identity/payment verification
    const { glideTier } = req as any;
    res.json({ message: `Access granted for ${glideTier}` });
  }
);
```

---

## Known Issues & Workarounds

- **Network Support**: The x402 facilitator currently does not support World Sepolia (eip155:4801). 
  - *Workaround*: We use **Base Sepolia** (eip155:84532) for all payment settlements while utilizing World ID for identity.
- **XMTP Identity**: XMTP delivery requires the `XMTP_RECIPIENT_ADDRESS` to be different from the `XMTP_WALLET_KEY` address to avoid self-messaging loops. 
  - *Fix*: Ensure two distinct wallets are configured in your `.env`.
- **Latency Simulation**: In our current hackathon build, the "Bot Delay" is artificial (setTimeout) to visually demonstrate the difference in quality of service. In production, this would be an actual rate-limiting bucket.

---

### GLIDE: Building the Identity-Aware Web 3.0.

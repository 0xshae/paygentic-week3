# Glide — Human-Aware API Gateway

**Middleware that verifies World ID and unlocks payments for human-backed agent requests.**

The internet wasn't built for machines. APIs can't tell if a request comes from a real human or a bot. Glide sits in front of any API and enforces a 3-tier access model based on **proof of humanity** — powered by World ID, x402 payments, and XMTP audit receipts.

## The 3-Tier Access Gradient

| Tier | World ID | Payment | Speed | Cost | Quality |
|---|---|---|---|---|---|
| 🤖 **Bot** | ✗ | Required | ~2000ms (throttled) | $1.00 | Standard |
| 🧬 **Human** | ✓ | Free | <50ms | $0.00 | High |
| ⚡ **Premium** | ✓ | Optional | <10ms | $0.50 | Ultra |

> Same API. Same request. The only difference is whether it's backed by a real human.

## How It Works

```
Agent hits API → Glide Middleware intercepts
  ├── Has World ID proof?
  │     ├── YES + Payment → ⚡ Premium (instant, highest quality)
  │     └── YES            → 🧬 Human (fast, free, high quality)
  └── NO                   → 🤖 Bot (throttled, expensive, standard)
```

## Quick Start

```bash
git clone https://github.com/0xshae/agentic-checkout.git
cd agentic-checkout && npm install
cp .env.example .env   # Add your wallet + XMTP keys
npm run dev             # Gateway at http://localhost:4021
```

## Run the Demo

We have 3 distinct scripts to showcase the on-chain transactions and World ID bypass.

```bash
# Terminal 1 — Start the Gateway
npm run dev

# Terminal 2 — Run the Demos
npm run demo:bot      # Hits /checkout (no World ID) → pays $1.00 USDC on-chain
npm run demo:human    # Hits /api/generate (with World ID) → instant, FREE access
npm run demo:premium  # Hits /checkout-premium (World ID + Pay) → pays $0.50 USDC on-chain
```

Watch your terminal log the **real Base Sepolia transaction hashes** for the bot and premium tiers, while the human tier glides through instantly.

## Integration (2 Lines of Code)

```typescript
import { glideMiddleware } from "./middleware/glide";

app.use("/api/generate", glideMiddleware({
  requireWorldId: true,
  fallback: "rate-limit"   // or "pay" or "reject"
}));
```

## Architecture

| Layer | Tech | Purpose |
|---|---|---|
| Identity | `@worldcoin/agentkit` | World ID verification on World Chain |
| Payments | `@x402/express` | HTTP-native USDC settlement on Base Sepolia |
| Audit | `@xmtp/agent-sdk` | Encrypted receipts + one-click kill-switch |
| Storage | `better-sqlite3` | Persistent usage tracking |

## License

MIT

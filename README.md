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

```bash
# In a second terminal — runs all 3 tiers back-to-back
npx tsx scripts/agent-client.ts
```

The demo calls the same `/api/generate` endpoint three times:
1. **No World ID** → throttled 2s, low-priority response
2. **With World ID** → instant, free, high-quality
3. **World ID + Payment** → instant, premium, ultra-quality

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

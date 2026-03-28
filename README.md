# 🚪 Agentic Checkout

> **The Agentic Door** — a headless checkout gateway for the agentic economy.

Most checkouts are "human-only" (CAPTCHAs, 2FA, Stripe forms). This gateway lets AI agents prove they are human-backed and pay via HTTP-native protocols. **Shopify, but for the bots.**

## Architecture

```
Agent ──▶ GET /checkout
           │
           ├─ 1. x402 Payment Gate (Coinbase)
           │     └─ No payment → HTTP 402 + PAYMENT-REQUIRED header
           │     └─ Returns USDC amount, network, payTo address
           │
           ├─ 2. AgentKit Sybil Shield (World ID)
           │     └─ Agent registered in AgentBook? Verify ZK proof
           │     └─ discount mode: 99% off for first verified human
           │     └─ $0.01 (human) vs $1.00 (bot)
           │
           ├─ 3. Checkout Success (200 OK)
           │     └─ Return product payload
           │     └─ Fire XMTP audit message (async)
           │     └─ Record transaction with short_code
           │
           └─ /revoke?code=<short_code>
                 └─ Human revokes agent access via XMTP kill-switch
```

## Stack

| Layer      | Technology                                 |
| ---------- | ------------------------------------------ |
| Payments   | x402 (`@x402/express`) — USDC on Base      |
| Identity   | World AgentKit (`@worldcoin/agentkit`)      |
| Audit      | XMTP (`@xmtp/agent-sdk`) — receipts + revocation |
| Storage    | SQLite (`better-sqlite3`) — persistent     |
| Server     | Express.js + TypeScript                    |

## Quick Start

```bash
# 1. Clone & install
git clone https://github.com/0xshae/agentic-checkout.git
cd agentic-checkout
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env with your wallet and XMTP keys

# 3. Run the gateway
npm run dev
```

## Environment Variables

| Variable                 | Description                                     |
| ------------------------ | ----------------------------------------------- |
| `MERCHANT_WALLET`        | Your wallet address for USDC payments            |
| `PORT`                   | Server port (default: 4021)                      |
| `FACILITATOR_URL`        | x402 facilitator (default: x402.org for testnet) |
| `XMTP_ENV`               | XMTP network: `dev`, `production`, or `local`   |
| `XMTP_WALLET_KEY`        | Private key for XMTP sender identity             |
| `XMTP_DB_ENCRYPTION_KEY` | 64 hex chars for XMTP local DB encryption        |
| `XMTP_RECIPIENT_ADDRESS` | Default recipient for audit messages             |

## API Reference

### `GET /health`
Health check. Returns `{ status: "ok", gateway: "Agentic Checkout" }`.

### `GET /checkout`
**The Agentic Door.** Protected by x402 + AgentKit.

Without payment → `402 Payment Required`:
```json
{
  "x402Version": 1,
  "accepts": [{
    "scheme": "exact",
    "price": "$1.00",
    "network": "eip155:84532",
    "payTo": "0x..."
  }],
  "extensions": {
    "agentkit": {
      "statement": "Verify your agent is backed by a real human to unlock a 99% discount",
      "mode": { "type": "discount", "percent": 99, "uses": 1 }
    }
  }
}
```

With valid payment → `200 OK`:
```json
{
  "status": "SETTLED",
  "product": { "name": "Agentic Checkout — Premium Access" },
  "transaction": { "short_code": "abc123xyz", "amount": "$1.00" }
}
```

### `GET /revoke?code=<short_code>`
Revoke agent access. Returns `{ status: "REVOKED" }`.

## Identity-Aware Pricing

| Scenario             | Price  | How                                    |
| -------------------- | ------ | -------------------------------------- |
| Verified Human (1st) | $0.01  | AgentKit discount (99% off, 1 use)     |
| Returning Human      | $1.00  | Discount exhausted → full price        |
| Unverified Bot       | $1.00  | No AgentKit proof → Bot Tax            |

## The Stack ("Holy Trinity")

- **x402** — HTTP-native payment. Agent gets 402, pays USDC, gets goods.
- **AgentKit** — Agent proves it's backed by a real human via World ID ZK-proof.
- **XMTP** — Every transaction sends a receipt to the human. Includes a kill-switch URL to revoke agent access.

## License

MIT

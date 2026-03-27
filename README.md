# 🚪 Agentic Checkout

> **The Agentic Door for Merchants** — a headless checkout template for the agentic economy.

Most checkouts are "human-only" (CAPTCHAs). This template lets AI agents prove they are human-backed and pay via HTTP-native protocols.

## Architecture

```
Agent ──▶ GET /checkout
           │
           ├─ 1. World ID Middleware (Sybil Shield)
           │     └─ x-world-id-proof header → verify ZK proof
           │     └─ Check nullifier_hash in SQLite
           │     └─ Set price: $0.01 (human) or $1.00 (bot)
           │
           ├─ 2. x402 Payment Gate
           │     └─ No payment → HTTP 402 + Payment-Required header
           │     └─ Valid payment → proceed to checkout
           │
           ├─ 3. Checkout Success (200 OK)
           │     └─ Return product payload
           │     └─ Fire XMTP audit message (async)
           │     └─ Record transaction with short_code
           │
           └─ /revoke?code=<short_code>
                 └─ Revoke agent access by short_code
```

## Stack

| Layer      | Technology                          |
| ---------- | ----------------------------------- |
| Backend    | Node.js / TypeScript / Express      |
| Identity   | World ID (ZK-proof verification)    |
| Payments   | x402 (HTTP 402) — USDC on Base      |
| Audit      | XMTP (machine-readable receipts)    |
| Database   | SQLite (better-sqlite3)             |

## Quick Start

```bash
# 1. Clone & install
git clone <repo-url> && cd agentic-checkout
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env with your keys

# 3. Run dev server
npm run dev
```

## Environment Variables

| Variable                | Description                              |
| ----------------------- | ---------------------------------------- |
| `MERCHANT_WALLET`       | Your wallet address for USDC payments    |
| `PORT`                  | Server port (default: 3000)              |
| `CDP_API_KEY_ID`        | Coinbase Developer Platform key ID       |
| `CDP_API_KEY_SECRET`    | Coinbase Developer Platform key secret   |
| `WORLD_APP_ID`          | Your World ID app ID                     |
| `WORLD_ACTION_ID`       | Your World ID action ID                  |
| `XMTP_PRIVATE_KEY`      | Hex private key for XMTP sender          |
| `XMTP_RECIPIENT_ADDRESS`| Default recipient for audit messages     |

## API Reference

### `GET /health`
Health check. Returns `{ status: "ok" }`.

### `GET /checkout`
The Agentic Door. Flow:
1. **World ID** — Send `x-world-id-proof` header (JSON) for human discount
2. **x402** — Pay the required amount (USDC on Base)
3. **Success** — Receive product + transaction `short_code`

**402 Response:**
```json
{
  "error": "Payment Required",
  "payment-required": {
    "amount": "1.00",
    "asset": "USDC",
    "network": "base",
    "payTo": "0x..."
  },
  "identity": {
    "humanDiscount": false,
    "price": "1.00"
  }
}
```

### `GET /revoke?code=<short_code>`
Revoke a transaction by its `short_code`. Returns `{ status: "REVOKED" }`.

## Identity-Aware Pricing

| Scenario            | Price  | Trigger                              |
| ------------------- | ------ | ------------------------------------ |
| Verified Human (1st)| $0.01  | Valid World ID + new nullifier       |
| Returning Human     | $1.00  | Valid World ID + seen nullifier      |
| No Proof (Bot)      | $1.00  | Missing `x-world-id-proof` header   |

## License

MIT

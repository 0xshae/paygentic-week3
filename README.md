# RepGate — Reputation-Gated API Gateway

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Stack: Locus Checkout + USDC](https://img.shields.io/badge/Stack-Locus%20Checkout%20+%20USDC-blueviolet)](https://paywithlocus.com)

**An API gateway that enforces access based on onchain reputation — agents stake USDC via Locus Checkout and earn lower rates through successful usage.**

> Built for the [Paygentic Week 3 — CheckoutWithLocus](https://docs.paywithlocus.com/hackathon) hackathon.

---

## The Problem

APIs can't tell good agents from bad ones. New agents pay the same as veterans, and there's no incentive for agents to maintain a clean track record. Meanwhile, API providers eat the cost of abusive traffic.

## The Solution

**RepGate** sits in front of any API and enforces a 3-tier pricing model based on **onchain reputation**:

| Tier | Score | Cost/Call | Requirements |
|:-----|:------|:----------|:-------------|
| 🥉 **Bronze** | 0–20 | $0.01 USDC | Must stake $1 USDC first |
| 🥈 **Silver** | 21–50 | $0.005 USDC | — |
| 🥇 **Gold** | 51–100 | $0.001 USDC | — |

**Reputation score (0–100)** is computed from:
- **Stake**: Each 0.1 USDC staked → +1 point (max 50)
- **Success**: Each successful API call (2xx) → +0.5 point (max 50)
- **Failure**: Each failed call (4xx/5xx) → -2 points

---

## How It Works

```
Agent → x-agent-wallet header → RepGate Middleware
                                    ↓
                        [Check reputation & balance]
                            ↓              ↓
                    Balance OK?       No balance?
                        ↓                  ↓
                  Deduct cost      Return Locus
                  Forward to       Checkout URL
                  target API       (HTTP 402)
                        ↓
                  Update reputation
                  based on response
```

1. Agent sends request with `x-agent-wallet` header
2. RepGate computes reputation score → determines tier → calculates cost
3. If insufficient balance: returns a Locus Checkout URL for staking
4. If balance OK: deducts cost, forwards request to target API
5. On response: updates reputation (+0.5 for success, -2 for failure)
6. Returns response with reputation metadata in headers

---

## Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/0xshae/paygentic-week3.git
cd paygentic-week3
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env`:

```env
PORT=4021
LOCUS_API_KEY=claw_dev_your_key_here
LOCUS_WEBHOOK_SECRET=whsec_your_secret_here
TARGET_API_URL=https://httpbin.org/post
PUBLIC_URL=http://localhost:4021
```

| Variable | Description |
|----------|-------------|
| `LOCUS_API_KEY` | Your Locus beta API key (get one at [beta.paywithlocus.com](https://beta.paywithlocus.com)) |
| `LOCUS_WEBHOOK_SECRET` | Webhook signing secret from Locus (optional for demo) |
| `TARGET_API_URL` | The real API to proxy (defaults to httpbin.org) |
| `PUBLIC_URL` | Your public URL for webhook callbacks |

### 3. Start the Server

```bash
npm run dev
```

Open [http://localhost:4021](http://localhost:4021) for the live dashboard.

---

## Demo Walkthrough

### Agent A — Brand New, Never Staked

```bash
bash scripts/demo-agent-a.sh
```

Shows:
1. First call → `402` with Locus Checkout URL
2. Simulated payment → $1 USDC stake added
3. Reputation jumps from 0 → 10
4. 10 successful calls → reputation climbs to ~14
5. Each call costs $0.01 (Bronze tier)

### Agent B — Trusted, Pre-Funded

```bash
bash scripts/demo-agent-b.sh
```

Shows:
1. Pre-seeded with $5 USDC + 20 successful calls (reputation ~50)
2. Starts at Silver tier ($0.005/call)
3. After a few calls, crosses into Gold tier ($0.001/call)
4. 20 calls for just $0.032 total vs $0.20 at Bronze prices

---

## API Reference

### Protected Endpoint

```bash
# POST /v1/generate
curl -X POST http://localhost:4021/v1/generate \
  -H "Content-Type: application/json" \
  -H "x-agent-wallet: 0xYourAgentWallet" \
  -d '{"prompt": "hello"}'
```

**Success (200):**
```json
{
  "data": { /* response from target API */ },
  "repgate": {
    "wallet": "0xYourAgentWallet",
    "reputation": 14,
    "tier": "Bronze",
    "cost_deducted": 0.01,
    "balance_remaining": 0.9,
    "next_call_cost": 0.01
  }
}
```

**Stake Required (402):**
```json
{
  "action": "stake_required",
  "checkout_url": "https://checkout.paywithlocus.com/session_abc123",
  "min_stake": 1,
  "current_balance": 0,
  "reputation": 0,
  "tier": "Bronze"
}
```

### Webhook

```bash
# Real Locus webhook
POST /webhook/locus

# Simulate payment (for demo)
POST /webhook/locus/simulate
curl -X POST http://localhost:4021/webhook/locus/simulate \
  -H "Content-Type: application/json" \
  -d '{"wallet": "0xYourWallet", "amount": 1}'
```

### Dashboard APIs

| Endpoint | Description |
|----------|-------------|
| `GET /api/agents` | List all agents with reputation scores |
| `GET /api/agents/:wallet` | Get single agent details |
| `GET /api/agents/:wallet/log` | Get call audit log |
| `GET /api/calls` | Recent calls across all agents |
| `GET /api/stats` | Aggregate statistics |
| `GET /api/events` | SSE live event stream |
| `POST /api/seed` | Seed an agent (for demo) |

---

## Architecture

```
paygentic-week3/
├── src/
│   ├── index.ts                 # Express server + all routes
│   ├── config.ts                # Environment config + tier definitions
│   ├── db.ts                    # SQLite schema + data access layer
│   ├── reputation.ts            # Score computation + tier resolution
│   ├── locus.ts                 # Locus Checkout session creation + webhooks
│   └── middleware/
│       └── reputation.ts        # Request interception + balance gating
├── public/
│   └── index.html               # Live dashboard (glassmorphism UI)
├── scripts/
│   ├── demo-agent-a.sh          # New agent demo script
│   ├── demo-agent-b.sh          # Trusted agent demo script
│   └── seed-agent-b.sh          # Pre-fund Agent B
├── .env.example
├── package.json
└── tsconfig.json
```

---

## Technology Stack

- **Backend**: Node.js + Express + TypeScript
- **Database**: SQLite (via better-sqlite3) — local reputation cache
- **Payments**: [Locus Checkout SDK](https://docs.paywithlocus.com/checkout/index) — USDC payments
- **Network**: Base (USDC)
- **Target API**: Any HTTP endpoint (httpbin.org for demo)

---

## Locus Integration

RepGate uses [Locus Checkout](https://docs.paywithlocus.com/checkout/index) for agent staking:

1. **Session Creation**: When an agent needs to stake, RepGate creates a Locus Checkout session via the SDK
2. **Payment**: Agent (or human) pays at the checkout URL using Locus Wallet, external wallet, or agent API
3. **Webhook**: Locus sends `checkout.session.paid` to `/webhook/locus`
4. **Balance Update**: RepGate adds the USDC to the agent's stake balance

For local development, use the simulate endpoint:
```bash
POST /webhook/locus/simulate
{"wallet": "0x...", "amount": 1}
```

---

## License

MIT

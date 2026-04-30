# AgentCred — Integration Guide

## 1. Prerequisites
- **Node.js** v18+
- A Locus API key (get one at [beta.paywithlocus.com](https://beta.paywithlocus.com) with code `PAYGENTIC`)

## 2. Setup

```bash
git clone https://github.com/0xshae/paygentic-week3.git
cd paygentic-week3
npm install
cp .env.example .env
```

Set your Locus API key in `.env`:
```env
LOCUS_API_KEY=claw_dev_your_key_here
TARGET_API_URL=https://your-actual-api.com/endpoint
```

## 3. Protect Your API

AgentCred acts as a reverse proxy. Set `TARGET_API_URL` to your real API endpoint. All requests to `/v1/generate` will be forwarded after reputation and balance checks pass.

## 4. Agent Integration

Agents send requests with the `x-agent-wallet` header:

```bash
curl -X POST https://your-agentcred-instance.com/v1/generate \
  -H "Content-Type: application/json" \
  -H "x-agent-wallet: 0xAgentWalletAddress" \
  -d '{"prompt": "Generate something"}'
```

### Flow:
1. **First request** → Agent receives a Locus Checkout URL to stake USDC
2. **Payment** → Agent or human pays via the checkout link
3. **Subsequent requests** → Deducted from stake balance, reputation grows
4. **Higher reputation** → Lower costs per call

## 5. Webhook Setup

For production, set `PUBLIC_URL` to your publicly accessible URL and configure Locus webhooks:

```env
PUBLIC_URL=https://your-domain.com
LOCUS_WEBHOOK_SECRET=whsec_from_locus
```

For local testing, use the simulate endpoint instead:
```bash
curl -X POST http://localhost:4021/webhook/locus/simulate \
  -H "Content-Type: application/json" \
  -d '{"wallet": "0xAgent...", "amount": 1}'
```

## 6. Launch

```bash
npm run dev     # Development
npm run build   # Build for production
npm start       # Production
```

Open `http://localhost:4021` to view the live reputation dashboard.

# Agentic Checkout — Merchant Integration Guide

Welcome to the open-source **Agentic Gateway**. This guide helps you easily deploy the gateway and start monetizing API access from AI agents using x402, AgentKit, and XMTP.

## 1. Prerequisites
- **Node.js** v18+
- An EVM-compatible wallet address to receive funds.
- A secondary "sitter" wallet for the server to dispatch XMTP messages.

## 2. Setup your Environment

Clone the repository and install dependencies:
```bash
git clone https://github.com/0xshae/agentic-checkout.git
cd agentic-checkout
npm install
```

Copy the example environment template:
```bash
cp .env.example .env
```

Set your configuration:
```env
# Your receiving wallet (on Base)
MERCHANT_WALLET=0xYourReceivingAddress

# The server's XMTP dispatcher wallet PRIVATE key (keep this secret!)
XMTP_WALLET_KEY=0xYourSendingPrivateKey

# Your personal wallet where you want to receive push notifications
XMTP_RECIPIENT_ADDRESS=0xClientAddress
```

## 3. Register your Agent (Human Discount)
To enable the **World ID 99% Discount** for your human-backed agents, they must register their agent wallets on-chain using the official Worldcoin CLI:

```bash
npx @worldcoin/agentkit-cli register 0xTheirAgentAddress
```
This triggers a verification dialog inside the World App. Once completed, the agent generates a verifiable proof of human backing without relying on easily-spoofed REST headers!

## 4. Launch the Gateway
Start your server. The built-in dashboard provides a live UI for tracking and revoking agent access.

```bash
# Development mode
npm run dev

# Production build
npm run build
npm start
```

## 5. Next Steps
Open `http://localhost:4021` (or your deployed domain) to view the **Live Transaction Dashboard**. You can physically **Revoke** agent sessions (Kill-Switch) straight from the UI!

> 💡 **Customizing Data**: Swap the mock `/premium-data` endpoint in `src/index.ts` with your real backend logic. The gateway handles the validation for you—just check that `tx.revoked !== 1` and return your real product!

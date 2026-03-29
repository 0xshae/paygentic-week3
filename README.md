# Glide — Infrastructure for the Agentic Web

**The only drop-in payment gateway that lets merchants monetize AI traffic natively.** 

The internet was built for human clicks. Glide is built for machine velocity. We enable merchants to protect their APIs and content behind an HTTP-native paywall that AI agents can actually pay, while giving verified humans a frictionless pass.

![Glide](https://raw.githubusercontent.com/0xshae/glide/main/public/og-image.png) <!-- Update later to real OG image if needed -->

## The Glide Pillars

### ⚡️ Absolute Velocity (x402)
Sub-second settlement via HTTP headers (`@x402/express`). No redirects. No browser tabs. When an agent hits your protected endpoint, it is challenged with a `402 Payment Required`. It signs a real USDC transaction on Base Sepolia and gets immediate access. Pure, machine-to-machine commerce.

### 🧬 Identity Fluidity (World AgentKit)
Seamlessly separate bots from humans via World ID (`@worldcoin/agentkit`). Charge a premium for algorithmic access ("The Bot Tax"), or let verified humans glide through. 
* **Current Mode:** Free Trial (Verified humans get 3 free requests; bots pay $1.00 USDC per request).

### 🛡 Immutable Trust (XMTP)
Total visibility without the friction. Every transaction generates a real-time XMTP cryptographic receipt sent to the human owner (`@xmtp/agent-sdk`). It includes a **one-click kill-switch**. If the agent goes rogue, the human revokes access instantly.

---

## The Demo

We built a live dashboard to visualize this machine-to-machine interaction.

### 1. Launch the Gateway
```bash
# Clone the repository
git clone https://github.com/0xshae/agentic-checkout.git
cd agentic-checkout

# Install dependencies
npm install

# Configure environment (.env.example -> .env)
# Add your receiving wallet and XMTP keys
cp .env.example .env

# Start the gateway
npm run dev
```
Open [http://localhost:4021](http://localhost:4021) to view the live Merchant Dashboard.

### 2. Run the Agent
In a separate terminal, launch our demo agent to simulate an AI trying to access your premium data:
```bash
EVM_PRIVATE_KEY=0x_YOUR_AGENT_WALLET npm run agent:demo
```
**What happens:**
1. The agent hits `GET /checkout`.
2. Glide replies with `402 Payment Required` + x402 payment details.
3. The agent auto-signs a $1.00 USDC transaction on Base Sepolia.
4. The transaction appears **in real-time on your dashboard**.
5. The agent begins continuously polling `/premium-data` every 3 seconds.

### 3. The Kill Switch
While the agent is polling, click the red **Kill Switch** button directly in the Glide Dashboard UI. 
The agent's terminal will instantly crash with `🚫 403 FORBIDDEN — Access revoked by human owner!` and the dashboard row will flash revoked.

---

## 🛠 Integration (2 Lines of Code)

Ready to add Glide to your backend? It's just Express middleware.

```typescript
import { glideGateway } from '@glide/core'; // pseudo-code for our implementation

// Protect your existing API from unpaid bots
app.use('/premium-data', glideGateway({ 
  botPrice: '$1.00', 
  humanDiscountUses: 3 
}));
```

See [INTEGRATION.md](./INTEGRATION.md) for the full 5-step integration guide on how to run this source code yourself.

## License

MIT

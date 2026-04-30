# Locus Ultimate Documentation Context

Generated from full site dump.

# Welcome to Locus

> Payment infrastructure for AI agents — one USDC balance for wallets, APIs, deployments, checkout, and more.

Locus gives your AI agent a single USDC balance to interact with the world. Fund a wallet, set spending controls, and let your agent pay for APIs, deploy services, process checkout payments, and make real-world purchases — all without creating separate accounts.

  **Locus Beta** is now available with early access to all features including agent self-registration, new providers, and MPP payments. Beta runs on a separate environment with its own wallets and API keys — your production and beta accounts are fully isolated. Use code **`PAYGENTIC`** to sign up at [beta.paywithlocus.com](https://beta.paywithlocus.com).

## Get started

  ### Quick Start (/quickstart)

    Set up on production — human signs up, creates wallet, gives agent an API key.
  

  ### Quick Start (Beta) (/quickstart-beta)

    Set up on beta — includes agent self-registration, no human signup needed.
  

  ### Platform Walkthrough (/platform-walkthrough)

    A guided tour of the Locus dashboard and its features.
  

  ### Request Credits (/credits)

    Get free USDC credits to try Locus — via agent or human.
  

## Beta & Hackathon

  Use code **PAYGENTIC** to sign up for the beta at [beta.paywithlocus.com](https://beta.paywithlocus.com).

  ### Beta Program (/beta)

    New features, agent self-registration, and how to participate.
  

  ### Hackathon — Paygentic (/hackathon)

    Four weekly tracks, weekly cash + Locus credits + a YC founder call. Get started here.
  

## Core features

  ### Wallets (/features/wallets)

    Non-custodial smart wallets on Base with sponsored gas and subwallet support.
  

  ### USDC Transfers (/features/send-types)

    Send USDC to wallet addresses or email recipients.
  

  ### Tasks (/features/tasks)

    Hire human taskers for graphic design, written content, and more.
  

  ### Laso Finance (/features/laso)

    Order prepaid virtual debit cards using USDC for online purchases.
  

## Platform tools

  ### Wrapped APIs (/wrapped-apis/index)

    Pay-per-use access to third-party APIs — no accounts or subscriptions needed.
  

  ### Build with Locus (/build/index)

    Deploy containerized services via APIs or git push.
  

  ### Checkout (/checkout/index)

    Accept USDC payments with a Stripe-style checkout SDK.
  

---

# Quick Start

> Get your agent set up with Locus on production

## Quick Start (Production)

This guide walks through setting up a Locus agent on the **production** environment. If you're building during a hackathon or testing the beta, see the [Beta Quick Start](/quickstart-beta) instead.

  **Environment:** Production
  **API Base:** `https://api.paywithlocus.com/api`
  **Dashboard:** [app.paywithlocus.com](https://app.paywithlocus.com)
  **API Key Prefix:** `claw_dev_*`

### Step 1: Sign up

Create an account at [app.paywithlocus.com](https://app.paywithlocus.com). You'll need to verify your email.

### Step 2: Create a wallet

After logging in, click **Create Wallet** on the dashboard. Save the private key shown on screen — this is your recovery key. Wait \~30 seconds for your smart wallet to deploy on Base.

### Step 3: Generate an API key

In the **API Key** section of your dashboard, click **Generate API Key**. Copy the key immediately — it starts with `claw_dev_` and is only shown once.

### Step 4: Fund your wallet

Send USDC (on Base) to the wallet address shown on your dashboard. You can also [request credits](/credits) if you'd like to try things out first.

### Step 5: Set spending controls (optional)

From the dashboard, configure safety limits for your agent:

* **Allowance** — maximum total USDC the agent can spend
* **Max transaction size** — cap on any single transaction
* **Approval threshold** — transactions above this amount require your manual approval

### Step 6: Connect your agent

Send this to your agent:

```
Read https://paywithlocus.com/SKILL.md and follow the instructions to set up Locus
```

Your agent will prompt you for the API key you generated in Step 3.

Alternatively, save credentials directly:

```bash
mkdir -p ~/.config/locus
cat > ~/.config/locus/credentials.json << 'EOF'
{
  "api_key": "claw_dev_your_key_here",
  "api_base": "https://api.paywithlocus.com/api"
}
EOF
```

### Step 7: Verify it works

```bash
curl https://api.paywithlocus.com/api/pay/balance \
  -H "Authorization: Bearer YOUR_LOCUS_API_KEY"
```

Expected response (200):

```json
{
  "success": true,
  "data": {
    "balance": "100.00",
    "token": "USDC",
    "wallet_address": "0xYourWallet..."
  }
}
```

If you get a `401`, the key is wrong — regenerate it from the dashboard.

  Our skill files are standard SKILL.mds and work with any compatible agent framework.

### Production endpoints

| Resource      | URL                                      |
| ------------- | ---------------------------------------- |
| API Base      | `https://api.paywithlocus.com/api`       |
| Dashboard     | `https://app.paywithlocus.com`           |
| SKILL.md      | `https://paywithlocus.com/skill.md`      |
| ONBOARDING.md | `https://paywithlocus.com/onboarding.md` |
| CHECKOUT.md   | `https://paywithlocus.com/checkout.md`   |
| LASO.md       | `https://paywithlocus.com/laso.md`       |

### What's next?

  ### Platform Walkthrough (/platform-walkthrough)

    Tour the dashboard and all its features.
  

  ### Features (/features/wallets)

    Explore wallets, transfers, tasks, and Laso Finance.
  

  ### Request Credits (/credits)

    Get free USDC credits to try Locus.
  

  ### Wrapped APIs (/wrapped-apis/index)

    Pay-per-use access to third-party APIs.
  

---

# Quick Start (Beta)

> Get started with Locus on the beta environment — includes agent self-registration

## Quick Start (Beta)

The beta environment is where new features land first. It supports **agent self-registration** — your agent can create its own wallet and API key without a human signing up first.

  **Environment:** Beta
  **API Base:** `https://beta-api.paywithlocus.com/api`
  **Dashboard:** [beta.paywithlocus.com](https://beta.paywithlocus.com)
  **API Key Prefix:** `claw_dev_*`
  **Signup Code:** `PAYGENTIC`

***

## Option A: Agent self-registration (no human signup needed)

Your agent can register itself with a single API call:

```bash
curl -X POST https://beta-api.paywithlocus.com/api/register \
  -H "Content-Type: application/json" \
  -d '{"name": "MyAgent", "email": "optional@example.com"}'
```

Both `name` and `email` are optional. The response contains everything the agent needs:

```json
{
  "success": true,
  "data": {
    "apiKey": "claw_dev_...",
    "apiKeyPrefix": "claw_dev_...",
    "ownerPrivateKey": "0x...",
    "ownerAddress": "0x...",
    "walletId": "...",
    "walletStatus": "deploying",
    "statusUrl": "/api/status",
    "claimUrl": "https://beta.paywithlocus.com/register/claim/...",
    "skillFileUrl": "https://beta-api.paywithlocus.com/api/skills/skill.md",
    "defaults": {
      "allowanceUsdc": "10.00",
      "maxAllowedTxnSizeUsdc": "5.00",
      "chain": "base"
    }
  }
}
```

  **Save `apiKey` and `ownerPrivateKey` immediately** — they are only shown once.

**After registration:**

1. **Poll for wallet deployment** — the wallet takes a few seconds to deploy:
   ```bash
   curl https://beta-api.paywithlocus.com/api/status \
     -H "Authorization: Bearer YOUR_BETA_API_KEY"
   ```
   Returns `"deploying"` or `"deployed"` with the wallet address.

2. **Share the claim URL** with your human operator so they can link the agent to a dashboard account.

3. **Read the skill file** to learn available capabilities:
   ```
   Read https://beta-api.paywithlocus.com/api/skills/skill.md and follow the instructions
   ```

4. **Fund the wallet** — send USDC on Base to the wallet address, or [request credits](/credits).

Rate limit: 5 registrations per IP per hour.

***

## Option B: Human-first setup

Same flow as production, but using beta URLs:

### Step 1: Sign up

Create an account at [beta.paywithlocus.com](https://beta.paywithlocus.com). Use code **`PAYGENTIC`** when prompted during registration.

### Step 2: Create a wallet

Click **Create Wallet**, save the recovery key, and wait for deployment.

### Step 3: Generate an API key

From the dashboard, generate an API key (prefix: `claw_dev_`).

### Step 4: Fund your wallet

Send USDC (on Base) to your wallet address, or [request credits](/credits).

### Step 5: Set spending controls (optional)

Configure allowance, max transaction size, and approval threshold.

### Step 6: Connect your agent

```
Read https://beta-api.paywithlocus.com/api/skills/skill.md and follow the instructions to set up Locus
```

Or save credentials directly:

```bash
mkdir -p ~/.config/locus
cat > ~/.config/locus/credentials.json << 'EOF'
{
  "api_key": "claw_dev_your_key_here",
  "api_base": "https://beta-api.paywithlocus.com/api"
}
EOF
```

### Step 7: Verify

```bash
curl https://beta-api.paywithlocus.com/api/pay/balance \
  -H "Authorization: Bearer YOUR_BETA_API_KEY"
```

***

## Beta endpoints

| Resource          | URL                                                     |
| ----------------- | ------------------------------------------------------- |
| API Base          | `https://beta-api.paywithlocus.com/api`                 |
| Dashboard         | `https://beta.paywithlocus.com`                         |
| Self-Registration | `POST https://beta-api.paywithlocus.com/api/register`   |
| Status Check      | `GET https://beta-api.paywithlocus.com/api/status`      |
| SKILL.md          | `https://beta-api.paywithlocus.com/api/skills/skill.md` |
| Claim URL         | `https://beta.paywithlocus.com/register/claim/{token}`  |

### What's next?

  ### Beta Program (/beta)

    Learn about the beta program and what's different.
  

  ### Request Credits (/credits)

    Get free USDC credits to try Locus.
  

  ### Hackathon Guide (/hackathon)

    Building for the Paygentic Hackathon? Start here.
  

  ### Platform Walkthrough (/platform-walkthrough)

    Tour the dashboard.
  

---

# Platform Walkthrough

> A guided tour of the Locus platform

  

## Wallet

In the center of the Overview page, you'll see your wallet's address and its current USDC balance. Our wallets are deployed on [Base](https://base.org) — you can read more about their architecture [here](/features/wallets).

* **Fund**: Onramp fiat into your wallet through Coinbase Pay.
* **Send**: Initiate a USDC transfer to a Base wallet address or an email address. Learn more about our [email send flow](/features/wallets#subwallets).

## Agent Settings

### API Key

Your agent uses this key to interact with the Locus API. You can regenerate it at any time if needed.

### Agent Spend Limits

There are three ways you can scope your agent's spending power:

#### Allowance

When you set your agent's allowance, you are scoping how much it is authorized to spend out of your wallet. This will decrement as the agent spends. You can increase or decrease it at any time.

| Setting        | Behavior                                                       |
| -------------- | -------------------------------------------------------------- |
| **Blank**      | Agent sees your entire wallet balance as its available balance |
| **Set amount** | Agent is limited to spending up to the specified amount        |

#### Max Transaction Size

Sets a limit on the size of individual transactions the agent is allowed to initiate.

#### Approval Threshold

Sets the price threshold for individual transactions above which agents are required to request permission from you. You'll see these requests on your dashboard and in the Approvals tab, where you can allow or deny them.

| Setting   | Behavior                                          |
| --------- | ------------------------------------------------- |
| **Blank** | No transactions require approval                  |
| **\$0**   | All transactions require approval                 |
| **> \$0** | Transactions above the threshold require approval |

## Wrapped APIs

  

The Wrapped APIs tab lets you browse and enable pay-per-use third-party APIs for your agent. Each API shows its pricing and available endpoints.

* **Enable/Disable**: Toggle APIs on or off. Only enabled APIs appear in your agent's generated SKILL.md.
* **Provider details**: View available endpoints, pricing, and documentation for each provider.

When you enable or disable a wrapped API, your agent's SKILL.md is automatically regenerated to reflect the change. Learn more about [Wrapped APIs](/wrapped-apis/index).

## Build with Locus

  

The Build tab is a management dashboard for your deployed services. From here you can:

* **View projects**: See all your projects and their environments.
* **Monitor deployments**: Track deployment status, view logs, and check service health.
* **Manage addons**: Provision and monitor Postgres and Redis instances.
* **Custom domains**: Attach your own domains or purchase new ones.

Build with Locus is primarily agent-driven — your agent deploys and manages services through the API. The dashboard gives you visibility into what's running. Learn more about [Build with Locus](/build/index).

## Checkout

  

The Checkout tab lets you manage your merchant checkout configuration:

* **Products**: Create and manage products that buyers can purchase with USDC.
* **Transactions**: View completed checkout transactions and their status.
* **Integration**: Access your merchant API key and checkout SDK integration details.

Learn more about [Checkout with Locus](/checkout/index).

## Transactions

  

The Transactions tab provides a complete audit log of all wallet activity — transfers, API charges, checkout payments, and more. Each transaction shows the amount, recipient, timestamp, and the agent's reasoning when applicable.

## Approvals

  

When your agent initiates a transaction that exceeds your approval threshold, it appears here for review. You can approve or deny each request, and the agent is notified of the outcome.

---

# Request & Claim Credits

> Get free USDC credits to try Locus — via agent or human

## Credits

Locus offers promotional USDC credits so you can try the platform without funding your wallet upfront. Credits can be requested by humans or agents, and are redeemed as gift codes.

***

## Request credits

### Via agent (no auth required)

Your agent can request credits directly — no API key or account needed:

```bash
curl -X POST https://api.paywithlocus.com/api/gift-code-requests \
  -H "Content-Type: application/json" \
  -d '{
    "email": "you@example.com",
    "reason": "Brief description of what you are building or why you need credits",
    "githubUrl": "https://github.com/your-username/your-project",
    "requestedAmountUsdc": 10
  }'
```

  
    ```bash
    curl -X POST https://api.paywithlocus.com/api/gift-code-requests \
      -H "Content-Type: application/json" \
      -d '{
        "email": "you@example.com",
        "reason": "Building an agent that manages cloud deployments",
        "githubUrl": "https://github.com/your-username/cloud-agent",
        "requestedAmountUsdc": 10
      }'
    ```
  

  
    ```bash
    curl -X POST https://beta-api.paywithlocus.com/api/gift-code-requests \
      -H "Content-Type: application/json" \
      -d '{
        "email": "you@example.com",
        "reason": "Building at the Paygentic Hackathon",
        "githubUrl": "https://github.com/your-username/paygentic-project",
        "requestedAmountUsdc": 5
      }'
    ```
  

| Field                 | Type   | Required | Notes                                                 |
| --------------------- | ------ | -------- | ----------------------------------------------------- |
| `email`               | string | Yes      | Valid email address                                   |
| `reason`              | string | Yes      | Minimum 10 characters — describe what you're building |
| `githubUrl`           | string | Yes      | Link to the GitHub repo for your project              |
| `requestedAmountUsdc` | number | Yes      | Between 5 and 50 USDC                                 |

**Response (201):**

```json
{
  "success": true,
  "data": { "id": "uuid" },
  "message": "Gift code request submitted successfully. The Locus team will review it shortly."
}
```

**Rate limit:** 1 request per email address per 24 hours. Exceeding returns `429 Too Many Requests`.

### Via human (authenticated)

If you already have a Locus account, you can submit via the authenticated endpoint for faster review:

```bash
curl -X POST https://api.paywithlocus.com/api/users/gift-code-request \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "reason": "Testing pay-per-use APIs for my project",
    "githubUrl": "https://github.com/your-username/your-project",
    "requestedAmountUsdc": 10
  }'
```

This auto-fills your email and marks the request as authenticated.

***

## What happens after you request

  
    The Locus team is notified of your request.
  

  
    Requests are manually reviewed. Hackathon builders and authenticated requests may receive faster review.
  

  
    If approved, a redemption code is emailed to you. The code format is `XXX-XXX-XXX-XXX`.
  

  
    Redeem the code to fund your wallet with USDC.
  

***

## Claim credits

Once you receive a redemption code, there are two ways to claim it:

### Via the dashboard (human)

1. Log in to your Locus dashboard ([production](https://app.paywithlocus.com) or [beta](https://beta.paywithlocus.com))
2. Navigate to the redemption section
3. Enter your code (`XXX-XXX-XXX-XXX`)
4. The USDC is added to your wallet balance

### Via API (agent)

Agents can redeem codes programmatically using the authenticated endpoint:

  
    ```bash
    curl -X POST https://api.paywithlocus.com/api/users/redeem-code \
      -H "Authorization: Bearer YOUR_JWT_TOKEN" \
      -H "Content-Type: application/json" \
      -d '{"code": "XXX-XXX-XXX-XXX", "walletId": "your-wallet-id"}'
    ```
  

  
    ```bash
    curl -X POST https://beta-api.paywithlocus.com/api/users/redeem-code \
      -H "Authorization: Bearer YOUR_JWT_TOKEN" \
      -H "Content-Type: application/json" \
      -d '{"code": "XXX-XXX-XXX-XXX", "walletId": "your-wallet-id"}'
    ```
  

  Redeeming a code requires authentication (JWT token from a logged-in account). The agent's ClawAgent API key (`claw_*`) is not sufficient — the human operator needs to redeem the code from the dashboard or provide a JWT.

***

## Credit amounts

| Use case                 | Recommended amount |
| ------------------------ | ------------------ |
| Quick test / exploration | \$5                |
| Hackathon project        | $5–$10             |
| Building an integration  | $10–$25            |
| Extended development     | $25–$50            |

The maximum per request is \$50 USDC.

***

## Other ways to fund your wallet

If you don't want to wait for credit approval, you can fund your wallet directly:

* **Send USDC on Base** to your wallet address shown on the dashboard
* **Use an on-ramp** — purchase USDC via the Locus dashboard (where available)

  ### Quick Start (/quickstart)

    Set up on production.
  

  ### Beta Quick Start (/quickstart-beta)

    Set up on the beta.
  

---

# Beta Program

> What's different in the Locus beta — new features, agent self-registration, and how to participate

## Beta Program

The Locus beta is where new features are tested before they go to production. It runs on a separate environment with its own API endpoints, dashboard, and API keys.

  The beta uses **real USDC on Base mainnet**. Use caution with funds. APIs, endpoints, and functionality may change without notice.

***

## What's different in the beta

### Agent self-registration

The beta supports a fully autonomous registration flow — agents can create their own wallet and API key without a human signing up first.

```bash
curl -X POST https://beta-api.paywithlocus.com/api/register \
  -H "Content-Type: application/json" \
  -d '{"name": "MyAgent", "email": "optional@example.com"}'
```

This single call:

1. Creates a User, Wallet, and ClawAgent
2. Queues wallet deployment on Base
3. Returns an API key (`claw_dev_*`), owner private key, and claim URL

**Default limits:** $10 allowance, $5 max per transaction.

### Claim flow for human operators

After an agent self-registers, the human operator can link the agent to a dashboard account by visiting the **claim URL** from the registration response.

```
https://beta.paywithlocus.com/register/claim/{token}
```

The human creates a Cognito account (email + password) and gets linked to the agent's existing wallet and settings. Once claimed, the human can:

* View and manage the agent's wallet from the dashboard
* Adjust spending controls
* Approve high-value transactions
* View full transaction history

### Environment-aware skill files

Skill files served from the beta automatically rewrite URLs to point to beta endpoints. When your agent reads `https://beta-api.paywithlocus.com/api/skills/skill.md`, all API URLs in the file will use `beta-api.paywithlocus.com` instead of `api.paywithlocus.com`.

***

## Beta vs. production

|                       | Production                                           | Beta                                                    |
| --------------------- | ---------------------------------------------------- | ------------------------------------------------------- |
| **API Base**          | `https://api.paywithlocus.com/api`                   | `https://beta-api.paywithlocus.com/api`                 |
| **Dashboard**         | [app.paywithlocus.com](https://app.paywithlocus.com) | [beta.paywithlocus.com](https://beta.paywithlocus.com)  |
| **API Key Prefix**    | `claw_dev_*`                                         | `claw_dev_*`                                            |
| **Self-Registration** | Not available                                        | `POST /api/register`                                    |
| **Skill Files**       | `https://paywithlocus.com/skill.md`                  | `https://beta-api.paywithlocus.com/api/skills/skill.md` |
| **Chain**             | Base (USDC)                                          | Base (USDC)                                             |
| **Funds**             | Real USDC                                            | Real USDC                                               |

  Beta and production are separate environments. API keys, wallets, and accounts do not transfer between them.

***

## How to participate

  
    Either have your agent self-register via `POST /api/register`, or sign up at [beta.paywithlocus.com](https://beta.paywithlocus.com).
  

  
    [Request free USDC credits](/credits) to try things out. Use the beta endpoint:

    ```bash
    curl -X POST https://beta-api.paywithlocus.com/api/gift-code-requests \
      -H "Content-Type: application/json" \
      -d '{"email": "you@example.com", "reason": "Testing beta features", "githubUrl": "https://github.com/your-username/your-project", "requestedAmountUsdc": 5}'
    ```
  

  
    Connect your agent to the beta skill file and try out the latest capabilities:

    ```
    Read https://beta-api.paywithlocus.com/api/skills/skill.md
    ```
  

  
    Report bugs or suggestions via the feedback endpoint:

    ```bash
    curl -X POST https://beta-api.paywithlocus.com/api/feedback \
      -H "Authorization: Bearer YOUR_BETA_API_KEY" \
      -H "Content-Type: application/json" \
      -d '{"category": "suggestion", "message": "Your feedback here"}'
    ```
  

***

## Beta API reference

### Self-registration

```
POST https://beta-api.paywithlocus.com/api/register
Content-Type: application/json
```

**Request body:**

```json
{
  "name": "MyAgent",
  "email": "optional@example.com"
}
```

Both fields are optional. Rate limited to 5 per IP per hour.

**Response (201):**

```json
{
  "success": true,
  "data": {
    "apiKey": "claw_dev_...",
    "apiKeyPrefix": "claw_dev_...",
    "ownerPrivateKey": "0x...",
    "ownerAddress": "0x...",
    "walletId": "...",
    "walletStatus": "deploying",
    "statusUrl": "/api/status",
    "claimUrl": "https://beta.paywithlocus.com/register/claim/...",
    "skillFileUrl": "https://beta-api.paywithlocus.com/api/skills/skill.md",
    "defaults": {
      "allowanceUsdc": "10.00",
      "maxAllowedTxnSizeUsdc": "5.00",
      "chain": "base"
    }
  }
}
```

### Wallet deployment status

```
GET https://beta-api.paywithlocus.com/api/status
Authorization: Bearer claw_dev_...
```

Returns `"deploying"` or `"deployed"` with the wallet address once ready.

### Claim token validation

```
GET https://beta-api.paywithlocus.com/api/claim/{token}
```

Validates the claim token and returns whether it's available.

***

## Getting started

  ### Beta Quick Start (/quickstart-beta)

    Full setup walkthrough for the beta environment.
  

  ### Request Credits (/credits)

    Get free USDC to try Locus.
  

  ### Hackathon Guide (/hackathon)

    Building for the Paygentic Hackathon? Start here.
  

  ### Platform Walkthrough (/platform-walkthrough)

    Tour the Locus dashboard.
  

---

# Hackathon — Paygentic

> Build with Locus at the Paygentic Hackathon Series — weekly tracks with cash, Locus credits, and a YC founder call on the line

## Locus' Paygentic Hackathon Series

The Paygentic Hackathon Series is a four-week run of themed hackathons, each centered on a different Locus product. Pick any week — or sweep all four.

| Week | Track                 | Focus                                                                                               |
| ---- | --------------------- | --------------------------------------------------------------------------------------------------- |
| 1    | **PayWithLocus**      | Agents that buy and sell from each other, consumer agents that transact, automated business finance |
| 2    | **BuildWithLocus**    | Agent-native PaaS — deploy full-stack apps via API, no DevOps                                       |
| 3    | **CheckoutWithLocus** | Stripe-style USDC checkout that's machine-readable by design                                        |
| 4    | **LocusFounder**      | Agents that don't assist businesses — they *are* the business                                       |

***

## Prizes (per week)

| Place | Cash  | Locus Credits | Bonus                         |
| ----- | ----- | ------------- | ----------------------------- |
| 1st   | \$600 | \$300         | 30-min call with a YC founder |
| 2nd   | \$300 | \$150         | —                             |
| 3rd   | \$100 | \$75          | —                             |

**Every team** that submits gets **\$10 in Locus credits** for participating.

***

## Weekly schedule

Every week runs Friday → Thursday:

| Day     | What happens                                                                             |
| ------- | ---------------------------------------------------------------------------------------- |
| **Fri** | Opening ceremony, challenge briefing, technical setup webinar — hacking starts           |
| **Sat** | Technical office hours open; Twitter Spaces Q\&A on the agentic economy                  |
| **Sun** | Continued hacking, technical office hours                                                |
| **Mon** | Midpoint check-in and mentor sessions; 24/7 Discord support in a dedicated VC            |
| **Tue** | Continued mentorship; Late Night Code & Coffee virtual hangout                           |
| **Wed** | **Submissions deadline**                                                                 |
| **Thu** | Demo presentations, judging, awards ceremony — and registration opens for the next track |

***

## Tracks in detail

### Week 1 — PayWithLocus

Build systems where AI agents buy and sell services from each other, consumer-facing agents that make purchases, or agents that run real business financial operations.

**Example projects:**

* Agents trading compute, data processing, or API calls
* Personal shopping agents, booking bots, subscription managers
* Automated procurement, expense management, invoice processing

### Week 2 — BuildWithLocus

[Build with Locus](/build/index) is an agent-native PaaS that deploys full-stack apps in minutes through a simple API — no cloud consoles, no Dockerfiles, no DevOps. Push code, and Locus handles builds, infrastructure, routing, SSL, databases, and scaling.

**Example projects:**

* **One-click SaaS launcher** — takes a GitHub repo URL, spins up a service + Postgres + domain in one request
* **Multi-tenant app platform** — provisions isolated Locus environments per customer, auto-teardown after trials
* **CI/CD bot** — a GitHub Actions or Slack bot that listens for events, triggers Locus deployments, and streams build status
* **Infrastructure-as-chat** — a natural-language interface where an agent translates deploy intents into Locus API calls

### Week 3 — CheckoutWithLocus

[Checkout with Locus](/checkout/index) is a Stripe-style USDC payments SDK for the agent economy. The checkout page is machine-readable by design — agents discover and pay programmatically, as easily as humans click through.

**Example projects:**

* **Agent-to-agent marketplace** — agents list services (data enrichment, code review, image generation); other agents discover and pay autonomously
* **Pay-per-use API wrapper** — gate any tool behind a Locus checkout session, no subscriptions or accounts
* **AI freelancer platform** — an agent completes tasks and invoices via checkout link, collecting USDC on completion
* **Token-gated content** — pay USDC to unlock premium content or one-time downloads with instant on-chain confirmation

### Week 4 — LocusFounder

End-to-end business creation — autonomous operations, agent-run storefronts, real revenue. Build agents that don't assist founders — they *are* the founder.

Using Locus Checkout for transactions and Locus wallets for payouts, your agent should take a prompt, stand up a working commercial operation, and generate revenue with no human in the loop.

**Example projects:**

* Receives a niche prompt (*"pet accessory dropshipping store"*), sources products, builds a storefront, writes listings, wires up Checkout, and routes payouts — fully unattended
* A multi-agent pipeline: sales agent acquires customers via Checkout, fulfillment agent delivers, finance agent logs revenue and manages payouts
* An agent-operated digital services business (logos, content, SEO audits) that accepts orders, fulfills using wrapped APIs, and settles payment end-to-end
* An agent that monitors trending product categories, spins up a new store per opportunity, winds it down when demand drops — businesses as ephemeral units

***

## Get started in 5 minutes

  
    Your agent can self-register on the beta environment — no account needed:

    ```bash
    curl -X POST https://beta-api.paywithlocus.com/api/register \
      -H "Content-Type: application/json" \
      -d '{"name": "MyAgent", "email": "you@example.com"}'
    ```

    Save the `apiKey` and `ownerPrivateKey` from the response.
  

  
    Sign up at [beta.paywithlocus.com](https://beta.paywithlocus.com) with code **`PAYGENTIC`** to unlock beta access for your team.
  

  
    Get free USDC to build with — no auth required:

    ```bash
    curl -X POST https://beta-api.paywithlocus.com/api/gift-code-requests \
      -H "Content-Type: application/json" \
      -d '{
        "email": "you@example.com",
        "reason": "Building at the Paygentic Hackathon",
        "githubUrl": "https://github.com/your-username/paygentic-project",
        "requestedAmountUsdc": 5
      }'
    ```

    You'll receive a redemption code via email once approved.
  

  
    Point your agent at the skill file to learn all available APIs:

    ```
    Read https://beta-api.paywithlocus.com/api/skills/skill.md and follow the instructions
    ```
  

  
    Use Locus wallets, transfers, wrapped APIs, checkout, or vertical tools in your project.
  

  See the [Beta Quick Start](/quickstart-beta) for a full walkthrough of setup options.

***

## What Locus offers

Locus is payment infrastructure for AI agents. One wallet, one USDC balance — agents pay for APIs, deploy services, process payments, and make purchases without creating separate accounts.

| Capability            | Description                                                            |
| --------------------- | ---------------------------------------------------------------------- |
| **Agent Wallets**     | Non-custodial smart wallets on Base with sponsored gas                 |
| **USDC Transfers**    | Send to wallet addresses or via email escrow                           |
| **Spending Controls** | Allowances, per-tx limits, approval thresholds                         |
| **Wrapped APIs**      | Pay-per-use access to OpenAI, Gemini, Firecrawl, Exa, and more         |
| **Checkout SDK**      | Stripe-style USDC payments — accepts wallet, external wallet, or agent |
| **Build with Locus**  | Deploy containerized services via API                                  |
| **Laso Finance**      | Prepaid virtual debit cards from USDC                                  |
| **Auditability**      | Full transaction history with agent intent logging                     |

***

## Judging criteria

**100 points total**, weighted across four dimensions:

| Dimension                   | Points | What we're looking for                                                               |
| --------------------------- | ------ | ------------------------------------------------------------------------------------ |
| **Technical Excellence**    | 30     | Implementation quality, proper use of Locus APIs, performance, security, reliability |
| **Innovation & Creativity** | 25     | Uniqueness of approach, novel applications of agent financial autonomy               |
| **Business Impact**         | 25     | Commercial viability, clear value proposition, scalable market                       |
| **User Experience**         | 20     | Interface design, demo quality, documentation and ease of use                        |

### Judging panel

* **Locus Leadership** — technical and business perspective
* **External VCs** — market viability and investment potential
* **Industry Experts** — fintech, AI, automation
* **Developer Community** — technical merit and innovation

### Process

1. **Initial screening** — technical functionality verification
2. **Demo presentations** — 5-minute pitch + 2-minute Q\&A per team
3. **Deliberation** — judges discuss and score
4. **Winner selection** — top projects per category + grand prize

***

## Registration & requirements

### Team structure

* **Size:** 1–4 people maximum
* **Skills:** at least one team member with API integration experience
* **Cost:** free; capped at 200 teams, first-come first-served

### Submission requirements

* **Working demo** of core functionality
* **Source code** in a public GitHub repository
* **Documentation** — README with setup and API usage
* **Video demo** — 3-minute screen recording of key features
* **Brief business plan** — one-page commercial potential summary

### Eligibility

* Open to everyone — students, professionals, international participants
* Locus employees may participate but are not eligible for prizes
* Code of conduct: respectful, inclusive, collaborative

### Disqualifiers

* No working Locus integration (mentioning Locus in the README doesn't count)
* Custodial designs that bypass the non-custodial architecture
* Agents that spend with no controls or logging
* Security vulnerabilities in fund handling

***

## Support

* **Locus engineers** — technical implementation support, available 24/7 in Discord
* **Design partners** — UX/UI guidance and user experience review
* **Dedicated office-hours VC** in Discord throughout each week

***

## Key beta endpoints for hackathon builders

| Endpoint                             | Method | Auth    | Description                    |
| ------------------------------------ | ------ | ------- | ------------------------------ |
| `/api/register`                      | POST   | None    | Agent self-registration        |
| `/api/status`                        | GET    | API Key | Check wallet deployment status |
| `/api/skills/skill.md`               | GET    | None    | Fetch skill file               |
| `/api/gift-code-requests`            | POST   | None    | Request free credits           |
| `/api/pay/send`                      | POST   | API Key | Send USDC                      |
| `/api/pay/balance`                   | GET    | API Key | Check balance                  |
| `/api/wrapped/:provider/:endpoint`   | POST   | API Key | Call wrapped API               |
| `/api/checkout/agent/pay/:sessionId` | POST   | API Key | Pay checkout session           |
| `/api/x402/:slug`                    | POST   | API Key | Call x402 endpoint             |
| `/api/feedback`                      | POST   | API Key | Submit feedback                |

All endpoints above use base URL `https://beta-api.paywithlocus.com`.

***

## Resources

  ### Beta Quick Start (/quickstart-beta)

    Full setup guide for the beta environment.
  

  ### Request Credits (/credits)

    Get free USDC credits — no auth required.
  

  ### Wrapped APIs (/wrapped-apis/index)

    Browse the pay-per-use API catalog.
  

  ### Checkout (/checkout/index)

    Integrate the checkout SDK.
  

---

# Wallets

> Smart wallet architecture for secure, gasless transactions on Base

Locus uses a smart wallet architecture to maintain user control while allowing our backend to sign messages. This is done through a single-signer ERC-4337 account that validates against two possible signers.

  ### User Key

    Generated on the user-facing website at creation and **never stored** on Locus servers.
  

  ### Permissioned Key

    Stored securely in a hardware security module (HSM). Can be revoked by the user at any time.
  

  The user-owned key can revoke access to the permissioned key at any time via `revokePermissionedKey()`. The permissioned key can rotate itself to a new key via `setPermissionedKey()`, but only the owner can fully revoke it.

All Locus wallets run exclusively on [Base](https://base.org). They are based on [ERC-4337](https://docs.erc4337.io/index.html) and run gaslessly through our own paymaster system.

***

## Locus Smart Wallet

The Locus Smart Wallet is based on the ERC-4337 contract from [Solady](https://github.com/Vectorized/solady) with modifications to allow for both keys to sign and the user key to revoke access.

  UUPS upgradeability is explicitly disabled — `_authorizeUpgrade` always reverts — making the implementation immutable.

  ```solidity
  // SPDX-License-Identifier: MIT
  pragma solidity ^0.8.23;

  /**
   * @title ILocusSmartWallet
   * @notice Interface for LocusSmartWallet ERC-4337 account
   */
  interface ILocusSmartWallet {
      // *****************************************************************************
      // STRUCTS
      // *****************************************************************************

      struct PermissionedKeyData {
          bool isActive;
      }

      // *****************************************************************************
      // EVENTS
      // *****************************************************************************

      event PermissionedKeySet(address indexed oldKey, address indexed newKey);
      event PermissionedKeyRevoked(address indexed key);
      event SubwalletCreated(address indexed subwalletAddress, uint48 disburseBefore);
      event SubwalletReclaimed(address indexed subwalletAddress, uint256 timestamp);
      event SubwalletDisbursed(address indexed subwalletAddress, address indexed to, uint256 timestamp);
      event USDCTransferExecuted(address indexed to, uint256 amount, uint256 timestamp);

      // *****************************************************************************
      // INITIALIZATION
      // *****************************************************************************

      function initialize(
          address owner_,
          address usdcToken_,
          address subwalletImplementation_,
          address initialPermissionedKey_
      ) external payable;

      // *****************************************************************************
      // OWNER FUNCTIONS
      // *****************************************************************************

      function revokePermissionedKey() external;

      // *****************************************************************************
      // PERMISSIONED KEY MANAGEMENT
      // *****************************************************************************

      function setPermissionedKey(address newKey) external;

      // *****************************************************************************
      // SUBWALLET MANAGEMENT
      // *****************************************************************************

      function createAndFundSubwallet(
          address[] calldata tokens,
          uint256[] calldata amounts,
          uint48 disburseBefore
      ) external payable returns (address subwalletAddress);

      function createAndFundSubwalletUSDC(
          uint256 amount,
          uint48 disburseBefore
      ) external returns (address subwalletAddress);

      function reclaimSubwallet(address subwalletAddress, address[] calldata tokens) external;

      function disburseSubwallet(address subwalletAddress, address to, address[] calldata tokens) external;

      // *****************************************************************************
      // LEGACY USDC FUNCTIONS
      // *****************************************************************************

      function transferUSDC(address to, uint256 amount) external;

      // *****************************************************************************
      // VIEW FUNCTIONS
      // *****************************************************************************

      function getPermissionedKey(address key) external view returns (PermissionedKeyData memory);
      function activePermissionedKeyPublic() external view returns (address);
      function activeSessionKeyPublic() external view returns (address);
      function getDeployedSubwallet(uint256 index) external view returns (address);
      function getSubwalletStats() external view returns (
          uint256 totalDeployed,
          uint256 activeCount,
          uint256 inactiveCount,
          uint256 availableSlots
      );
      function getSubwalletBalance(address subwalletAddress, address token) external view returns (uint256);
  }
  ```

All user wallets are deployed as deterministic ERC1967 proxies via CREATE2 through the `LocusFactory`. Wallet addresses are predictable before deployment using `LocusFactory.getAddress()`.

### View Implementation (https://basescan.org/address/0xb486936adac258df9ff511c96ebe47f03d22ce06#code)

  Audit the smart wallet implementation on BaseScan.

***

## Factory

The `LocusFactory` handles wallet deployment. It extends Solady's `ERC4337Factory` and deploys ERC1967 minimal proxies (52 bytes runtime code) with deterministic addresses via CREATE2.

  The factory supports single and batch wallet creation, and sets the permissioned key atomically during deployment to prevent frontrunning.

***

## Subwallets

Locus allows agents and users to send funds to email addresses. This is done through a subwallet system to isolate escrowed funds.

### How Email Sends Work

  
    `createAndFundSubwallet()` is submitted as a UserOperation through the EntryPoint, signed by the Locus permissioned key, to deploy a minimal proxy.
  

  
    The subwallet receives the funds the user or agent would like to send to the email address.
  

  
    An email containing a one-time password is sent to the recipient.
  

  
    The recipient can claim funds to a wallet address of their choosing.
  

### Time-Limited Escrows

Each subwallet enforces a `disburseBefore` deadline — funds cannot be disbursed after this timestamp, and `transferToken` will revert with `DisbursementDeadlinePassed`. This ensures escrows are time-limited.

### Subwallet Reuse

Once funds are claimed, the deployed subwallet is deactivated and returned to a reuse pool. When the next email payment is needed, an inactive subwallet is reactivated via `activate()` rather than deploying a new proxy.

  There is a hard cap of **100 subwallet proxies** per wallet (`MAX_SUBWALLETS`).

  ```solidity
  // SPDX-License-Identifier: MIT
  pragma solidity ^0.8.23;

  /**
   * @title ISubwallet
   * @notice Interface for Subwallet proxy contract
   */
  interface ISubwallet {
      // *****************************************************************************
      // EVENTS
      // *****************************************************************************

      event TokenTransferred(address indexed token, address indexed to, uint256 amount);
      event SubwalletActivated(uint48 disburseBefore);
      event SubwalletDeactivated();

      // *****************************************************************************
      // ERRORS
      // *****************************************************************************

      error Unauthorized();
      error DisbursementDeadlinePassed();
      error InvalidRecipient();
      error TransferFailed();

      // *****************************************************************************
      // EXTERNAL FUNCTIONS
      // *****************************************************************************

      /**
       * @notice Initialize the subwallet (called once per proxy)
       * @param mainWallet_ The main smart wallet address
       * @param owner_ The owner EOA address
       * @param disburseBefore_ Deadline for external disbursements
       */
      function initialize(
          address mainWallet_,
          address owner_,
          uint48 disburseBefore_
      ) external;

      /**
       * @notice Activate/reactivate the subwallet for reuse
       * @param newDisburseBefore New deadline for disbursements
       */
      function activate(uint48 newDisburseBefore) external;

      /**
       * @notice Deactivate the subwallet (returns to reuse pool)
       */
      function deactivate() external;

      /**
       * @notice Transfer tokens from this subwallet with deadline enforcement
       * @param token Token address (address(0) = ETH)
       * @param to Destination address
       * @param amount Amount to transfer
       */
      function transferToken(
          address token,
          address to,
          uint256 amount
      ) external;

      /**
       * @notice Get token balance of this subwallet
       * @param token Token address (address(0) = ETH)
       * @return balance Current balance
       */
      function getTokenBalance(address token) external view returns (uint256 balance);

      // *****************************************************************************
      // STATE VARIABLES (VIEW FUNCTIONS)
      // *****************************************************************************

      function mainWallet() external view returns (address);
      function owner() external view returns (address);
      function disburseBefore() external view returns (uint48);
      function isActive() external view returns (bool);
  }
  ```

### View Subwallet Implementation (https://basescan.org/address/0x1d77ec1b59f436846c8519797fdba27221f72ff6#code)

  Audit the subwallet implementation on BaseScan.

---

# USDC Transfers

> Send USDC to wallet addresses or email recipients

Locus supports two ways to send USDC from your wallet:

## Direct to Address

Send USDC directly to any Base wallet address. The transfer is executed immediately on-chain.

## Direct to Email

Send USDC to anyone using just their email address—no wallet required on their end.

When you initiate an email send, funds are held in a secure subwallet until the recipient claims them. They'll receive an email with a one-time password and can withdraw to any wallet address of their choosing. [Read more about the email send system.](/features/wallets#subwallets)

---

# Tasks

> Let your agent hire human taskers across popular platforms

Locus Tasks lets your agent hire real human taskers across popular tasking platforms for work like graphic design, written content, and more.

## How It Works

  
    Your agent chooses a task category (e.g., Graphic Design, Written Content) and a timeline: **1 day**, **3 days**, or **7 days**.
  

  
    Each category + timeline pairing offers three price tiers based on available taskers:

    | Tier         | Expected Output                   |
    | ------------ | --------------------------------- |
    | Lower `(1)`  | Budget-friendly, variable quality |
    | Mid `(2)`    | Balanced price and quality        |
    | Higher `(3)` | Premium quality work              |
  

  
    Your agent submits a work proposal with the selected category, timeline, and price tier. The more detail provided, the better—reference links are encouraged.
  

  
    Our system matches your request with a human tasker based on category, timeline, and price.
  

  
    We forward the request to the tasker and return the deliverable to your agent (also visible in your dashboard).
  

## Notes

  **Deadlines**: We add a one-day grace period to account for processing delays or task start time.

* **No match found**: If we can't find a suitable tasker, you'll be refunded.
* **Price difference**: If the tasker's total charge is less than your agent's price tier, we refund the difference.

---

# Laso Finance

> Order prepaid virtual debit cards using USDC

Laso Finance lets your agent spend USDC in the real world. Order prepaid virtual Visa debit cards for online purchases — all from your Locus wallet.

Paid operations go through Locus's x402 proxy, so your agent pays per use from its wallet balance. Card lookups, balance checks, and status queries are free.

## How it works

  
    Your agent authenticates through the Locus x402 proxy to get session tokens for Laso Finance.
  

  
    Order a prepaid Visa card loaded with $5–$1,000 USD. The USDC cost matches the dollar amount.
  

  
    Poll until the card is ready (\~7–10 seconds), then use the card number, CVV, and expiration at any online checkout that accepts Visa prepaid.
  

## Capabilities

  ### Prepaid Cards

    Order non-reloadable Visa prepaid debit cards ($5–$1,000). Use them anywhere Visa is accepted online. US only.
  

  ### Withdrawals

    Withdraw unused USDC back to your wallet. Minimum \$0.01.
  

## Merchant compatibility

Not all merchants accept prepaid cards. Laso maintains a database of merchants where users have previously attempted transactions.

| Status            | Meaning                         | Action                                |
| ----------------- | ------------------------------- | ------------------------------------- |
| **accepted**      | Card has been used successfully | Safe to proceed                       |
| **not\_accepted** | Card was declined               | Do not order a card for this merchant |
| **unknown**       | Outcome unclear                 | Likely works — proceed with caution   |
| Not listed        | No one has tried yet            | Likely works                          |

  Cards are non-reloadable. Always check merchant compatibility and confirm the exact checkout total (including tax and shipping) before ordering a card.

## Pricing

| Action                            | Cost                                   |
| --------------------------------- | -------------------------------------- |
| **Authenticate**                  | \$0.005 USDC                           |
| **Order a card**                  | $0.015 + card amount ($5–\$1,000 USDC) |
| **All status checks and queries** | Free                                   |
| **Withdraw**                      | Free                                   |

Paid actions are deducted from your Locus wallet via x402. Free endpoints use session tokens — no USDC cost.

  Prepaid card ordering is currently US-only (IP-locked).

## Agent workflow

Your agent connects to Laso Finance through the [Locus SKILL.md](https://paywithlocus.com/skill.md), which covers authentication, all endpoints, and session management.

### Endpoints

| Endpoint                | Cost             | Description                                                       |
| ----------------------- | ---------------- | ----------------------------------------------------------------- |
| `auth`                  | \$0.005          | Authenticate and get session tokens                               |
| `get-card`              | \$0.015 + amount | Order a prepaid card ($5–$1,000)                                  |
| `get-card-data`         | Free             | Get card details, number, CVV, expiry, transactions               |
| `refresh-card-data`     | Free             | Re-scrape card balance from issuer (rate limited: once per 5 min) |
| `search-merchants`      | Free             | Check merchant compatibility                                      |
| `get-account-balance`   | Free             | Account balance and deposit history                               |
| `withdraw`              | Free             | Withdraw USDC back to wallet (min \$0.01)                         |
| `get-withdrawal-status` | Free             | Track withdrawal status and transaction hash                      |
| `refresh`               | Free             | Exchange refresh token for new session token                      |

### Common workflows

  
    1. **Check merchant compatibility** — search the merchant database. If `not_accepted`, stop and inform the human.
    2. **Get the exact checkout total** including tax and shipping. Cards are non-reloadable — match the amount exactly.
    3. **Order a card** with the exact total amount.
    4. **Poll for card details** every 2–3 seconds until status is `ready` (\~7–10 seconds).
    5. **Use the card** — fill in the card number, CVV, and expiration at checkout.
    6. **If declined** — check the merchant database again and report to the human.
  

  
    1. **Refresh the card data** (rate limited to once per card every 5 minutes).
    2. **Fetch updated card data** after a few seconds.
    3. Report remaining balance to the human.
  

  
    1. **Check account balance** to see available USDC.
    2. **Initiate withdrawal** — specify the amount (min \$0.01).
    3. **Track withdrawal status** — monitor until the transaction confirms on Base.
  

  
    1. If a free endpoint returns 401, your `id_token` expired.
    2. Try refreshing with your `refresh_token` (free).
    3. If that fails, call the paid auth endpoint (\$0.005) for new tokens.
    4. Save the new tokens and retry the original request.
  

### Best practices

| Do                                                  | Don't                                                         |
| --------------------------------------------------- | ------------------------------------------------------------- |
| Check merchant compatibility before ordering a card | Order a card without confirming the merchant accepts prepaid  |
| Match the card amount to the exact checkout total   | Round up significantly — leftover funds are stuck on the card |
| Save session tokens locally and reuse them          | Call the paid auth endpoint every time (\$0.005 adds up)      |
| Poll card status every 2–3 seconds after ordering   | Wait too long — cards are ready in \~7–10 seconds             |

## Policy guardrails

Agent payments through Laso are subject to the spending controls configured in the [Locus dashboard](https://app.paywithlocus.com). Allowances, per-transaction budgets, and approval thresholds apply to all x402 operations. See the [Platform Walkthrough](/platform-walkthrough) for details.

---

# Wrapped APIs

> Call third-party APIs and pay per use in USDC

Wrapped APIs let your agent call third-party services — web scraping, search, email, AI generation, and more — through Locus and pay per call in USDC. No upstream accounts or API keys needed. Locus handles authentication and billing automatically.

## How it works

  
    Fetch the catalog to see which providers and endpoints are available for your agent.

    ```bash
    curl -s https://api.paywithlocus.com/api/wrapped/md \
      -H "Authorization: Bearer YOUR_LOCUS_API_KEY"
    ```
  

  
    Send a POST request with the parameters the upstream API expects.

    ```bash
    curl -X POST https://api.paywithlocus.com/api/wrapped/<provider>/<endpoint> \
      -H "Authorization: Bearer YOUR_LOCUS_API_KEY" \
      -H "Content-Type: application/json" \
      -d '{ ...parameters... }'
    ```
  

  
    The upstream API response is returned directly. The cost is deducted from your wallet in USDC — no extra steps.

    ```json
    {
      "success": true,
      "data": { "...response from the upstream API..." }
    }
    ```
  

## Available providers

  ### OpenAI (/wrapped-apis/providers#openai)

    GPT chat, embeddings, image generation, text-to-speech, and moderation.
  

  ### Google Gemini (/wrapped-apis/providers#google-gemini)

    Multimodal chat, vision, PDF processing, thinking/reasoning, and embeddings.
  

  ### Firecrawl (/wrapped-apis/providers#firecrawl)

    Web scraping, crawling, and structured data extraction.
  

  ### Exa (/wrapped-apis/providers#exa)

    AI-native semantic search and content retrieval.
  

  ### Clado (/wrapped-apis/providers#clado)

    People search, LinkedIn enrichment, and lead generation.
  

  ### Apollo (/wrapped-apis/providers#apollo)

    People and company enrichment, lead search, and sales intelligence.
  

  ### Browser Use (/wrapped-apis/providers#browser-use)

    AI-powered browser automation with LLM agents.
  

  ### X (Twitter) (/wrapped-apis/providers#x-twitter)

    Read-only access to tweets, users, search, and trending topics.
  

  ### fal.ai (/wrapped-apis/providers#falai)

    600+ generative AI models for image, video, and audio.
  

  ### Abstract API (/wrapped-apis/providers#abstract-api)

    12 data validation and enrichment APIs (email, IP, phone, VAT, and more).
  

  ### Anthropic (/wrapped-apis/providers#anthropic)

    Claude models — chat, vision, document processing, and extended thinking.
  

  ### DeepSeek (/wrapped-apis/providers#deepseek)

    DeepSeek-V3 and R1 models for chat, code, and deep reasoning.
  

  ### Grok (/wrapped-apis/providers#grok)

    xAI models — chat, image generation, web/X search, and TTS.
  

  ### Perplexity (/wrapped-apis/providers#perplexity)

    AI-powered search with real-time web grounding and citations.
  

  ### Replicate (/wrapped-apis/providers#replicate)

    Run thousands of open-source AI models via API.
  

  ### Stability AI (/wrapped-apis/providers#stability-ai)

    Image generation, editing, upscaling, 3D, and audio.
  

  ### Suno (/wrapped-apis/providers#suno)

    AI music and lyrics generation from text prompts.
  

  ### Mathpix (/wrapped-apis/providers#mathpix)

    Math and document OCR — extract LaTeX from images and PDFs.
  

  ### Deepgram (/wrapped-apis/providers#deepgram)

    Speech-to-text, text-to-speech, and text analysis.
  

  ### Alpha Vantage (/wrapped-apis/providers#alpha-vantage)

    Financial market data — stocks, forex, crypto, and technicals.
  

  ### SEC EDGAR (/wrapped-apis/providers#sec-edgar)

    Public SEC filings, financial facts, and full-text search.
  

  ### RentCast (/wrapped-apis/providers#rentcast)

    US real estate data — valuations, rent estimates, and listings.
  

  ### OpenWeather (/wrapped-apis/providers#openweather)

    Weather data, forecasts, air quality, and geocoding.
  

  ### Diffbot (/wrapped-apis/providers#diffbot)

    Web data extraction and knowledge graph queries.
  

  ### BuiltWith (/wrapped-apis/providers#builtwith)

    Website technology profiling and tech stack detection.
  

  ### Hunter (/wrapped-apis/providers#hunter)

    Email discovery, verification, and company enrichment.
  

  ### IPinfo (/wrapped-apis/providers#ipinfo)

    IP geolocation, ASN, privacy detection, and carrier data.
  

  ### Whitepages Pro (/wrapped-apis/providers#whitepages-pro)

    People search, reverse phone lookup, and property data.
  

  ### OFAC (/wrapped-apis/providers#ofac)

    Sanctions screening against 25+ global watchlists.
  

  ### Judge0 (/wrapped-apis/providers#judge0)

    Code execution sandbox — run code in 60+ languages.
  

  ### Mapbox (/wrapped-apis/providers#mapbox)

    Maps, geocoding, directions, and spatial queries.
  

  ### Brave Search (/wrapped-apis/providers#brave-search)

    Independent web search — web, news, images, videos, and AI answers.
  

  ### CoinGecko (/wrapped-apis/providers#coingecko)

    Cryptocurrency market data — prices, charts, trending, and exchanges.
  

  ### DeepL (/wrapped-apis/providers#deepl)

    Professional translation and text improvement for 30+ languages.
  

  ### Groq (/wrapped-apis/providers#groq)

    Ultra-fast LLM inference — Llama, DeepSeek R1, Gemma, and more.
  

  ### Mistral AI (/wrapped-apis/providers#mistral-ai)

    Mistral Large, Codestral, Magistral reasoning, and Pixtral vision.
  

  ### ScreenshotOne (/wrapped-apis/providers#screenshotone)

    Capture any URL as PNG, JPEG, WebP, or PDF.
  

  ### Tavily (/wrapped-apis/providers#tavily)

    AI-optimized web search, extraction, and crawling.
  

  ### VirusTotal (/wrapped-apis/providers#virustotal)

    Threat intelligence — scan files, URLs, domains, and IPs.
  

  ### Wolfram|Alpha (/wrapped-apis/providers#wolframalpha)

    Computational knowledge — math, science, finance, and more.
  

  ### Billboard (/wrapped-apis/providers#billboard)

    Post to @MPPBillboard on X — price doubles with every post.
  

## Pricing

Every wrapped API call has two cost components:

| Component         | Description                                                                                                            |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------- |
| **Upstream cost** | The actual cost of the third-party API call (varies by provider and endpoint)                                          |
| **Locus fee**     | A flat \$0.003 per call for most providers. OpenAI, Gemini, and Anthropic use a **15% markup** on token costs instead. |

Some endpoints are **free** (status checks, credit lookups) — these have \$0 upstream cost and no Locus fee.

Pricing can be **flat** (e.g., Exa search at \$0.007/call) or **dynamic** based on your request parameters (e.g., OpenAI chat costs scale with model choice and token usage).

  Fetch provider details with `GET /api/wrapped/md?provider=<slug>` to see estimated costs for each endpoint before calling.

## Billing and safety

Wrapped APIs use a **charge-on-success** model:

* Your allowance is reserved **before** the upstream call to prevent overspending
* If the upstream call **fails**, your allowance is restored — you're never charged for failed calls
* If the call **succeeds**, USDC is transferred from your wallet to the Locus treasury on Base

High-value calls that exceed your agent's approval threshold return a `202` response with an `approval_url`. Your human approves the transaction, and the call executes automatically — no resubmission needed.

  Wrapped API calls are subject to the same policy guardrails as all Locus operations: allowance limits, max transaction size, and approval thresholds. Configure these from the [dashboard](https://app.paywithlocus.com).

## Enable and disable providers

All providers and endpoints are enabled by default. Your human can toggle individual providers or specific endpoints on and off from the [dashboard](https://app.paywithlocus.com) — disabled endpoints return `403` when called.

Toggles work at two levels: disable an entire provider (e.g., turn off all of Firecrawl), or disable a single endpoint (e.g., turn off only `firecrawl/crawl` while keeping the rest).

## Next steps

  ### Agent Integration (/wrapped-apis/for-agents)

    Authentication, discovery, calling endpoints, and handling responses.
  

  ### Provider Catalog (/wrapped-apis/providers)

    Full reference for all providers, endpoints, parameters, and pricing.
  

  ### MPP (HTTP 402) (/wrapped-apis/mpp)

    Pay-per-request access via Tempo chain — no Locus wallet needed.
  

---

# Agent Integration

> Use wrapped APIs from your AI agent

This guide covers how AI agents authenticate, discover, and call wrapped APIs through Locus.

## Authentication

All wrapped API requests require a Locus API key in the `Authorization` header:

```bash
Authorization: Bearer claw_prod_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

API keys are created in the [Locus dashboard](https://app.paywithlocus.com) when you set up an agent. The key identifies which agent is making the call and which wallet to charge.

## Discover available APIs

### Fetch the catalog index

Get a lightweight list of all available providers and endpoints:

```bash
curl -s https://api.paywithlocus.com/api/wrapped/md \
  -H "Authorization: Bearer YOUR_LOCUS_API_KEY"
```

This returns a Markdown-formatted table of enabled providers with their slugs, endpoint names, and descriptions.

### Fetch provider details

Once you know which provider to use, get full details including parameters, curl examples, and estimated costs:

```bash
curl -s "https://api.paywithlocus.com/api/wrapped/md?provider=firecrawl" \
  -H "Authorization: Bearer YOUR_LOCUS_API_KEY"
```

  Only fetch the providers you need to keep your context lean. The index is enough to find the right provider — then fetch details for just that one.

### List all endpoint paths

For a structured JSON response instead of Markdown:

```bash
curl -s https://api.paywithlocus.com/api/wrapped \
  -H "Authorization: Bearer YOUR_LOCUS_API_KEY"
```

```json
{
  "success": true,
  "data": {
    "endpoints": ["firecrawl/scrape", "firecrawl/crawl", "exa/search", "..."],
    "catalog": [{ "provider": "firecrawl", "endpoints": ["..."] }]
  }
}
```

## Make a call

Send a POST to the endpoint URL with the parameters the upstream API expects:

```bash
curl -X POST https://api.paywithlocus.com/api/wrapped/firecrawl/scrape \
  -H "Authorization: Bearer YOUR_LOCUS_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com", "formats": ["markdown"]}'
```

**Success response (200):**

```json
{
  "success": true,
  "data": {
    "markdown": "# Example Domain\n\nThis domain is for use in illustrative examples...",
    "metadata": { "title": "Example Domain", "statusCode": 200 }
  }
}
```

The `data` field contains whatever the upstream API returned. Payment is handled automatically.

## Approval flow

If a call's cost exceeds your agent's approval threshold, the response is `202` instead of executing immediately:

```json
{
  "success": true,
  "data": {
    "pending_approval_id": "uuid",
    "approval_url": "https://app.paywithlocus.com/approve/uuid",
    "status": "PENDING_APPROVAL",
    "estimated_cost_usdc": 0.50,
    "message": "This wrapped API call exceeds the approval threshold. Send the approval_url to your human for approval."
  }
}
```

  
    The call is queued, not executed. The response includes an `approval_url`.
  

  
    The agent sends the `approval_url` to its human. They click the link and approve the transaction.
  

  
    Once approved, Locus executes the upstream API call and charges the wallet. No resubmission needed.
  

## Policy guardrails

Your human can configure spending limits from the dashboard. These apply to all Locus operations including wrapped API calls.

| Guardrail                | Behavior                                                                           |
| ------------------------ | ---------------------------------------------------------------------------------- |
| **Allowance**            | Maximum total USDC the agent can spend. Returns `403` if exceeded.                 |
| **Max transaction size** | Cap on any single transaction. Returns `403` if exceeded.                          |
| **Approval threshold**   | Transactions above this amount return `202 PENDING_APPROVAL` with an approval URL. |

## Enable and disable providers

Your human can toggle individual providers or specific endpoints on and off from the dashboard. Disabled endpoints return `403`:

```json
{
  "error": "API disabled",
  "message": "\"firecrawl/scrape\" has been disabled. Enable it in your dashboard."
}
```

Toggles work at two levels:

* **Provider level** — disable all endpoints for a provider (e.g., disable all of Firecrawl)
* **Endpoint level** — disable a specific endpoint (e.g., disable only `firecrawl/crawl`)

## Error handling

| Status  | Meaning                                                        |
| ------- | -------------------------------------------------------------- |
| **200** | Success. `data` contains the upstream response.                |
| **202** | Pending approval. Send the `approval_url` to your human.       |
| **400** | Invalid request. Missing or invalid parameters.                |
| **402** | Insufficient balance (embedded users only).                    |
| **403** | Policy check failed, endpoint disabled, or allowance exceeded. |
| **404** | Unknown provider or endpoint.                                  |
| **502** | Upstream API call failed. You are **not** charged.             |
| **500** | Payment processing failed after a successful upstream call.    |

  You are never charged for failed upstream calls. If the third-party API returns an error, your allowance is restored automatically.

## Wrapped APIs vs x402

|                        | Wrapped APIs                                                       | x402 Endpoints                                                    |
| ---------------------- | ------------------------------------------------------------------ | ----------------------------------------------------------------- |
| **Endpoint**           | `/api/wrapped/<provider>/<endpoint>`                               | `/api/x402/<slug>`                                                |
| **What it is**         | Curated catalog of third-party APIs (Firecrawl, Exa, OpenAI, etc.) | Custom endpoints registered by your human, plus built-in services |
| **When to use**        | The catalog has the API you need                                   | The API isn't in the wrapped catalog                              |
| **Policy enforcement** | Yes (allowance, limits, approvals)                                 | Yes (same guardrails)                                             |

---

# Provider Catalog

> All available wrapped API providers and endpoints

This is the full reference for all wrapped API providers. Expand any provider to see every endpoint with its parameters, estimated cost, and curl examples.

  All costs shown are **estimated totals** (upstream cost + \$0.003 Locus fee). Actual cost may vary for endpoints with dynamic pricing.

  Providers marked with **Available on MPP** can also be called via [HTTP 402 payments on Tempo chain](/wrapped-apis/mpp) — no Locus wallet needed.

***

## OpenAI

AI models — chat completions, embeddings, image generation, text-to-speech, and content moderation.

### OpenAI Docs (https://platform.openai.com/docs)

  Full upstream API documentation

| Endpoint         | Est. Cost                          | Description                                                                                    |
| ---------------- | ---------------------------------- | ---------------------------------------------------------------------------------------------- |
| `chat`           | Model-dependent (\~\$0.001–\$0.20) | Generate text with GPT and o-series models (text, vision, structured output, function calling) |
| `embed`          | \~\$0.0001–\$0.001                 | Generate vector embeddings for semantic search and classification                              |
| `image-generate` | \$0.005–\$0.17/image               | Generate images from text prompts                                                              |
| `tts`            | \~\$0.015/1K chars                 | Convert text to natural-sounding speech audio                                                  |
| `moderate`       | \$0.001                            | Classify text for harmful content                                                              |

  OpenAI and Gemini use a **15% fee** on top of upstream token costs instead of the flat \$0.003 fee. Costs scale with model choice and token usage.

  ### chat

  Generate text with GPT and o-series models. Supports text, vision (images via URL or base64), structured output (JSON mode), and function calling.

  **Estimated cost:** Model-dependent (\~\$0.001–\$0.20)

  ```bash
  curl -X POST https://api.paywithlocus.com/api/wrapped/openai/chat \
    -H "Authorization: Bearer YOUR_LOCUS_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
      "model": "gpt-4o-mini",
      "messages": [{"role": "user", "content": "Hello!"}]
    }'
  ```

  | Parameter               | Type                | Required | Description                                                                                                                                                                                                         |
  | ----------------------- | ------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
  | `model`                 | string              | Yes      | Model ID (e.g. `gpt-4o`, `gpt-4o-mini`, `gpt-4.1`, `gpt-4.1-mini`, `o3`, `o4-mini`, `gpt-5`, `gpt-5-mini`)                                                                                                          |
  | `messages`              | array               | Yes      | Conversation messages. Each: `{ role: "system"\|"user"\|"assistant", content: "text" }`. For vision: `{ role: "user", content: [{ type: "text", text: "..." }, { type: "image_url", image_url: { url: "..." } }] }` |
  | `temperature`           | number              | No       | Sampling temperature (0.0–2.0). Not supported for o-series models.                                                                                                                                                  |
  | `max_tokens`            | number              | No       | Maximum output tokens. Use `max_completion_tokens` for o-series.                                                                                                                                                    |
  | `max_completion_tokens` | number              | No       | Maximum completion tokens (preferred for o-series reasoning models)                                                                                                                                                 |
  | `response_format`       | object              | No       | `{ type: "json_object" }` for JSON mode, or `{ type: "json_schema", json_schema: { ... } }` for structured output                                                                                                   |
  | `top_p`                 | number              | No       | Nucleus sampling threshold (0.0–1.0)                                                                                                                                                                                |
  | `stop`                  | string \| string\[] | No       | Stop sequences (up to 4)                                                                                                                                                                                            |
  | `n`                     | number              | No       | Number of completions to generate (default 1)                                                                                                                                                                       |
  | `frequency_penalty`     | number              | No       | Frequency penalty (-2.0 to 2.0)                                                                                                                                                                                     |
  | `presence_penalty`      | number              | No       | Presence penalty (-2.0 to 2.0)                                                                                                                                                                                      |

  **Model pricing (per 1M tokens):**

  | Model        | Input  | Output  |
  | ------------ | ------ | ------- |
  | gpt-5        | \$1.25 | \$10.00 |
  | gpt-5-mini   | \$0.25 | \$2.00  |
  | gpt-4.1      | \$2.00 | \$8.00  |
  | gpt-4.1-mini | \$0.40 | \$1.60  |
  | gpt-4.1-nano | \$0.10 | \$0.40  |
  | gpt-4o       | \$2.50 | \$10.00 |
  | gpt-4o-mini  | \$0.15 | \$0.60  |
  | o3           | \$2.00 | \$8.00  |
  | o4-mini      | \$1.10 | \$4.40  |

  ### embed

  Generate vector embeddings for semantic search, clustering, and classification.

  **Estimated cost:** \~\$0.0001–\$0.001

  | Parameter         | Type                | Required | Description                                                                                    |
  | ----------------- | ------------------- | -------- | ---------------------------------------------------------------------------------------------- |
  | `model`           | string              | Yes      | Embedding model (`text-embedding-3-small`, `text-embedding-3-large`, `text-embedding-ada-002`) |
  | `input`           | string \| string\[] | Yes      | Text to embed (single string or array)                                                         |
  | `encoding_format` | string              | No       | `float` (default) or `base64`                                                                  |
  | `dimensions`      | number              | No       | Output vector dimensions (only for text-embedding-3-\* models)                                 |

  ### image-generate

  Generate images from text prompts using GPT Image models.

  **Estimated cost:** \$0.005–\$0.17 per image

  ```bash
  curl -X POST https://api.paywithlocus.com/api/wrapped/openai/image-generate \
    -H "Authorization: Bearer YOUR_LOCUS_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{"prompt": "a cat sitting on a rainbow", "quality": "medium"}'
  ```

  | Parameter    | Type   | Required | Description                                             |
  | ------------ | ------ | -------- | ------------------------------------------------------- |
  | `prompt`     | string | Yes      | Text description of the image to generate               |
  | `model`      | string | No       | `gpt-image-1` (default) or `gpt-image-1-mini`           |
  | `n`          | number | No       | Number of images (default 1)                            |
  | `size`       | string | No       | `1024x1024` (default), `1024x1536`, `1536x1024`, `auto` |
  | `quality`    | string | No       | `low`, `medium` (default), `high`                       |
  | `background` | string | No       | `auto` (default), `transparent`, `opaque`               |

  **Image pricing (per image):**

  | Model            | Low     | Medium  | High    |
  | ---------------- | ------- | ------- | ------- |
  | gpt-image-1      | \$0.011 | \$0.042 | \$0.167 |
  | gpt-image-1-mini | \$0.005 | \$0.015 | \$0.052 |

  ### tts

  Convert text to natural-sounding speech audio.

  **Estimated cost:** \~\$0.015 per 1K characters

  | Parameter         | Type   | Required | Description                                                                           |
  | ----------------- | ------ | -------- | ------------------------------------------------------------------------------------- |
  | `model`           | string | Yes      | `tts-1`, `tts-1-hd`, or `gpt-4o-mini-tts`                                             |
  | `input`           | string | Yes      | Text to convert (max 4096 characters)                                                 |
  | `voice`           | string | Yes      | `alloy`, `ash`, `ballad`, `coral`, `echo`, `fable`, `onyx`, `nova`, `sage`, `shimmer` |
  | `response_format` | string | No       | `mp3` (default), `opus`, `aac`, `flac`, `wav`, `pcm`                                  |
  | `speed`           | number | No       | Speed (0.25–4.0, default 1.0)                                                         |
  | `instructions`    | string | No       | Tone/style instructions (`gpt-4o-mini-tts` only)                                      |

  ### moderate

  Classify text for harmful content (harassment, hate, self-harm, sexual, violence).

  **Estimated cost:** \$0.001

  | Parameter | Type                | Required | Description                                                    |
  | --------- | ------------------- | -------- | -------------------------------------------------------------- |
  | `input`   | string \| string\[] | Yes      | Text to classify (single string or array)                      |
  | `model`   | string              | No       | `omni-moderation-latest` (default) or `text-moderation-latest` |

***

## Google Gemini

Multimodal AI — chat, vision, PDF/document processing, thinking/reasoning, and embeddings.

### Gemini Docs (https://ai.google.dev/gemini-api/docs)

  Full upstream API documentation

| Endpoint       | Est. Cost                          | Description                                                |
| -------------- | ---------------------------------- | ---------------------------------------------------------- |
| `chat`         | Model-dependent (\~\$0.003–\$0.15) | Multimodal text generation with thinking/reasoning support |
| `embed`        | \~\$0.0002                         | Generate 3072-dimensional text embeddings                  |
| `count-tokens` | Free                               | Count tokens for cost estimation before a generation call  |

  Gemini uses a **15% fee** on top of upstream token costs, same as OpenAI. The `count-tokens` endpoint is free and useful for estimating costs before calling `chat`.

  ### chat

  Multimodal text generation — chat, vision (images), PDF/document processing, thinking/reasoning, and structured output.

  **Estimated cost:** Model-dependent (\~\$0.003–\$0.15)

  ```bash
  curl -X POST https://api.paywithlocus.com/api/wrapped/gemini/chat \
    -H "Authorization: Bearer YOUR_LOCUS_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
      "model": "gemini-2.5-flash",
      "messages": [{"role": "user", "content": "Hello!"}]
    }'
  ```

  | Parameter            | Type                        | Required | Description                                                                                                                                                  |
  | -------------------- | --------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
  | `model`              | string                      | Yes      | Model ID (e.g. `gemini-2.5-flash`, `gemini-2.5-pro`, `gemini-2.0-flash`, `gemini-2.5-flash-lite`, `gemini-3-flash-preview`, `gemini-3.1-pro-preview`)        |
  | `messages`           | array                       | Yes      | Conversation messages. Each: `{ role: "user"\|"model", content: "text" }`. For multimodal: `{ role, parts: [{ text }, { inlineData: { mimeType, data } }] }` |
  | `systemInstruction`  | string                      | No       | System prompt                                                                                                                                                |
  | `maxOutputTokens`    | number                      | No       | Maximum output tokens (default 8192, max 65536)                                                                                                              |
  | `temperature`        | number                      | No       | Sampling temperature (0.0–2.0)                                                                                                                               |
  | `topP`               | number                      | No       | Nucleus sampling threshold                                                                                                                                   |
  | `topK`               | number                      | No       | Top-K sampling (default 64)                                                                                                                                  |
  | `thinking`           | string \| boolean \| number | No       | Enable thinking/reasoning. `true` for dynamic, a number for exact token budget, or a level: `minimal`, `low`, `medium`, `high`                               |
  | `responseMimeType`   | string                      | No       | `text/plain` (default) or `application/json` for structured output                                                                                           |
  | `responseJsonSchema` | object                      | No       | JSON Schema for structured output (requires `responseMimeType: application/json`)                                                                            |
  | `stopSequences`      | string\[]                   | No       | Stop sequences                                                                                                                                               |

  **Model pricing (per 1M tokens):**

  | Model                  | Input  | Output  |
  | ---------------------- | ------ | ------- |
  | gemini-2.0-flash       | \$0.10 | \$0.40  |
  | gemini-2.5-flash-lite  | \$0.10 | \$0.40  |
  | gemini-2.5-flash       | \$0.30 | \$2.50  |
  | gemini-2.5-pro         | \$1.25 | \$10.00 |
  | gemini-3-flash-preview | \$0.50 | \$3.00  |
  | gemini-3.1-pro-preview | \$2.00 | \$12.00 |

  ### embed

  Generate text embeddings for semantic search, clustering, classification, and retrieval.

  **Estimated cost:** \~\$0.0002

  | Parameter              | Type   | Required | Description                                                                                                                                                       |
  | ---------------------- | ------ | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
  | `text`                 | string | Yes      | Text to embed (max 2048 tokens)                                                                                                                                   |
  | `taskType`             | string | No       | `SEMANTIC_SIMILARITY`, `CLASSIFICATION`, `CLUSTERING`, `RETRIEVAL_DOCUMENT`, `RETRIEVAL_QUERY`, `CODE_RETRIEVAL_QUERY`, `QUESTION_ANSWERING`, `FACT_VERIFICATION` |
  | `outputDimensionality` | number | No       | Vector size: 128, 256, 512, 768, 1536, or 3072 (default)                                                                                                          |

  ### count-tokens

  Count tokens for content before making a generation call. Useful for cost estimation.

  **Estimated cost:** Free

  | Parameter  | Type   | Required | Description                                                   |
  | ---------- | ------ | -------- | ------------------------------------------------------------- |
  | `model`    | string | Yes      | Model ID to count tokens for                                  |
  | `messages` | array  | No       | Messages array (same format as chat). Use this or `contents`. |
  | `contents` | array  | No       | Raw Gemini contents array. Use this or `messages`.            |

***

## Firecrawl

Web scraping, crawling, and structured data extraction.

### Firecrawl Docs (https://docs.firecrawl.dev)

  Full upstream API documentation

| Endpoint              | Est. Cost    | Description                                         |
| --------------------- | ------------ | --------------------------------------------------- |
| `scrape`              | \$0.003+     | Scrape a single URL (markdown or structured output) |
| `crawl`               | \$0.01+      | Crawl a website following links up to a limit       |
| `crawl-status`        | Free         | Check the status of a crawl job                     |
| `map`                 | \$0.004      | Discover all URLs on a site without scraping        |
| `extract`             | \$0.007+     | Extract structured data from URLs using AI          |
| `extract-status`      | Free         | Check the status of an extraction job               |
| `batch-scrape`        | \$0.003+/url | Scrape multiple URLs in a single request            |
| `batch-scrape-status` | Free         | Check batch scrape status                           |
| `search`              | \$0.005      | Search the web and return scraped content           |

  ### scrape

  Scrape a single URL and return its content in markdown or structured formats.

  **Estimated cost:** \$0.003+

  ```bash
  curl -X POST https://api.paywithlocus.com/api/wrapped/firecrawl/scrape \
    -H "Authorization: Bearer YOUR_LOCUS_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{"url": "https://example.com", "formats": ["markdown"]}'
  ```

  | Parameter | Type      | Required | Description                                |
  | --------- | --------- | -------- | ------------------------------------------ |
  | `url`     | string    | Yes      | URL to scrape                              |
  | `formats` | string\[] | No       | Output formats (`markdown`, `json`)        |
  | `actions` | object\[] | No       | Browser actions to perform before scraping |

  ### crawl

  Crawl a website starting from a URL, following links up to a configurable limit.

  **Estimated cost:** \$0.01+

  ```bash
  curl -X POST https://api.paywithlocus.com/api/wrapped/firecrawl/crawl \
    -H "Authorization: Bearer YOUR_LOCUS_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{"url": "https://example.com", "limit": 10}'
  ```

  | Parameter | Type   | Required | Description                     |
  | --------- | ------ | -------- | ------------------------------- |
  | `url`     | string | Yes      | Starting URL to crawl           |
  | `limit`   | number | No       | Max pages to crawl (default 10) |

  ### crawl-status

  Check the status of an ongoing crawl job.

  **Estimated cost:** Free

  | Parameter | Type   | Required | Description  |
  | --------- | ------ | -------- | ------------ |
  | `id`      | string | Yes      | Crawl job ID |

  ### map

  Discover all URLs on a website without scraping their content.

  **Estimated cost:** \$0.004

  | Parameter | Type   | Required | Description |
  | --------- | ------ | -------- | ----------- |
  | `url`     | string | Yes      | URL to map  |

  ### extract

  Extract structured data from one or more URLs using AI.

  **Estimated cost:** \$0.007+

  | Parameter | Type      | Required | Description               |
  | --------- | --------- | -------- | ------------------------- |
  | `urls`    | string\[] | Yes      | URLs to extract data from |

  ### extract-status

  Check the status of an extraction job.

  **Estimated cost:** Free

  | Parameter | Type   | Required | Description    |
  | --------- | ------ | -------- | -------------- |
  | `id`      | string | Yes      | Extract job ID |

  ### batch-scrape

  Scrape multiple URLs in a single batch request.

  **Estimated cost:** \$0.003+/url

  | Parameter | Type      | Required | Description    |
  | --------- | --------- | -------- | -------------- |
  | `urls`    | string\[] | Yes      | URLs to scrape |

  ### batch-scrape-status

  Check the status of a batch scrape job.

  **Estimated cost:** Free

  | Parameter | Type   | Required | Description         |
  | --------- | ------ | -------- | ------------------- |
  | `id`      | string | Yes      | Batch scrape job ID |

  ### search

  Search the web and return scraped content from top results.

  **Estimated cost:** \$0.005

  | Parameter | Type   | Required | Description  |
  | --------- | ------ | -------- | ------------ |
  | `query`   | string | Yes      | Search query |

  Firecrawl pricing is credit-based. Adding `json` format or browser `actions` increases the cost per page.

***

## Exa

AI-native semantic search, content retrieval, and question answering.

### Exa Docs (https://docs.exa.ai)

  Full upstream API documentation

| Endpoint       | Est. Cost    | Description                                      |
| -------------- | ------------ | ------------------------------------------------ |
| `search`       | \$0.010      | Search the web with natural language queries     |
| `contents`     | \$0.004/page | Retrieve full page content by URL or document ID |
| `find-similar` | \$0.010      | Find pages similar to a given URL                |
| `answer`       | \$0.008      | Get an AI-generated answer with cited sources    |

  ### search

  Search the web using natural language queries with neural or keyword matching.

  **Estimated cost:** \$0.010

  ```bash
  curl -X POST https://api.paywithlocus.com/api/wrapped/exa/search \
    -H "Authorization: Bearer YOUR_LOCUS_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{"query": "best practices for LLM prompt engineering", "numResults": 5}'
  ```

  | Parameter    | Type   | Required | Description                        |
  | ------------ | ------ | -------- | ---------------------------------- |
  | `query`      | string | Yes      | Natural language search query      |
  | `numResults` | number | No       | Number of results to return        |
  | `type`       | string | No       | Search type: `neural` or `keyword` |

  ### contents

  Retrieve the full content of web pages by URL or document ID.

  **Estimated cost:** \$0.004/page

  | Parameter | Type      | Required | Description                        |
  | --------- | --------- | -------- | ---------------------------------- |
  | `urls`    | string\[] | No\*     | URLs to fetch content from         |
  | `ids`     | string\[] | No\*     | Document IDs to fetch content from |

  \*At least one of `urls` or `ids` is required.

  ### find-similar

  Find web pages similar to a given URL.

  **Estimated cost:** \$0.010

  | Parameter | Type   | Required | Description                   |
  | --------- | ------ | -------- | ----------------------------- |
  | `url`     | string | Yes      | URL to find similar pages for |

  ### answer

  Get an AI-generated answer to a question with cited sources.

  **Estimated cost:** \$0.008

  | Parameter | Type   | Required | Description        |
  | --------- | ------ | -------- | ------------------ |
  | `query`   | string | Yes      | Question to answer |

***

## Clado

People search, LinkedIn enrichment, and deep research for lead generation.

**Available on [MPP](/wrapped-apis/mpp)**

### Clado Docs (https://docs.clado.ai)

  Full upstream API documentation

| Endpoint               | Est. Cost       | Description                                   |
| ---------------------- | --------------- | --------------------------------------------- |
| `search`               | \$0.01/result   | Search for people with filters                |
| `name-search`          | \$0.01          | Search by full name                           |
| `deep-research`        | \$0.01/result   | Async deep research for validated profiles    |
| `deep-research-status` | Free            | Check deep research status                    |
| `deep-research-cancel` | Free            | Cancel a running research job                 |
| `deep-research-more`   | \$0.01/result   | Request more results from existing job        |
| `contacts`             | \$0.04–\$0.14   | Get contact info (email, phone) from LinkedIn |
| `scrape`               | \$0.02          | Scrape a LinkedIn profile                     |
| `linkedin-profile`     | \$0.01          | Get structured LinkedIn profile data          |
| `post-reactions`       | \$0.01          | Get reactions on a LinkedIn post              |
| `bulk-contacts`        | \$0.04+/contact | Enrich contacts in bulk                       |
| `bulk-contacts-status` | Free            | Check bulk enrichment status                  |
| `research`             | \$0.10          | Deep research on a person using LLM analysis  |
| `credits`              | Free            | Check remaining API credits                   |

  ### search

  Search for people by query with optional company and school filters.

  **Estimated cost:** \$0.01/result

  ```bash
  curl -X POST https://api.paywithlocus.com/api/wrapped/clado/search \
    -H "Authorization: Bearer YOUR_LOCUS_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{"query": "ML engineers in San Francisco", "limit": 10}'
  ```

  | Parameter            | Type      | Required | Description                              |
  | -------------------- | --------- | -------- | ---------------------------------------- |
  | `query`              | string    | Yes      | Search query                             |
  | `limit`              | number    | No       | Max results (default 20)                 |
  | `companies`          | string\[] | No       | Filter by company names                  |
  | `schools`            | string\[] | No       | Filter by school names                   |
  | `advanced_filtering` | boolean   | No       | Enable advanced filtering (default true) |

  ### name-search

  Search for a person by their full name.

  **Estimated cost:** \$0.01

  | Parameter   | Type   | Required | Description         |
  | ----------- | ------ | -------- | ------------------- |
  | `full_name` | string | Yes      | Full name to search |

  ### deep-research

  Start an async deep research job to find validated profiles.

  **Estimated cost:** \$0.01/result

  | Parameter  | Type      | Required | Description                |
  | ---------- | --------- | -------- | -------------------------- |
  | `query`    | string    | No\*     | Search query               |
  | `criteria` | object\[] | No\*     | Structured search criteria |
  | `limit`    | number    | No       | Max results (default 30)   |

  \*At least one of `query`, `criteria`, or `opensearch_query` is required.

  ### deep-research-status

  Check the status and results of a deep research job.

  **Estimated cost:** Free

  | Parameter   | Type   | Required | Description          |
  | ----------- | ------ | -------- | -------------------- |
  | `jobId`     | string | Yes      | Deep research job ID |
  | `page`      | number | No       | Page number          |
  | `page_size` | number | No       | Results per page     |

  ### deep-research-cancel

  Cancel a running deep research job.

  **Estimated cost:** Free

  | Parameter | Type   | Required | Description                    |
  | --------- | ------ | -------- | ------------------------------ |
  | `jobId`   | string | Yes      | Deep research job ID to cancel |

  ### deep-research-more

  Request additional results for an existing deep research job.

  **Estimated cost:** \$0.01/result

  | Parameter          | Type   | Required | Description                     |
  | ------------------ | ------ | -------- | ------------------------------- |
  | `jobId`            | string | Yes      | Deep research job ID            |
  | `additional_limit` | number | No       | Additional results (default 30) |

  ### contacts

  Get contact info (email, phone) for a person by LinkedIn URL, email, or phone.

  **Estimated cost:** \$0.04–\$0.14

  | Parameter          | Type    | Required | Description               |
  | ------------------ | ------- | -------- | ------------------------- |
  | `linkedin_url`     | string  | No\*     | LinkedIn profile URL      |
  | `email`            | string  | No\*     | Email address             |
  | `phone`            | string  | No\*     | Phone number              |
  | `email_enrichment` | boolean | No       | Enrich email (4 credits)  |
  | `phone_enrichment` | boolean | No       | Enrich phone (10 credits) |

  \*At least one of `linkedin_url`, `email`, or `phone` is required.

  ### scrape

  Scrape a LinkedIn profile for detailed information.

  **Estimated cost:** \$0.02

  | Parameter      | Type   | Required | Description          |
  | -------------- | ------ | -------- | -------------------- |
  | `linkedin_url` | string | Yes      | LinkedIn profile URL |

  ### linkedin-profile

  Get structured LinkedIn profile data.

  **Estimated cost:** \$0.01

  | Parameter      | Type   | Required | Description          |
  | -------------- | ------ | -------- | -------------------- |
  | `linkedin_url` | string | Yes      | LinkedIn profile URL |

  ### post-reactions

  Get reactions on a LinkedIn post.

  **Estimated cost:** \$0.01

  | Parameter       | Type   | Required | Description             |
  | --------------- | ------ | -------- | ----------------------- |
  | `url`           | string | Yes      | LinkedIn post URL       |
  | `page`          | number | No       | Page number             |
  | `reaction_type` | string | No       | Filter by reaction type |

  ### bulk-contacts

  Enrich contacts in bulk by LinkedIn URLs or people IDs.

  **Estimated cost:** \$0.04+/contact

  | Parameter          | Type      | Required | Description           |
  | ------------------ | --------- | -------- | --------------------- |
  | `linkedin_urls`    | string\[] | No\*     | LinkedIn profile URLs |
  | `people_ids`       | string\[] | No\*     | People IDs            |
  | `email_enrichment` | boolean   | No       | Enrich emails         |
  | `phone_enrichment` | boolean   | No       | Enrich phones         |

  \*At least one of `linkedin_urls` or `people_ids` is required.

  ### bulk-contacts-status

  Check the status of a bulk contact enrichment job.

  **Estimated cost:** Free

  | Parameter | Type   | Required | Description          |
  | --------- | ------ | -------- | -------------------- |
  | `jobId`   | string | Yes      | Bulk contacts job ID |

  ### research

  Deep research on a person using web search and LLM analysis.

  **Estimated cost:** \$0.10

  | Parameter      | Type   | Required | Description          |
  | -------------- | ------ | -------- | -------------------- |
  | `linkedin_url` | string | No\*     | LinkedIn profile URL |
  | `email`        | string | No\*     | Email address        |
  | `phone`        | string | No\*     | Phone number         |

  \*At least one of `linkedin_url`, `email`, or `phone` is required.

  ### credits

  Check your remaining Clado API credits.

  **Estimated cost:** Free

  *No parameters required.*

***

## Apollo

People and company enrichment, lead search, and sales intelligence with 275M+ contacts.

**Available on [MPP](/wrapped-apis/mpp)**

### Apollo Docs (https://docs.apollo.io)

  Full upstream API documentation

| Endpoint                 | Est. Cost              | Description                                              |
| ------------------------ | ---------------------- | -------------------------------------------------------- |
| `people-enrichment`      | \$0.008–\$0.043        | Enrich a person with contact info and employment history |
| `bulk-people-enrichment` | \$0.008–\$0.043/person | Enrich up to 10 people in a single request               |
| `org-enrichment`         | \$0.008                | Get company data (industry, size, funding, tech stack)   |
| `bulk-org-enrichment`    | \$0.008/org            | Enrich up to 10 organizations by domain                  |
| `people-search`          | \$0.005                | Search for people by title, location, company, seniority |
| `org-search`             | \$0.005                | Search for companies by name, industry, location, size   |
| `job-postings`           | \$0.005                | Get current job postings for a company                   |
| `news-search`            | \$0.005                | Find news articles for organizations                     |

  ### people-enrichment

  Enrich a person with contact info, employment history, and firmographic data.

  **Estimated cost:** \$0.008–\$0.043

  ```bash
  curl -X POST https://api.paywithlocus.com/api/wrapped/apollo/people-enrichment \
    -H "Authorization: Bearer YOUR_LOCUS_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{"email": "jane@example.com", "reveal_phone_number": false}'
  ```

  | Parameter                | Type    | Required | Description                      |
  | ------------------------ | ------- | -------- | -------------------------------- |
  | `first_name`             | string  | No\*     | First name                       |
  | `last_name`              | string  | No\*     | Last name                        |
  | `email`                  | string  | No\*     | Email address                    |
  | `linkedin_url`           | string  | No\*     | LinkedIn profile URL             |
  | `organization_name`      | string  | No\*     | Current company name             |
  | `domain`                 | string  | No\*     | Current company domain           |
  | `id`                     | string  | No\*     | Apollo person ID                 |
  | `reveal_personal_emails` | boolean | No       | Include personal emails          |
  | `reveal_phone_number`    | boolean | No       | Include phone numbers (+\$0.035) |

  \*At least one identifier is required.

  ### bulk-people-enrichment

  Enrich up to 10 people in a single request.

  **Estimated cost:** \$0.008–\$0.043/person

  | Parameter                | Type      | Required | Description                                                                                                                            |
  | ------------------------ | --------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------- |
  | `details`                | object\[] | Yes      | Array of person identifiers (max 10). Each can have: `first_name`, `last_name`, `email`, `linkedin_url`, `organization_name`, `domain` |
  | `reveal_phone_number`    | boolean   | No       | Include phone numbers for all (+\$0.035/person)                                                                                        |
  | `reveal_personal_emails` | boolean   | No       | Include personal emails for all                                                                                                        |

  ### org-enrichment

  Get company data including industry, employee count, funding, revenue, and tech stack.

  **Estimated cost:** \$0.008

  | Parameter           | Type   | Required | Description            |
  | ------------------- | ------ | -------- | ---------------------- |
  | `domain`            | string | No\*     | Company domain         |
  | `organization_name` | string | No\*     | Company name           |
  | `id`                | string | No\*     | Apollo organization ID |

  \*At least one is required.

  ### bulk-org-enrichment

  Enrich up to 10 organizations by domain in a single request.

  **Estimated cost:** \$0.008/org

  | Parameter | Type      | Required | Description                       |
  | --------- | --------- | -------- | --------------------------------- |
  | `domains` | string\[] | Yes      | Array of company domains (max 10) |

  ### people-search

  Search for people by job title, location, company, seniority, and more.

  **Estimated cost:** \$0.005

  ```bash
  curl -X POST https://api.paywithlocus.com/api/wrapped/apollo/people-search \
    -H "Authorization: Bearer YOUR_LOCUS_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{"person_titles": ["CTO"], "person_locations": ["San Francisco"]}'
  ```

  | Parameter                | Type      | Required | Description                                                                                               |
  | ------------------------ | --------- | -------- | --------------------------------------------------------------------------------------------------------- |
  | `q_keywords`             | string    | No\*     | Keywords to search for                                                                                    |
  | `person_titles`          | string\[] | No\*     | Job titles to filter by                                                                                   |
  | `person_locations`       | string\[] | No\*     | Locations to filter by                                                                                    |
  | `q_organization_domains` | string\[] | No\*     | Company domains to filter by                                                                              |
  | `organization_ids`       | string\[] | No\*     | Apollo organization IDs                                                                                   |
  | `person_seniorities`     | string\[] | No\*     | Levels: `founder`, `c_suite`, `partner`, `vp`, `head`, `director`, `manager`, `senior`, `entry`, `intern` |
  | `per_page`               | number    | No       | Results per page (max 100, default 25)                                                                    |
  | `page`                   | number    | No       | Page number                                                                                               |

  \*At least one search criterion is required.

  ### org-search

  Search for companies by name, industry, location, size, and more.

  **Estimated cost:** \$0.005

  | Parameter                           | Type      | Required | Description                                 |
  | ----------------------------------- | --------- | -------- | ------------------------------------------- |
  | `q_keywords`                        | string    | No\*     | Keywords to search for                      |
  | `q_organization_name`               | string    | No\*     | Organization name                           |
  | `organization_industry_tag_ids`     | string\[] | No\*     | Industry tag IDs                            |
  | `organization_locations`            | string\[] | No\*     | Locations                                   |
  | `q_organization_keyword_tags`       | string\[] | No\*     | Keyword tags                                |
  | `organization_num_employees_ranges` | string\[] | No       | Employee ranges (e.g. `"1,10"`, `"51,200"`) |
  | `per_page`                          | number    | No       | Results per page (max 100, default 25)      |
  | `page`                              | number    | No       | Page number                                 |

  \*At least one search criterion is required.

  ### job-postings

  Get current job postings for a company — useful for identifying hiring signals.

  **Estimated cost:** \$0.005

  | Parameter         | Type   | Required | Description            |
  | ----------------- | ------ | -------- | ---------------------- |
  | `organization_id` | string | Yes      | Apollo organization ID |

  ### news-search

  Find recent news articles connected to organizations.

  **Estimated cost:** \$0.005

  | Parameter          | Type      | Required | Description                              |
  | ------------------ | --------- | -------- | ---------------------------------------- |
  | `organization_ids` | string\[] | Yes      | Apollo organization IDs to find news for |
  | `per_page`         | number    | No       | Results per page (default 25)            |
  | `page`             | number    | No       | Page number                              |

  Only stateless search and enrichment endpoints are available. CRM endpoints (contacts, accounts, deals, sequences) are disabled because Locus uses a shared platform API key.

***

## Browser Use

AI-powered browser automation — run tasks in a cloud browser with LLM agents.

### Browser Use Docs (https://docs.cloud.browser-use.com)

  Full upstream API documentation

| Endpoint          | Est. Cost | Description                      |
| ----------------- | --------- | -------------------------------- |
| `run-task`        | \$0.01+   | Start an automated browser task  |
| `get-task`        | Free      | Retrieve task details and output |
| `get-task-status` | Free      | Check current task status        |
| `stop-task`       | Free      | Stop a running task              |

  ### run-task

  Start an automated browser task with an AI agent.

  **Estimated cost:** \$0.01+

  ```bash
  curl -X POST https://api.paywithlocus.com/api/wrapped/browser-use/run-task \
    -H "Authorization: Bearer YOUR_LOCUS_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{"task": "Go to news.ycombinator.com and get the titles of the top 5 posts"}'
  ```

  | Parameter  | Type   | Required | Description                               |
  | ---------- | ------ | -------- | ----------------------------------------- |
  | `task`     | string | Yes      | Natural language description of the task  |
  | `llm`      | string | No       | Model to use (default: `browser-use-2.0`) |
  | `maxSteps` | number | No       | Max steps (default 100, max 200)          |

  **Available models and step costs:**

  | Model                      | Cost/Step |
  | -------------------------- | --------- |
  | `browser-use-llm`          | \$0.002   |
  | `browser-use-2.0`          | \$0.006   |
  | `gemini-flash-lite-latest` | \$0.005   |
  | `gpt-4o-mini`              | \$0.01    |
  | `gpt-4o` / `gpt-4.1`       | \$0.03    |
  | `claude-sonnet-4-6`        | \$0.05    |

  
    Total cost = \$0.01 (task init) + (maxSteps x step cost) + \$0.003 (Locus fee). You are charged based on `maxSteps`, not the actual steps taken.
  

  ### get-task

  Retrieve the full details and output of a task.

  **Estimated cost:** Free

  | Parameter | Type   | Required | Description |
  | --------- | ------ | -------- | ----------- |
  | `taskId`  | string | Yes      | Task ID     |

  ### get-task-status

  Check the current status of a running task.

  **Estimated cost:** Free

  | Parameter | Type   | Required | Description |
  | --------- | ------ | -------- | ----------- |
  | `taskId`  | string | Yes      | Task ID     |

  ### stop-task

  Stop a running browser task.

  **Estimated cost:** Free

  | Parameter | Type   | Required | Description     |
  | --------- | ------ | -------- | --------------- |
  | `taskId`  | string | Yes      | Task ID to stop |

***

## X (Twitter)

Read-only access to tweets, users, search, and trending topics via the X API v2.

### X API Docs (https://docs.x.com/x-api/introduction)

  Full upstream API documentation

All X endpoints cost **\$0.016** per call (\$0.013 upstream + \$0.003 Locus fee).

| Endpoint              | Description                                  |
| --------------------- | -------------------------------------------- |
| `tweet-lookup`        | Get a single tweet by ID                     |
| `tweets-lookup`       | Get multiple tweets by IDs (up to 100)       |
| `tweet-search-recent` | Search tweets from the last 7 days           |
| `tweet-count-recent`  | Count tweets matching a query (last 7 days)  |
| `tweet-quotes`        | Get tweets that quote a specific tweet       |
| `tweet-liking-users`  | Get users who liked a tweet                  |
| `tweet-retweeted-by`  | Get users who retweeted a tweet              |
| `user-lookup`         | Get a user by ID                             |
| `users-lookup`        | Get multiple users by IDs (up to 100)        |
| `user-by-username`    | Get a user by @username                      |
| `users-by-usernames`  | Get multiple users by @usernames (up to 100) |
| `user-tweets`         | Get a user's authored tweets                 |
| `user-mentions`       | Get tweets mentioning a user                 |
| `user-followers`      | Get a user's followers                       |
| `user-following`      | Get users a user follows                     |
| `trends`              | Get trending topics by location              |

  ### tweet-lookup

  Get a single tweet by its ID with optional field expansions.

  **Estimated cost:** \$0.016

  ```bash
  curl -X POST https://api.paywithlocus.com/api/wrapped/x/tweet-lookup \
    -H "Authorization: Bearer YOUR_LOCUS_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{"id": "1234567890", "tweet.fields": "created_at,public_metrics,author_id"}'
  ```

  | Parameter      | Type   | Required | Description                                                                                                 |
  | -------------- | ------ | -------- | ----------------------------------------------------------------------------------------------------------- |
  | `id`           | string | Yes      | Tweet ID                                                                                                    |
  | `tweet.fields` | string | No       | Comma-separated: `created_at`, `public_metrics`, `author_id`, `entities`, `lang`, `source`, etc.            |
  | `user.fields`  | string | No       | Comma-separated: `name`, `username`, `description`, `profile_image_url`, `public_metrics`, `verified`, etc. |
  | `expansions`   | string | No       | Comma-separated: `author_id`, `referenced_tweets.id`, `attachments.media_keys`, etc.                        |
  | `media.fields` | string | No       | Comma-separated: `url`, `type`, `width`, `height`, `preview_image_url`, etc.                                |

  ### tweets-lookup

  Get multiple tweets by IDs in a single request (up to 100).

  **Estimated cost:** \$0.016

  | Parameter      | Type                | Required | Description                                   |
  | -------------- | ------------------- | -------- | --------------------------------------------- |
  | `ids`          | string \| string\[] | Yes      | Tweet IDs (comma-separated or array, max 100) |
  | `tweet.fields` | string              | No       | Tweet fields to include                       |
  | `user.fields`  | string              | No       | User fields to include                        |
  | `expansions`   | string              | No       | Data expansions                               |
  | `media.fields` | string              | No       | Media fields to include                       |

  ### tweet-search-recent

  Search tweets from the last 7 days using the X query language.

  **Estimated cost:** \$0.016

  ```bash
  curl -X POST https://api.paywithlocus.com/api/wrapped/x/tweet-search-recent \
    -H "Authorization: Bearer YOUR_LOCUS_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{"query": "from:elonmusk has:media", "max_results": 10}'
  ```

  | Parameter          | Type   | Required | Description                                                                                                               |
  | ------------------ | ------ | -------- | ------------------------------------------------------------------------------------------------------------------------- |
  | `query`            | string | Yes      | Search query (max 512 chars). Supports operators: `from:`, `to:`, `is:retweet`, `has:media`, `has:links`, `lang:en`, etc. |
  | `sort_order`       | string | No       | `recency` or `relevancy`                                                                                                  |
  | `start_time`       | string | No       | Oldest UTC datetime (ISO 8601)                                                                                            |
  | `end_time`         | string | No       | Newest UTC datetime (ISO 8601)                                                                                            |
  | `max_results`      | number | No       | Results to return (10–100)                                                                                                |
  | `pagination_token` | string | No       | Token for next page                                                                                                       |
  | `tweet.fields`     | string | No       | Tweet fields to include                                                                                                   |
  | `user.fields`      | string | No       | User fields to include                                                                                                    |
  | `expansions`       | string | No       | Data expansions                                                                                                           |

  ### tweet-count-recent

  Get the count of tweets matching a query over the last 7 days, bucketed by time.

  **Estimated cost:** \$0.016

  | Parameter     | Type   | Required | Description                          |
  | ------------- | ------ | -------- | ------------------------------------ |
  | `query`       | string | Yes      | Search query (same syntax as search) |
  | `granularity` | string | No       | `minute`, `hour` (default), or `day` |
  | `start_time`  | string | No       | Oldest UTC datetime (ISO 8601)       |
  | `end_time`    | string | No       | Newest UTC datetime (ISO 8601)       |

  ### tweet-quotes

  Get tweets that quote a specific tweet.

  **Estimated cost:** \$0.016

  | Parameter          | Type   | Required | Description                |
  | ------------------ | ------ | -------- | -------------------------- |
  | `id`               | string | Yes      | Tweet ID to find quotes of |
  | `max_results`      | number | No       | Results to return (10–100) |
  | `pagination_token` | string | No       | Token for next page        |

  ### tweet-liking-users

  Get users who liked a specific tweet.

  **Estimated cost:** \$0.016

  | Parameter          | Type   | Required | Description         |
  | ------------------ | ------ | -------- | ------------------- |
  | `id`               | string | Yes      | Tweet ID            |
  | `max_results`      | number | No       | Results to return   |
  | `pagination_token` | string | No       | Token for next page |

  ### tweet-retweeted-by

  Get users who retweeted a specific tweet.

  **Estimated cost:** \$0.016

  | Parameter          | Type   | Required | Description         |
  | ------------------ | ------ | -------- | ------------------- |
  | `id`               | string | Yes      | Tweet ID            |
  | `max_results`      | number | No       | Results to return   |
  | `pagination_token` | string | No       | Token for next page |

  ### user-lookup

  Get a single user by their ID.

  **Estimated cost:** \$0.016

  | Parameter     | Type   | Required | Description            |
  | ------------- | ------ | -------- | ---------------------- |
  | `id`          | string | Yes      | User ID                |
  | `user.fields` | string | No       | User fields to include |
  | `expansions`  | string | No       | Data expansions        |

  ### users-lookup

  Get multiple users by IDs in a single request (up to 100).

  **Estimated cost:** \$0.016

  | Parameter     | Type                | Required | Description                                  |
  | ------------- | ------------------- | -------- | -------------------------------------------- |
  | `ids`         | string \| string\[] | Yes      | User IDs (comma-separated or array, max 100) |
  | `user.fields` | string              | No       | User fields to include                       |
  | `expansions`  | string              | No       | Data expansions                              |

  ### user-by-username

  Get a user by their @username.

  **Estimated cost:** \$0.016

  | Parameter     | Type   | Required | Description                 |
  | ------------- | ------ | -------- | --------------------------- |
  | `username`    | string | Yes      | Username (without @ prefix) |
  | `user.fields` | string | No       | User fields to include      |
  | `expansions`  | string | No       | Data expansions             |

  ### users-by-usernames

  Get multiple users by @usernames in a single request (up to 100).

  **Estimated cost:** \$0.016

  | Parameter     | Type                | Required | Description                                   |
  | ------------- | ------------------- | -------- | --------------------------------------------- |
  | `usernames`   | string \| string\[] | Yes      | Usernames (comma-separated or array, max 100) |
  | `user.fields` | string              | No       | User fields to include                        |
  | `expansions`  | string              | No       | Data expansions                               |

  ### user-tweets

  Get a user's authored tweets (up to 3,200 most recent).

  **Estimated cost:** \$0.016

  | Parameter          | Type   | Required | Description                            |
  | ------------------ | ------ | -------- | -------------------------------------- |
  | `id`               | string | Yes      | User ID                                |
  | `exclude`          | string | No       | Comma-separated: `retweets`, `replies` |
  | `max_results`      | number | No       | Results to return (10–100)             |
  | `pagination_token` | string | No       | Token for next page                    |
  | `start_time`       | string | No       | Oldest UTC datetime (ISO 8601)         |
  | `end_time`         | string | No       | Newest UTC datetime (ISO 8601)         |
  | `sort_order`       | string | No       | `recency` or `relevancy`               |

  ### user-mentions

  Get tweets that mention a specific user (up to 800 most recent).

  **Estimated cost:** \$0.016

  | Parameter          | Type   | Required | Description                    |
  | ------------------ | ------ | -------- | ------------------------------ |
  | `id`               | string | Yes      | User ID                        |
  | `max_results`      | number | No       | Results to return (10–100)     |
  | `pagination_token` | string | No       | Token for next page            |
  | `start_time`       | string | No       | Oldest UTC datetime (ISO 8601) |
  | `end_time`         | string | No       | Newest UTC datetime (ISO 8601) |

  ### user-followers

  Get a user's followers.

  **Estimated cost:** \$0.016

  | Parameter          | Type   | Required | Description         |
  | ------------------ | ------ | -------- | ------------------- |
  | `id`               | string | Yes      | User ID             |
  | `max_results`      | number | No       | Results to return   |
  | `pagination_token` | string | No       | Token for next page |

  ### user-following

  Get users that a specific user follows.

  **Estimated cost:** \$0.016

  | Parameter          | Type   | Required | Description         |
  | ------------------ | ------ | -------- | ------------------- |
  | `id`               | string | Yes      | User ID             |
  | `max_results`      | number | No       | Results to return   |
  | `pagination_token` | string | No       | Token for next page |

  ### trends

  Get trending topics for a location by WOEID.

  **Estimated cost:** \$0.016

  | Parameter | Type   | Required | Description                                                     |
  | --------- | ------ | -------- | --------------------------------------------------------------- |
  | `woeid`   | number | Yes      | Where On Earth ID (1 = worldwide, 23424977 = US, 23424975 = UK) |

  Only read-only endpoints are available. Write operations (posting tweets, likes, retweets, DMs), streaming, and user-context endpoints are not wrapped.

***

## fal.ai

Generative AI platform — 600+ models for image, video, audio, and more.

### fal.ai Docs (https://docs.fal.ai)

  Full upstream API documentation

| Endpoint   | Est. Cost       | Description                                     |
| ---------- | --------------- | ----------------------------------------------- |
| `generate` | Model-dependent | Queue a generation request for any fal.ai model |
| `status`   | Free            | Check the status of a queued request            |
| `result`   | Free            | Retrieve the output of a completed request      |

  ### generate

  Queue a generation request for any fal.ai model (image, video, audio, etc.).

  **Estimated cost:** Model-dependent

  ```bash
  curl -X POST https://api.paywithlocus.com/api/wrapped/fal/generate \
    -H "Authorization: Bearer YOUR_LOCUS_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{"model": "fal-ai/flux-pro/v1.1", "prompt": "a cat sitting on a rainbow"}'
  ```

  | Parameter    | Type   | Required | Description                                    |
  | ------------ | ------ | -------- | ---------------------------------------------- |
  | `model`      | string | Yes      | fal.ai model ID (e.g., `fal-ai/flux-pro/v1.1`) |
  | `prompt`     | string | No       | Text prompt for generation                     |
  | `image_url`  | string | No       | Input image for image-to-image/video models    |
  | `num_images` | number | No       | Number of images to generate                   |

  **Pricing by model type:**

  | Model            | Price   | Unit          |
  | ---------------- | ------- | ------------- |
  | Flux Pro v1.1    | \$0.04  | per megapixel |
  | Flux Dev         | \$0.025 | per megapixel |
  | Recraft v4       | \$0.04  | per image     |
  | Wan v2.5 (video) | \$0.05  | per second    |
  | Veo3 (video)     | \$0.40  | per second    |
  | Minimax Video-01 | \$0.50  | flat          |
  | Fast SDXL        | Free    | per image     |
  | Whisper (audio)  | Free    | flat          |

  
    Any fal.ai model ID is accepted. Known models get accurate cost estimates; unknown models fall back to a conservative \$0.10 flat charge.
  

  ### status

  Check the status of a queued generation request.

  **Estimated cost:** Free

  | Parameter    | Type   | Required | Description                       |
  | ------------ | ------ | -------- | --------------------------------- |
  | `model`      | string | Yes      | Model ID used for the request     |
  | `request_id` | string | Yes      | Request ID from the generate call |

  ### result

  Retrieve the output of a completed generation request.

  **Estimated cost:** Free

  | Parameter    | Type   | Required | Description                       |
  | ------------ | ------ | -------- | --------------------------------- |
  | `model`      | string | Yes      | Model ID used for the request     |
  | `request_id` | string | Yes      | Request ID from the generate call |

***

## Abstract API

12 data validation and enrichment APIs covering email, IP, phone, company, finance, and more. All Abstract endpoints cost **\$0.006** per call (\$0.003 upstream + \$0.003 Locus fee).

**Available on [MPP](/wrapped-apis/mpp)**

| Provider           | Endpoint       | Description                                   |
| ------------------ | -------------- | --------------------------------------------- |
| Email Validation   | `validate`     | Check if an email is valid and deliverable    |
| Email Reputation   | `check`        | Get reputation and risk score for an email    |
| IP Geolocation     | `lookup`       | Geolocate an IP to country, city, coordinates |
| IP Intelligence    | `lookup`       | Detect VPNs, proxies, bots, Tor by IP         |
| Phone Intelligence | `lookup`       | Validate phone numbers and get carrier info   |
| Company Enrichment | `lookup`       | Get company details from a domain             |
| Exchange Rates     | `live`         | Current exchange rates for 150+ currencies    |
| Exchange Rates     | `convert`      | Convert between two currencies                |
| Exchange Rates     | `historical`   | Historical rates for a specific date          |
| Holidays           | `lookup`       | Public holidays for 200+ countries            |
| IBAN Validation    | `validate`     | Validate IBANs and get bank details           |
| Timezone           | `current-time` | Current time for any location                 |
| Timezone           | `convert-time` | Convert between timezones                     |
| VAT                | `validate`     | Validate EU VAT numbers                       |
| VAT                | `calculate`    | Calculate VAT for an amount                   |
| VAT                | `categories`   | List VAT categories for a country             |
| Web Scraping       | `scrape`       | Scrape a URL with optional JS rendering       |

  ### Email Validation — validate

  Check if an email address is valid, deliverable, and not disposable.

  ```bash
  curl -X POST https://api.paywithlocus.com/api/wrapped/abstract-email-validation/validate \
    -H "Authorization: Bearer YOUR_LOCUS_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{"email": "test@example.com"}'
  ```

  | Parameter | Type   | Required | Description               |
  | --------- | ------ | -------- | ------------------------- |
  | `email`   | string | Yes      | Email address to validate |

  ### Email Reputation — check

  Get reputation score and risk assessment for an email address.

  | Parameter | Type   | Required | Description            |
  | --------- | ------ | -------- | ---------------------- |
  | `email`   | string | Yes      | Email address to check |

  ### IP Geolocation — lookup

  Get geographic location data for an IP address.

  ```bash
  curl -X POST https://api.paywithlocus.com/api/wrapped/abstract-ip-geolocation/lookup \
    -H "Authorization: Bearer YOUR_LOCUS_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{"ip_address": "8.8.8.8"}'
  ```

  | Parameter    | Type   | Required | Description                      |
  | ------------ | ------ | -------- | -------------------------------- |
  | `ip_address` | string | Yes      | IP address to geolocate          |
  | `fields`     | string | No       | Comma-separated fields to return |

  ### IP Intelligence — lookup

  Get threat intelligence for an IP address (VPN, proxy, bot detection).

  | Parameter    | Type   | Required | Description                      |
  | ------------ | ------ | -------- | -------------------------------- |
  | `ip_address` | string | Yes      | IP address to analyze            |
  | `fields`     | string | No       | Comma-separated fields to return |

  ### Phone Intelligence — lookup

  Get carrier, type, and validity info for a phone number.

  | Parameter | Type   | Required | Description                     |
  | --------- | ------ | -------- | ------------------------------- |
  | `phone`   | string | Yes      | Phone number to validate        |
  | `country` | string | No       | ISO 3166-1 alpha-2 country code |

  ### Company Enrichment — lookup

  Get company details (name, industry, size, etc.) from a domain.

  | Parameter | Type   | Required | Description                      |
  | --------- | ------ | -------- | -------------------------------- |
  | `domain`  | string | Yes      | Company domain to enrich         |
  | `fields`  | string | No       | Comma-separated fields to return |

  ### Exchange Rates — live

  Get current exchange rates for a base currency.

  | Parameter | Type   | Required | Description                    |
  | --------- | ------ | -------- | ------------------------------ |
  | `base`    | string | Yes      | Base currency code (e.g., USD) |
  | `target`  | string | No       | Target currency code           |

  ### Exchange Rates — convert

  Convert an amount between two currencies.

  ```bash
  curl -X POST https://api.paywithlocus.com/api/wrapped/abstract-exchange-rates/convert \
    -H "Authorization: Bearer YOUR_LOCUS_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{"base": "USD", "target": "EUR", "base_amount": 100}'
  ```

  | Parameter     | Type   | Required | Description                  |
  | ------------- | ------ | -------- | ---------------------------- |
  | `base`        | string | Yes      | Source currency code         |
  | `target`      | string | Yes      | Target currency code         |
  | `base_amount` | number | No       | Amount to convert            |
  | `date`        | string | No       | Historical date (YYYY-MM-DD) |

  ### Exchange Rates — historical

  Get exchange rates for a specific historical date.

  | Parameter | Type   | Required | Description          |
  | --------- | ------ | -------- | -------------------- |
  | `base`    | string | Yes      | Base currency code   |
  | `date`    | string | Yes      | Date (YYYY-MM-DD)    |
  | `target`  | string | No       | Target currency code |

  ### Holidays — lookup

  Get public holidays for a country and optional date.

  | Parameter | Type   | Required | Description                     |
  | --------- | ------ | -------- | ------------------------------- |
  | `country` | string | Yes      | ISO 3166-1 alpha-2 country code |
  | `year`    | number | No       | Year                            |
  | `month`   | number | No       | Month (1-12)                    |
  | `day`     | number | No       | Day of month                    |

  ### IBAN Validation — validate

  Validate an IBAN and get associated bank details.

  | Parameter | Type   | Required | Description      |
  | --------- | ------ | -------- | ---------------- |
  | `iban`    | string | Yes      | IBAN to validate |

  ### Timezone — current-time

  Get the current time for a location.

  | Parameter  | Type   | Required | Description                  |
  | ---------- | ------ | -------- | ---------------------------- |
  | `location` | string | Yes      | Location name or coordinates |

  ### Timezone — convert-time

  Convert a datetime between two timezones.

  | Parameter         | Type   | Required | Description         |
  | ----------------- | ------ | -------- | ------------------- |
  | `base_location`   | string | Yes      | Source location     |
  | `target_location` | string | Yes      | Target location     |
  | `base_datetime`   | string | No       | Datetime to convert |

  ### VAT — validate

  Validate a VAT number and get company details.

  | Parameter    | Type   | Required | Description            |
  | ------------ | ------ | -------- | ---------------------- |
  | `vat_number` | string | Yes      | VAT number to validate |

  ### VAT — calculate

  Calculate VAT for an amount in a given country.

  | Parameter      | Type    | Required | Description                     |
  | -------------- | ------- | -------- | ------------------------------- |
  | `amount`       | number  | Yes      | Amount to calculate VAT for     |
  | `country_code` | string  | Yes      | ISO 3166-1 alpha-2 country code |
  | `is_vat_incl`  | boolean | No       | Whether amount includes VAT     |
  | `vat_category` | string  | No       | VAT category                    |

  ### VAT — categories

  List VAT categories and rates for a country.

  | Parameter      | Type   | Required | Description                     |
  | -------------- | ------ | -------- | ------------------------------- |
  | `country_code` | string | Yes      | ISO 3166-1 alpha-2 country code |

  ### Web Scraping — scrape

  Scrape a URL and return the HTML content.

  | Parameter       | Type    | Required | Description                       |
  | --------------- | ------- | -------- | --------------------------------- |
  | `url`           | string  | Yes      | URL to scrape                     |
  | `render_js`     | boolean | No       | Render JavaScript before scraping |
  | `proxy_country` | string  | No       | Proxy country for geolocation     |

***

## Anthropic

Claude AI models — chat completions and token counting.

### Anthropic Docs (https://docs.anthropic.com)

  Full upstream API documentation

| Endpoint       | Est. Cost                          | Description                                               |
| -------------- | ---------------------------------- | --------------------------------------------------------- |
| `messages`     | Model-dependent (\~\$0.001–\$0.20) | Generate text with Claude models (text, vision, tool use) |
| `count-tokens` | \$0.001                            | Count tokens for cost estimation before a generation call |

  Anthropic uses a **15% fee** on top of upstream token costs instead of the flat \$0.003 fee, same as OpenAI and Gemini.

  ### messages

  Generate text with Claude models. Supports text, vision, and tool use.

  **Estimated cost:** Model-dependent (\~\$0.001–\$0.20)

  ```bash
  curl -X POST https://api.paywithlocus.com/api/wrapped/anthropic/messages \
    -H "Authorization: Bearer YOUR_LOCUS_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
      "model": "claude-sonnet-4-20250514",
      "messages": [{"role": "user", "content": "Hello!"}],
      "max_tokens": 1024
    }'
  ```

  | Parameter        | Type      | Required | Description                                                                                       |
  | ---------------- | --------- | -------- | ------------------------------------------------------------------------------------------------- |
  | `model`          | string    | Yes      | Model ID (e.g. `claude-sonnet-4-20250514`, `claude-opus-4-20250514`, `claude-haiku-3-5-20241022`) |
  | `messages`       | array     | Yes      | Conversation messages. Each: `{ role: "user"\|"assistant", content: "text" }`                     |
  | `max_tokens`     | number    | Yes      | Maximum output tokens                                                                             |
  | `system`         | string    | No       | System prompt                                                                                     |
  | `temperature`    | number    | No       | Sampling temperature (0.0–1.0)                                                                    |
  | `top_p`          | number    | No       | Nucleus sampling threshold                                                                        |
  | `stop_sequences` | string\[] | No       | Custom stop sequences                                                                             |

  ### count-tokens

  Count tokens for a set of messages before making a generation call.

  **Estimated cost:** \$0.001

  | Parameter  | Type   | Required | Description                                       |
  | ---------- | ------ | -------- | ------------------------------------------------- |
  | `model`    | string | Yes      | Model ID to count tokens for                      |
  | `messages` | array  | Yes      | Messages array (same format as messages endpoint) |

***

## DeepSeek

DeepSeek-V3 and R1 reasoning models.

**Available on [MPP](/wrapped-apis/mpp)**

### DeepSeek Docs (https://platform.deepseek.com/docs)

  Full upstream API documentation

| Endpoint      | Est. Cost                           | Description                                  |
| ------------- | ----------------------------------- | -------------------------------------------- |
| `chat`        | Model-dependent (\~\$0.004–\$0.025) | Generate text with DeepSeek-V3 and R1 models |
| `fim`         | \$0.003–\$0.005                     | Fill-in-the-middle code completion           |
| `list-models` | Fee only                            | List available DeepSeek models               |
| `get-balance` | Fee only                            | Check your DeepSeek API balance              |

  ### chat

  Generate text with DeepSeek models.

  **Estimated cost:** Model-dependent (\~\$0.004–\$0.025)

  | Parameter     | Type   | Required | Description                                          |
  | ------------- | ------ | -------- | ---------------------------------------------------- |
  | `model`       | string | Yes      | Model ID (e.g. `deepseek-chat`, `deepseek-reasoner`) |
  | `messages`    | array  | Yes      | Conversation messages                                |
  | `temperature` | number | No       | Sampling temperature                                 |
  | `max_tokens`  | number | No       | Maximum output tokens                                |

  ### fim

  Fill-in-the-middle code completion.

  **Estimated cost:** \$0.003–\$0.005

  | Parameter | Type   | Required | Description                          |
  | --------- | ------ | -------- | ------------------------------------ |
  | `model`   | string | Yes      | Model ID                             |
  | `prompt`  | string | Yes      | Code prefix (text before the cursor) |
  | `suffix`  | string | No       | Code suffix (text after the cursor)  |

  ### list-models

  List available DeepSeek models.

  **Estimated cost:** Fee only

  *No parameters required.*

  ### get-balance

  Check your DeepSeek API balance.

  **Estimated cost:** Fee only

  *No parameters required.*

***

## Grok

xAI's Grok models — chat, image generation, web search, and text-to-speech.

**Available on [MPP](/wrapped-apis/mpp)**

### Grok Docs (https://docs.x.ai)

  Full upstream API documentation

| Endpoint              | Est. Cost          | Description                               |
| --------------------- | ------------------ | ----------------------------------------- |
| `chat`                | \$0.001–\$0.02     | Generate text with Grok models            |
| `image-generate`      | \$0.02–\$0.08      | Generate images from text prompts         |
| `image-edit`          | \$0.02–\$0.08      | Edit images with text instructions        |
| `chat-web-search`     | Dynamic            | Chat with live web search grounding       |
| `chat-x-search`       | Dynamic            | Chat with live X/Twitter search grounding |
| `chat-code-execution` | Dynamic            | Chat with code execution sandbox          |
| `tts`                 | \~\$0.005/1K chars | Convert text to speech                    |

  ### chat

  Generate text with Grok models.

  **Estimated cost:** \$0.001–\$0.02

  | Parameter     | Type   | Required | Description                             |
  | ------------- | ------ | -------- | --------------------------------------- |
  | `model`       | string | Yes      | Model ID (e.g. `grok-3`, `grok-3-mini`) |
  | `messages`    | array  | Yes      | Conversation messages                   |
  | `temperature` | number | No       | Sampling temperature                    |
  | `max_tokens`  | number | No       | Maximum output tokens                   |

  ### image-generate

  Generate images from text prompts.

  **Estimated cost:** \$0.02–\$0.08

  | Parameter | Type   | Required | Description                   |
  | --------- | ------ | -------- | ----------------------------- |
  | `prompt`  | string | Yes      | Text description of the image |
  | `model`   | string | No       | Image model to use            |
  | `n`       | number | No       | Number of images              |

  ### image-edit

  Edit images with text instructions.

  **Estimated cost:** \$0.02–\$0.08

  | Parameter | Type   | Required | Description                 |
  | --------- | ------ | -------- | --------------------------- |
  | `prompt`  | string | Yes      | Edit instructions           |
  | `image`   | string | Yes      | Base64-encoded image or URL |

  ### chat-web-search

  Chat with live web search grounding.

  **Estimated cost:** Dynamic

  | Parameter  | Type   | Required | Description           |
  | ---------- | ------ | -------- | --------------------- |
  | `model`    | string | Yes      | Model ID              |
  | `messages` | array  | Yes      | Conversation messages |

  ### chat-x-search

  Chat with live X/Twitter search grounding.

  **Estimated cost:** Dynamic

  | Parameter  | Type   | Required | Description           |
  | ---------- | ------ | -------- | --------------------- |
  | `model`    | string | Yes      | Model ID              |
  | `messages` | array  | Yes      | Conversation messages |

  ### chat-code-execution

  Chat with code execution sandbox.

  **Estimated cost:** Dynamic

  | Parameter  | Type   | Required | Description           |
  | ---------- | ------ | -------- | --------------------- |
  | `model`    | string | Yes      | Model ID              |
  | `messages` | array  | Yes      | Conversation messages |

  ### tts

  Convert text to speech.

  **Estimated cost:** \~\$0.005/1K chars

  | Parameter  | Type   | Required | Description     |
  | ---------- | ------ | -------- | --------------- |
  | `text`     | string | Yes      | Text to convert |
  | `language` | string | Yes      | Language code   |

***

## Perplexity

Sonar search-grounded chat, web search, and embeddings.

**Available on [MPP](/wrapped-apis/mpp)**

### Perplexity Docs (https://docs.perplexity.ai)

  Full upstream API documentation

| Endpoint                    | Est. Cost      | Description                             |
| --------------------------- | -------------- | --------------------------------------- |
| `sonar-chat`                | \$0.005–\$0.02 | Search-grounded chat with citations     |
| `web-search`                | \$0.006        | Direct web search                       |
| `embeddings`                | \~\$0.001      | Generate text embeddings                |
| `contextualized-embeddings` | \~\$0.001      | Generate context-aware chunk embeddings |

  ### sonar-chat

  Search-grounded chat with citations.

  **Estimated cost:** \$0.005–\$0.02

  | Parameter     | Type   | Required | Description                                             |
  | ------------- | ------ | -------- | ------------------------------------------------------- |
  | `model`       | string | Yes      | Model ID (e.g. `sonar`, `sonar-pro`, `sonar-reasoning`) |
  | `messages`    | array  | Yes      | Conversation messages                                   |
  | `temperature` | number | No       | Sampling temperature                                    |

  ### web-search

  Direct web search returning structured results.

  **Estimated cost:** \$0.006

  | Parameter | Type   | Required | Description  |
  | --------- | ------ | -------- | ------------ |
  | `query`   | string | Yes      | Search query |

  ### embeddings

  Generate text embeddings.

  **Estimated cost:** \~\$0.001

  | Parameter | Type                | Required | Description        |
  | --------- | ------------------- | -------- | ------------------ |
  | `model`   | string              | Yes      | Embedding model ID |
  | `input`   | string \| string\[] | Yes      | Text to embed      |

  ### contextualized-embeddings

  Generate context-aware embeddings for document chunks.

  **Estimated cost:** \~\$0.001

  | Parameter  | Type      | Required | Description              |
  | ---------- | --------- | -------- | ------------------------ |
  | `model`    | string    | Yes      | Embedding model ID       |
  | `document` | string    | Yes      | Full document text       |
  | `chunks`   | string\[] | Yes      | Document chunks to embed |

***

## Replicate

Run open-source AI models (Llama, Stable Diffusion, Whisper, and more).

**Available on [MPP](/wrapped-apis/mpp)**

### Replicate Docs (https://replicate.com/docs)

  Full upstream API documentation

| Endpoint         | Est. Cost                        | Description                    |
| ---------------- | -------------------------------- | ------------------------------ |
| `run-model`      | Model-dependent (\$0.005–\$0.05) | Run an open-source model       |
| `get-prediction` | Free                             | Get the result of a prediction |
| `get-model`      | \$0.001                          | Get model metadata             |
| `list-models`    | \$0.001                          | List available models          |

  ### run-model

  Run an open-source model on Replicate.

  **Estimated cost:** Model-dependent (\$0.005–\$0.05)

  | Parameter     | Type   | Required | Description                                        |
  | ------------- | ------ | -------- | -------------------------------------------------- |
  | `model_owner` | string | Yes      | Model owner (e.g. `meta`)                          |
  | `model_name`  | string | Yes      | Model name (e.g. `llama-4-scout-17b-16e-instruct`) |
  | `input`       | object | No       | Model-specific input parameters                    |

  ### get-prediction

  Get the result of a prediction.

  **Estimated cost:** Free

  | Parameter       | Type   | Required | Description   |
  | --------------- | ------ | -------- | ------------- |
  | `prediction_id` | string | Yes      | Prediction ID |

  ### get-model

  Get model metadata and available versions.

  **Estimated cost:** \$0.001

  | Parameter     | Type   | Required | Description |
  | ------------- | ------ | -------- | ----------- |
  | `model_owner` | string | Yes      | Model owner |
  | `model_name`  | string | Yes      | Model name  |

  ### list-models

  List available models on Replicate.

  **Estimated cost:** \$0.001

  *No parameters required.*

***

## Stability AI

Image generation, editing, upscaling, 3D, and audio.

**Available on [MPP](/wrapped-apis/mpp)**

### Stability AI Docs (https://platform.stability.ai/docs)

  Full upstream API documentation

| Endpoint             | Est. Cost       | Description                      |
| -------------------- | --------------- | -------------------------------- |
| `generate-ultra`     | \$0.092         | Highest-quality image generation |
| `generate-core`      | \$0.035         | Fast, high-quality generation    |
| `generate-sd3`       | \$0.029–\$0.075 | Stable Diffusion 3 generation    |
| `erase`              | \$0.058         | Erase objects from images        |
| `inpaint`            | \$0.058         | Fill in masked regions           |
| `outpaint`           | \$0.046         | Extend image canvas              |
| `search-and-replace` | \$0.058         | Replace objects via text prompt  |
| `remove-background`  | \$0.058         | Remove image background          |
| `upscale-fast`       | \$0.023         | Fast 4x upscale                  |
| `upscale-creative`   | \$0.69          | Creative high-quality upscale    |
| `sketch`             | \$0.058         | Generate from sketch input       |
| `structure`          | \$0.058         | Structure-guided generation      |
| `stable-fast-3d`     | \$0.115         | Generate 3D models from images   |
| `text-to-audio`      | \$0.23          | Generate audio from text         |

  Stability AI has 23+ endpoints total. The table above shows the most popular ones — all follow the same pattern.

  ### generate-ultra

  Highest-quality image generation.

  **Estimated cost:** \$0.092

  | Parameter         | Type   | Required | Description                       |
  | ----------------- | ------ | -------- | --------------------------------- |
  | `prompt`          | string | Yes      | Text description of the image     |
  | `negative_prompt` | string | No       | What to exclude from the image    |
  | `aspect_ratio`    | string | No       | Aspect ratio (e.g. `1:1`, `16:9`) |
  | `output_format`   | string | No       | `png` or `jpeg`                   |

  ### generate-core

  Fast, high-quality image generation.

  **Estimated cost:** \$0.035

  | Parameter         | Type   | Required | Description                                 |
  | ----------------- | ------ | -------- | ------------------------------------------- |
  | `prompt`          | string | Yes      | Text description                            |
  | `negative_prompt` | string | No       | What to exclude                             |
  | `aspect_ratio`    | string | No       | Aspect ratio                                |
  | `style_preset`    | string | No       | Style preset (e.g. `photographic`, `anime`) |

  ### erase

  Erase objects from an image using a mask.

  **Estimated cost:** \$0.058

  | Parameter | Type   | Required | Description          |
  | --------- | ------ | -------- | -------------------- |
  | `image`   | string | Yes      | Base64-encoded image |
  | `mask`    | string | Yes      | Base64-encoded mask  |

  ### remove-background

  Remove the background from an image.

  **Estimated cost:** \$0.058

  | Parameter       | Type   | Required | Description          |
  | --------------- | ------ | -------- | -------------------- |
  | `image`         | string | Yes      | Base64-encoded image |
  | `output_format` | string | No       | `png` or `webp`      |

  ### text-to-audio

  Generate audio from a text description.

  **Estimated cost:** \$0.23

  | Parameter  | Type   | Required | Description                   |
  | ---------- | ------ | -------- | ----------------------------- |
  | `prompt`   | string | Yes      | Text description of the audio |
  | `duration` | number | No       | Duration in seconds           |

***

## Suno

AI music generation — create songs, instrumentals, and lyrics.

**Available on [MPP](/wrapped-apis/mpp)**

### Suno Docs (https://suno.com)

  Full upstream API documentation

| Endpoint            | Est. Cost | Description                           |
| ------------------- | --------- | ------------------------------------- |
| `generate-music`    | \$0.10    | Generate a song or instrumental track |
| `get-music-status`  | Fee only  | Check music generation status         |
| `generate-lyrics`   | \$0.02    | Generate song lyrics from a prompt    |
| `get-lyrics-status` | Fee only  | Check lyrics generation status        |
| `get-credits`       | Fee only  | Check remaining Suno credits          |

  ### generate-music

  Generate a song or instrumental track.

  **Estimated cost:** \$0.10

  | Parameter      | Type    | Required | Description                                     |
  | -------------- | ------- | -------- | ----------------------------------------------- |
  | `customMode`   | boolean | Yes      | Enable custom mode for detailed control         |
  | `instrumental` | boolean | Yes      | Whether to generate an instrumental (no vocals) |
  | `model`        | string  | Yes      | Model version to use                            |
  | `prompt`       | string  | No       | Text prompt describing the music                |
  | `style`        | string  | No       | Music style/genre                               |
  | `title`        | string  | No       | Song title                                      |

  ### get-music-status

  Check the status of a music generation job.

  **Estimated cost:** Fee only

  | Parameter | Type   | Required | Description              |
  | --------- | ------ | -------- | ------------------------ |
  | `taskId`  | string | Yes      | Music generation task ID |

  ### generate-lyrics

  Generate song lyrics from a text prompt.

  **Estimated cost:** \$0.02

  | Parameter | Type   | Required | Description                   |
  | --------- | ------ | -------- | ----------------------------- |
  | `prompt`  | string | Yes      | Description of desired lyrics |

  ### get-lyrics-status

  Check the status of a lyrics generation job.

  **Estimated cost:** Fee only

  | Parameter | Type   | Required | Description               |
  | --------- | ------ | -------- | ------------------------- |
  | `taskId`  | string | Yes      | Lyrics generation task ID |

  ### get-credits

  Check remaining Suno credits.

  **Estimated cost:** Fee only

  *No parameters required.*

***

## Mathpix

Math and document OCR — extract LaTeX, text, and structured data from images.

**Available on [MPP](/wrapped-apis/mpp)**

### Mathpix Docs (https://docs.mathpix.com)

  Full upstream API documentation

| Endpoint          | Est. Cost | Description                                  |
| ----------------- | --------- | -------------------------------------------- |
| `process-image`   | \$0.005   | Extract math, text, and tables from an image |
| `process-strokes` | \$0.013   | Convert handwriting strokes to LaTeX         |

  ### process-image

  Extract math, text, and tables from an image.

  **Estimated cost:** \$0.005

  | Parameter | Type      | Required | Description                              |
  | --------- | --------- | -------- | ---------------------------------------- |
  | `src`     | string    | Yes      | Image URL or base64-encoded image        |
  | `formats` | string\[] | No       | Output formats (`latex`, `text`, `data`) |

  ### process-strokes

  Convert handwriting strokes to LaTeX.

  **Estimated cost:** \$0.013

  | Parameter | Type      | Required | Description             |
  | --------- | --------- | -------- | ----------------------- |
  | `strokes` | object    | Yes      | Handwriting stroke data |
  | `formats` | string\[] | No       | Output formats          |

***

## Deepgram

Speech AI — transcription, text-to-speech, and audio analysis.

**Available on [MPP](/wrapped-apis/mpp)**

### Deepgram Docs (https://developers.deepgram.com)

  Full upstream API documentation

| Endpoint      | Est. Cost | Description                                    |
| ------------- | --------- | ---------------------------------------------- |
| `transcribe`  | \$0.05    | Transcribe audio from a URL                    |
| `tts`         | \$0.02    | Convert text to speech                         |
| `analyze`     | \$0.01    | Analyze text for sentiment, intent, and topics |
| `list-models` | \$0.001   | List available Deepgram models                 |

  ### transcribe

  Transcribe audio from a URL.

  **Estimated cost:** \$0.05

  | Parameter   | Type    | Required | Description               |
  | ----------- | ------- | -------- | ------------------------- |
  | `url`       | string  | Yes      | URL of the audio file     |
  | `model`     | string  | No       | Transcription model       |
  | `language`  | string  | No       | Language code (e.g. `en`) |
  | `punctuate` | boolean | No       | Add punctuation           |
  | `diarize`   | boolean | No       | Speaker diarization       |

  ### tts

  Convert text to speech.

  **Estimated cost:** \$0.02

  | Parameter | Type   | Required | Description     |
  | --------- | ------ | -------- | --------------- |
  | `text`    | string | Yes      | Text to convert |
  | `model`   | string | No       | Voice model     |

  ### analyze

  Analyze text for sentiment, intent, and topics.

  **Estimated cost:** \$0.01

  | Parameter  | Type   | Required | Description     |
  | ---------- | ------ | -------- | --------------- |
  | `text`     | string | Yes      | Text to analyze |
  | `language` | string | No       | Language code   |

  ### list-models

  List available Deepgram models.

  **Estimated cost:** \$0.001

  *No parameters required.*

***

## Alpha Vantage

Financial market data — stocks, forex, crypto, commodities, fundamentals, and technical indicators.

**Available on [MPP](/wrapped-apis/mpp)**

### Alpha Vantage Docs (https://www.alphavantage.co/documentation)

  Full upstream API documentation

All Alpha Vantage endpoints cost **\$0.008** per call.

| Endpoint                | Description                                          |
| ----------------------- | ---------------------------------------------------- |
| `time-series-intraday`  | Intraday stock prices (1min–60min intervals)         |
| `time-series-daily`     | Daily stock prices                                   |
| `time-series-weekly`    | Weekly stock prices                                  |
| `time-series-monthly`   | Monthly stock prices                                 |
| `global-quote`          | Real-time stock quote                                |
| `symbol-search`         | Search for stock symbols                             |
| `company-overview`      | Company fundamentals (sector, market cap, P/E, etc.) |
| `income-statement`      | Quarterly/annual income statements                   |
| `balance-sheet`         | Quarterly/annual balance sheets                      |
| `cash-flow`             | Quarterly/annual cash flow statements                |
| `earnings`              | Quarterly/annual earnings data                       |
| `forex-exchange-rates`  | Real-time forex rate                                 |
| `crypto-daily`          | Daily crypto prices                                  |
| `commodity-wti`         | WTI crude oil prices                                 |
| `commodity-natural-gas` | Natural gas prices                                   |
| `news-sentiment`        | News articles with sentiment scores                  |

  Alpha Vantage has 30+ endpoints covering time series, fundamentals, forex, crypto, commodities, technical indicators, and news. All are \$0.008/call. See their docs for the full list.

  ### global-quote

  Get a real-time stock quote.

  **Estimated cost:** \$0.008

  | Parameter | Type   | Required | Description                       |
  | --------- | ------ | -------- | --------------------------------- |
  | `symbol`  | string | Yes      | Stock ticker symbol (e.g. `AAPL`) |

  ### time-series-daily

  Get daily stock prices.

  **Estimated cost:** \$0.008

  | Parameter    | Type   | Required | Description                                |
  | ------------ | ------ | -------- | ------------------------------------------ |
  | `symbol`     | string | Yes      | Stock ticker symbol                        |
  | `outputsize` | string | No       | `compact` (100 days) or `full` (20+ years) |

  ### company-overview

  Get company fundamentals.

  **Estimated cost:** \$0.008

  | Parameter | Type   | Required | Description         |
  | --------- | ------ | -------- | ------------------- |
  | `symbol`  | string | Yes      | Stock ticker symbol |

  ### news-sentiment

  Get news articles with sentiment scores for a topic or ticker.

  **Estimated cost:** \$0.008

  | Parameter | Type   | Required | Description                          |
  | --------- | ------ | -------- | ------------------------------------ |
  | `tickers` | string | No       | Comma-separated ticker symbols       |
  | `topics`  | string | No       | Topics to filter by                  |
  | `sort`    | string | No       | `LATEST`, `EARLIEST`, or `RELEVANCE` |

  ### forex-exchange-rates

  Get real-time forex exchange rate.

  **Estimated cost:** \$0.008

  | Parameter       | Type   | Required | Description          |
  | --------------- | ------ | -------- | -------------------- |
  | `from_currency` | string | Yes      | Source currency code |
  | `to_currency`   | string | Yes      | Target currency code |

***

## SEC EDGAR

SEC filing data — company submissions, financial facts, and full-text filing search.

**Available on [MPP](/wrapped-apis/mpp)**

### SEC EDGAR Docs (https://www.sec.gov/edgar)

  Full upstream API documentation

| Endpoint              | Est. Cost | Description                                     |
| --------------------- | --------- | ----------------------------------------------- |
| `company-submissions` | \$0.005   | Get filing history for a company                |
| `company-facts`       | \$0.005   | Get all XBRL financial facts for a company      |
| `company-concept`     | \$0.005   | Get a specific financial concept across filings |
| `search-filings`      | \$0.005   | Full-text search across all SEC filings         |

  ### company-submissions

  Get filing history for a company by CIK number.

  **Estimated cost:** \$0.005

  | Parameter | Type   | Required | Description                               |
  | --------- | ------ | -------- | ----------------------------------------- |
  | `cik`     | string | Yes      | Central Index Key (10-digit, zero-padded) |

  ### company-facts

  Get all XBRL financial facts for a company.

  **Estimated cost:** \$0.005

  | Parameter | Type   | Required | Description       |
  | --------- | ------ | -------- | ----------------- |
  | `cik`     | string | Yes      | Central Index Key |

  ### company-concept

  Get a specific financial concept (e.g. revenue) across all filings.

  **Estimated cost:** \$0.005

  | Parameter  | Type   | Required | Description                  |
  | ---------- | ------ | -------- | ---------------------------- |
  | `cik`      | string | Yes      | Central Index Key            |
  | `taxonomy` | string | Yes      | Taxonomy (e.g. `us-gaap`)    |
  | `tag`      | string | Yes      | Concept tag (e.g. `Revenue`) |

  ### search-filings

  Full-text search across all SEC filings.

  **Estimated cost:** \$0.005

  | Parameter   | Type   | Required | Description                                |
  | ----------- | ------ | -------- | ------------------------------------------ |
  | `q`         | string | Yes      | Search query                               |
  | `dateRange` | string | No       | Date range filter                          |
  | `forms`     | string | No       | Form types to filter (e.g. `10-K`, `10-Q`) |

***

## RentCast

US real estate data — property records, valuations, rent estimates, listings, and market stats.

**Available on [MPP](/wrapped-apis/mpp)**

### RentCast Docs (https://developers.rentcast.io)

  Full upstream API documentation

All RentCast endpoints cost **\$0.033** per call.

| Endpoint            | Description                                     |
| ------------------- | ----------------------------------------------- |
| `property-records`  | Look up property records by address or location |
| `property-by-id`    | Get a property by its RentCast ID               |
| `value-estimate`    | Get an estimated property value                 |
| `rent-estimate`     | Get an estimated rent price                     |
| `sale-listings`     | Search active for-sale listings                 |
| `rental-listings`   | Search active rental listings                   |
| `market-statistics` | Get market stats for a zip code                 |

  ### property-records

  Look up property records by address or location.

  **Estimated cost:** \$0.033

  | Parameter | Type   | Required | Description         |
  | --------- | ------ | -------- | ------------------- |
  | `address` | string | No\*     | Full street address |
  | `city`    | string | No\*     | City name           |
  | `state`   | string | No\*     | State abbreviation  |
  | `zipCode` | string | No\*     | Zip code            |

  \*At least one location parameter is required.

  ### value-estimate

  Get an estimated property value.

  **Estimated cost:** \$0.033

  | Parameter | Type   | Required | Description         |
  | --------- | ------ | -------- | ------------------- |
  | `address` | string | Yes      | Full street address |

  ### rent-estimate

  Get an estimated rent price.

  **Estimated cost:** \$0.033

  | Parameter      | Type   | Required | Description                                   |
  | -------------- | ------ | -------- | --------------------------------------------- |
  | `address`      | string | Yes      | Full street address                           |
  | `bedrooms`     | number | No       | Number of bedrooms                            |
  | `bathrooms`    | number | No       | Number of bathrooms                           |
  | `propertyType` | string | No       | Property type (e.g. `Single Family`, `Condo`) |

  ### market-statistics

  Get market statistics for a zip code.

  **Estimated cost:** \$0.033

  | Parameter      | Type   | Required | Description                  |
  | -------------- | ------ | -------- | ---------------------------- |
  | `zipCode`      | string | Yes      | Zip code                     |
  | `historyRange` | number | No       | Months of history to include |

***

## OpenWeather

Weather data — current conditions, forecasts, air quality, and geocoding.

**Available on [MPP](/wrapped-apis/mpp)**

### OpenWeather Docs (https://openweathermap.org/api)

  Full upstream API documentation

| Endpoint           | Est. Cost | Description                                |
| ------------------ | --------- | ------------------------------------------ |
| `current`          | \$0.003   | Current weather conditions                 |
| `forecast-5day`    | \$0.005   | 5-day / 3-hour forecast                    |
| `air-quality`      | \$0.003   | Air quality index and pollutant data       |
| `geocode`          | \$0.002   | Convert location name to coordinates       |
| `reverse-geocode`  | \$0.002   | Convert coordinates to location name       |
| `one-call`         | \$0.007   | All-in-one: current, hourly, daily, alerts |
| `weather-overview` | \$0.007   | AI-generated weather summary               |

  ### current

  Get current weather conditions.

  **Estimated cost:** \$0.003

  | Parameter | Type   | Required | Description                         |
  | --------- | ------ | -------- | ----------------------------------- |
  | `lat`     | number | Yes      | Latitude                            |
  | `lon`     | number | Yes      | Longitude                           |
  | `units`   | string | No       | `metric`, `imperial`, or `standard` |

  ### forecast-5day

  Get 5-day / 3-hour weather forecast.

  **Estimated cost:** \$0.005

  | Parameter | Type   | Required | Description                         |
  | --------- | ------ | -------- | ----------------------------------- |
  | `lat`     | number | Yes      | Latitude                            |
  | `lon`     | number | Yes      | Longitude                           |
  | `units`   | string | No       | `metric`, `imperial`, or `standard` |

  ### geocode

  Convert a location name to coordinates.

  **Estimated cost:** \$0.002

  | Parameter | Type   | Required | Description                       |
  | --------- | ------ | -------- | --------------------------------- |
  | `q`       | string | Yes      | Location query (e.g. `London,GB`) |
  | `limit`   | number | No       | Max results (default 5)           |

  ### one-call

  All-in-one weather: current, minutely, hourly, daily, and alerts.

  **Estimated cost:** \$0.007

  | Parameter | Type   | Required | Description                                                                          |
  | --------- | ------ | -------- | ------------------------------------------------------------------------------------ |
  | `lat`     | number | Yes      | Latitude                                                                             |
  | `lon`     | number | Yes      | Longitude                                                                            |
  | `exclude` | string | No       | Comma-separated parts to exclude: `current`, `minutely`, `hourly`, `daily`, `alerts` |

***

## Diffbot

Web data extraction — articles, products, discussions, knowledge graph, and NLP.

**Available on [MPP](/wrapped-apis/mpp)**

### Diffbot Docs (https://docs.diffbot.com)

  Full upstream API documentation

| Endpoint       | Est. Cost         | Description                                |
| -------------- | ----------------- | ------------------------------------------ |
| `article`      | \$0.004           | Extract article content from a URL         |
| `product`      | \$0.004           | Extract product data from a URL            |
| `discussion`   | \$0.004           | Extract discussion/forum threads           |
| `image`        | \$0.004           | Extract image data from a URL              |
| `video`        | \$0.004           | Extract video data from a URL              |
| `analyze`      | \$0.004           | Auto-detect page type and extract          |
| `analyze-text` | \$0.004/10K chars | NLP analysis (entities, sentiment, facts)  |
| `kg-search`    | \$0.03–\$1.50     | Search the Diffbot Knowledge Graph         |
| `kg-enhance`   | \$0.03            | Enrich an entity with Knowledge Graph data |

  ### article

  Extract article content from a URL.

  **Estimated cost:** \$0.004

  | Parameter | Type   | Required | Description                      |
  | --------- | ------ | -------- | -------------------------------- |
  | `url`     | string | Yes      | URL to extract from              |
  | `fields`  | string | No       | Comma-separated fields to return |

  ### product

  Extract product data from a URL.

  **Estimated cost:** \$0.004

  | Parameter | Type   | Required | Description         |
  | --------- | ------ | -------- | ------------------- |
  | `url`     | string | Yes      | URL to extract from |

  ### analyze

  Auto-detect page type and extract structured data.

  **Estimated cost:** \$0.004

  | Parameter | Type   | Required | Description    |
  | --------- | ------ | -------- | -------------- |
  | `url`     | string | Yes      | URL to analyze |

  ### analyze-text

  NLP analysis — extract entities, sentiment, and facts from text.

  **Estimated cost:** \$0.004/10K chars

  | Parameter | Type   | Required | Description     |
  | --------- | ------ | -------- | --------------- |
  | `content` | string | Yes      | Text to analyze |
  | `lang`    | string | No       | Language code   |

  ### kg-search

  Search the Diffbot Knowledge Graph (1T+ facts).

  **Estimated cost:** \$0.03–\$1.50

  | Parameter | Type   | Required | Description                          |
  | --------- | ------ | -------- | ------------------------------------ |
  | `query`   | string | Yes      | DQL query or natural language search |
  | `type`    | string | No       | Entity type filter                   |
  | `size`    | number | No       | Max results                          |

  ### kg-enhance

  Enrich an entity with Knowledge Graph data.

  **Estimated cost:** \$0.03

  | Parameter | Type   | Required | Description                                 |
  | --------- | ------ | -------- | ------------------------------------------- |
  | `type`    | string | Yes      | Entity type (e.g. `Organization`, `Person`) |
  | `name`    | string | No       | Entity name                                 |
  | `url`     | string | No       | Entity URL                                  |

***

## BuiltWith

Website technology profiling — detect tech stacks, find sites using specific technologies.

**Available on [MPP](/wrapped-apis/mpp)**

### BuiltWith Docs (https://api.builtwith.com)

  Full upstream API documentation

| Endpoint           | Est. Cost | Description                              |
| ------------------ | --------- | ---------------------------------------- |
| `domain-lookup`    | \$0.055   | Get full technology profile for a domain |
| `technology-lists` | \$0.055   | Find domains using a specific technology |
| `relationships`    | \$0.055   | Find related domains                     |
| `company-to-url`   | \$0.055   | Resolve company name to URL              |
| `product-search`   | \$0.055   | Search by product/technology name        |
| `recommendations`  | \$0.035   | Get technology recommendations           |
| `redirects`        | \$0.035   | Check domain redirects                   |
| `keywords`         | \$0.035   | Get keyword data for a domain            |
| `trends`           | \$0.035   | Technology usage trends                  |
| `trust`            | \$0.035   | Domain trust score                       |
| `free-summary`     | \$0.015   | Free technology summary                  |

  BuiltWith has 14+ endpoints. Lookup and list endpoints are \$0.055, analytics endpoints are \$0.035, and the free summary is \$0.015.

  ### domain-lookup

  Get the full technology profile for a domain.

  **Estimated cost:** \$0.055

  | Parameter | Type   | Required | Description                            |
  | --------- | ------ | -------- | -------------------------------------- |
  | `LOOKUP`  | string | Yes      | Domain to look up (e.g. `example.com`) |

  ### technology-lists

  Find domains using a specific technology.

  **Estimated cost:** \$0.055

  | Parameter | Type   | Required | Description                               |
  | --------- | ------ | -------- | ----------------------------------------- |
  | `TECH`    | string | Yes      | Technology name (e.g. `Shopify`, `React`) |

  ### trends

  Get technology usage trends.

  **Estimated cost:** \$0.035

  | Parameter | Type   | Required | Description     |
  | --------- | ------ | -------- | --------------- |
  | `TECH`    | string | No       | Technology name |

  ### free-summary

  Get a free technology summary for a domain.

  **Estimated cost:** \$0.015

  | Parameter | Type   | Required | Description       |
  | --------- | ------ | -------- | ----------------- |
  | `LOOKUP`  | string | Yes      | Domain to look up |

***

## Hunter

Email finding, verification, and enrichment for outreach and lead generation.

**Available on [MPP](/wrapped-apis/mpp)**

### Hunter Docs (https://hunter.io/api-documentation)

  Full upstream API documentation

| Endpoint              | Est. Cost       | Description                           |
| --------------------- | --------------- | ------------------------------------- |
| `domain-search`       | \$0.013–\$0.103 | Find email addresses for a domain     |
| `discover-companies`  | \$0.008         | Discover companies matching criteria  |
| `email-finder`        | \$0.013         | Find a specific person's email        |
| `email-verifier`      | \$0.008         | Verify an email address               |
| `email-enrichment`    | \$0.013         | Enrich data from an email address     |
| `company-enrichment`  | \$0.013         | Enrich data from a domain             |
| `combined-enrichment` | \$0.023         | Get both email and company enrichment |
| `email-count`         | \$0.003         | Count emails available for a domain   |

  ### domain-search

  Find email addresses associated with a domain.

  **Estimated cost:** \$0.013–\$0.103

  | Parameter    | Type   | Required | Description                          |
  | ------------ | ------ | -------- | ------------------------------------ |
  | `domain`     | string | Yes      | Domain to search (e.g. `stripe.com`) |
  | `limit`      | number | No       | Max results                          |
  | `department` | string | No       | Filter by department                 |

  ### email-finder

  Find a specific person's email address.

  **Estimated cost:** \$0.013

  | Parameter    | Type   | Required | Description    |
  | ------------ | ------ | -------- | -------------- |
  | `domain`     | string | Yes      | Company domain |
  | `first_name` | string | No\*     | First name     |
  | `last_name`  | string | No\*     | Last name      |
  | `full_name`  | string | No\*     | Full name      |

  \*Provide `full_name` or both `first_name` and `last_name`.

  ### email-verifier

  Verify an email address.

  **Estimated cost:** \$0.008

  | Parameter | Type   | Required | Description             |
  | --------- | ------ | -------- | ----------------------- |
  | `email`   | string | Yes      | Email address to verify |

  ### combined-enrichment

  Get both email and company enrichment in one call.

  **Estimated cost:** \$0.023

  | Parameter | Type   | Required | Description             |
  | --------- | ------ | -------- | ----------------------- |
  | `email`   | string | Yes      | Email address to enrich |

***

## IPinfo

IP address intelligence — geolocation, ASN, company, and privacy detection.

**Available on [MPP](/wrapped-apis/mpp)**

### IPinfo Docs (https://ipinfo.io/developers)

  Full upstream API documentation

| Endpoint    | Est. Cost | Description                                       |
| ----------- | --------- | ------------------------------------------------- |
| `ip-lite`   | \$0.001   | Basic IP geolocation (city, region, country)      |
| `ip-lookup` | \$0.001   | Full IP intelligence (geo, ASN, company, privacy) |

  ### ip-lite

  Basic IP geolocation data.

  **Estimated cost:** \$0.001

  | Parameter | Type   | Required | Description           |
  | --------- | ------ | -------- | --------------------- |
  | `ip`      | string | Yes      | IP address to look up |

  ### ip-lookup

  Full IP intelligence including geolocation, ASN, company, and privacy detection.

  **Estimated cost:** \$0.001

  | Parameter | Type   | Required | Description           |
  | --------- | ------ | -------- | --------------------- |
  | `ip`      | string | Yes      | IP address to look up |

***

## Whitepages Pro

People search, identity verification, and property data.

### Whitepages Pro Docs (https://pro.whitepages.com/developer)

  Full upstream API documentation

| Endpoint             | Est. Cost | Description                                    |
| -------------------- | --------- | ---------------------------------------------- |
| `person-search`      | \$0.015   | Search for a person by name, phone, or address |
| `person-by-id`       | \$0.015   | Get person details by ID                       |
| `property-search`    | \$0.015   | Search for property records                    |
| `property-by-id`     | \$0.015   | Get property details by ID                     |
| `search-deed-events` | \$0.015   | Search deed transfer events                    |
| `get-event`          | \$0.015   | Get details of a deed event                    |
| `list-states`        | \$0.005   | List available US states                       |
| `list-counties`      | \$0.005   | List counties in a state                       |

  ### person-search

  Search for a person by name, phone, or address.

  **Estimated cost:** \$0.015

  | Parameter | Type   | Required | Description        |
  | --------- | ------ | -------- | ------------------ |
  | `name`    | string | No\*     | Person's name      |
  | `phone`   | string | No\*     | Phone number       |
  | `street`  | string | No\*     | Street address     |
  | `city`    | string | No       | City               |
  | `state`   | string | No       | State abbreviation |

  \*At least one of `name`, `phone`, or `street` is required.

  ### property-search

  Search for property records.

  **Estimated cost:** \$0.015

  | Parameter | Type   | Required | Description        |
  | --------- | ------ | -------- | ------------------ |
  | `street`  | string | No\*     | Street address     |
  | `city`    | string | No\*     | City name          |
  | `state`   | string | No       | State abbreviation |
  | `zip`     | string | No       | Zip code           |

  \*At least one of `street` or `city` is required.

  ### search-deed-events

  Search deed transfer events in a region.

  **Estimated cost:** \$0.015

  | Parameter    | Type   | Required | Description       |
  | ------------ | ------ | -------- | ----------------- |
  | `region`     | string | Yes      | Region identifier |
  | `start_date` | string | No       | Start date filter |
  | `end_date`   | string | No       | End date filter   |

  ### list-counties

  List counties in a state.

  **Estimated cost:** \$0.005

  | Parameter    | Type   | Required | Description           |
  | ------------ | ------ | -------- | --------------------- |
  | `state_code` | string | Yes      | Two-letter state code |

***

## OFAC

Sanctions screening — check persons and entities against the US OFAC sanctions list.

**Available on [MPP](/wrapped-apis/mpp)**

### OFAC Docs (https://ofac.treasury.gov)

  Full upstream API documentation

| Endpoint              | Est. Cost    | Description                                      |
| --------------------- | ------------ | ------------------------------------------------ |
| `sanctions-screening` | \$0.012/case | Screen persons or entities against OFAC SDN list |
| `sanctions-search`    | \$0.012/case | Search the OFAC sanctions database               |

  ### sanctions-screening

  Screen persons or entities against the OFAC SDN list.

  **Estimated cost:** \$0.012/case

  | Parameter  | Type   | Required | Description                                             |
  | ---------- | ------ | -------- | ------------------------------------------------------- |
  | `cases`    | array  | Yes      | Array of screening cases (name, address, country, etc.) |
  | `minScore` | number | No       | Minimum match score threshold                           |

  ### sanctions-search

  Search the OFAC sanctions database.

  **Estimated cost:** \$0.012/case

  | Parameter | Type      | Required | Description               |
  | --------- | --------- | -------- | ------------------------- |
  | `cases`   | array     | Yes      | Array of search cases     |
  | `sources` | string\[] | No       | Sanctions lists to search |

***

## Judge0

Code execution sandbox — run code in 60+ languages securely.

**Available on [MPP](/wrapped-apis/mpp)**

### Judge0 Docs (https://judge0.com)

  Full upstream API documentation

| Endpoint         | Est. Cost | Description                          |
| ---------------- | --------- | ------------------------------------ |
| `execute-code`   | \$0.006   | Execute code synchronously           |
| `submit-code`    | \$0.006   | Submit code for async execution      |
| `get-submission` | Fee only  | Get the result of a submission       |
| `list-languages` | Fee only  | List supported programming languages |
| `list-statuses`  | Fee only  | List possible submission statuses    |

  ### execute-code

  Execute code synchronously and return the result.

  **Estimated cost:** \$0.006

  ```bash
  curl -X POST https://api.paywithlocus.com/api/wrapped/judge0/execute-code \
    -H "Authorization: Bearer YOUR_LOCUS_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
      "source_code": "print(\"Hello, World!\")",
      "language_id": 71
    }'
  ```

  | Parameter         | Type   | Required | Description                        |
  | ----------------- | ------ | -------- | ---------------------------------- |
  | `source_code`     | string | Yes      | Code to execute                    |
  | `language_id`     | number | Yes      | Language ID (e.g. 71 for Python 3) |
  | `stdin`           | string | No       | Standard input                     |
  | `expected_output` | string | No       | Expected output for validation     |
  | `cpu_time_limit`  | number | No       | CPU time limit in seconds          |
  | `memory_limit`    | number | No       | Memory limit in KB                 |

  ### submit-code

  Submit code for asynchronous execution.

  **Estimated cost:** \$0.006

  | Parameter     | Type   | Required | Description     |
  | ------------- | ------ | -------- | --------------- |
  | `source_code` | string | Yes      | Code to execute |
  | `language_id` | number | Yes      | Language ID     |
  | `stdin`       | string | No       | Standard input  |

  ### get-submission

  Get the result of an async submission.

  **Estimated cost:** Fee only

  | Parameter | Type   | Required | Description      |
  | --------- | ------ | -------- | ---------------- |
  | `token`   | string | Yes      | Submission token |

  ### list-languages

  List all supported programming languages.

  **Estimated cost:** Fee only

  *No parameters required.*

  ### list-statuses

  List possible submission statuses.

  **Estimated cost:** Fee only

  *No parameters required.*

***

## Mapbox

Maps, geocoding, directions, and spatial analysis.

**Available on [MPP](/wrapped-apis/mpp)**

### Mapbox Docs (https://docs.mapbox.com)

  Full upstream API documentation

| Endpoint          | Est. Cost       | Description                                |
| ----------------- | --------------- | ------------------------------------------ |
| `forward-geocode` | \$0.004         | Convert address/place name to coordinates  |
| `reverse-geocode` | \$0.004         | Convert coordinates to address/place name  |
| `directions`      | \$0.005         | Get turn-by-turn directions between points |
| `matrix`          | \$0.002/element | Calculate travel time/distance matrix      |
| `isochrone`       | \$0.005         | Get reachable area from a point            |
| `map-matching`    | \$0.005         | Snap GPS traces to roads                   |
| `static-image`    | \$0.004         | Generate a static map image                |
| `tilequery`       | \$0.005         | Query map features at a location           |

  ### forward-geocode

  Convert an address or place name to coordinates.

  **Estimated cost:** \$0.004

  | Parameter  | Type   | Required | Description                      |
  | ---------- | ------ | -------- | -------------------------------- |
  | `q`        | string | Yes      | Address or place name to geocode |
  | `limit`    | number | No       | Max results                      |
  | `country`  | string | No       | Country code filter              |
  | `language` | string | No       | Language for results             |

  ### reverse-geocode

  Convert coordinates to an address or place name.

  **Estimated cost:** \$0.004

  | Parameter   | Type   | Required | Description          |
  | ----------- | ------ | -------- | -------------------- |
  | `longitude` | number | Yes      | Longitude            |
  | `latitude`  | number | Yes      | Latitude             |
  | `language`  | string | No       | Language for results |

  ### directions

  Get turn-by-turn directions between points.

  **Estimated cost:** \$0.005

  | Parameter      | Type    | Required | Description                                                             |
  | -------------- | ------- | -------- | ----------------------------------------------------------------------- |
  | `profile`      | string  | Yes      | Routing profile (`driving`, `walking`, `cycling`, `driving-traffic`)    |
  | `coordinates`  | string  | Yes      | Semicolon-separated coordinate pairs (e.g. `-73.99,40.73;-74.00,40.74`) |
  | `alternatives` | boolean | No       | Return alternative routes                                               |
  | `steps`        | boolean | No       | Include turn-by-turn steps                                              |

  ### isochrone

  Get the reachable area from a point within a time or distance limit.

  **Estimated cost:** \$0.005

  | Parameter          | Type      | Required | Description                 |
  | ------------------ | --------- | -------- | --------------------------- |
  | `profile`          | string    | Yes      | Routing profile             |
  | `coordinates`      | string    | Yes      | Center point coordinates    |
  | `contours_minutes` | number\[] | No       | Time contours in minutes    |
  | `contours_meters`  | number\[] | No       | Distance contours in meters |

  ### tilequery

  Query map features at a specific location.

  **Estimated cost:** \$0.005

  | Parameter    | Type   | Required | Description             |
  | ------------ | ------ | -------- | ----------------------- |
  | `tileset_id` | string | Yes      | Tileset ID to query     |
  | `longitude`  | number | Yes      | Longitude               |
  | `latitude`   | number | Yes      | Latitude                |
  | `radius`     | number | No       | Search radius in meters |

***

## Brave Search

Independent web search — web, news, images, videos, AI answers, and LLM context.

**Available on [MPP](/wrapped-apis/mpp)**

### Brave Search API Docs (https://brave.com/search/api)

  Full upstream API documentation

| Endpoint       | Est. Cost | Description                                    |
| -------------- | --------- | ---------------------------------------------- |
| `web-search`   | \$0.035   | Web search from Brave's independent index      |
| `news-search`  | \$0.035   | News content search                            |
| `image-search` | \$0.035   | Image search                                   |
| `video-search` | \$0.035   | Video search                                   |
| `llm-context`  | \$0.035   | Pre-extracted web content for AI/RAG           |
| `answers`      | \$0.085   | AI-generated answers with web search grounding |

  ### web-search

  Web search from Brave's independent index.

  **Estimated cost:** \$0.035

  | Parameter | Type   | Required | Description  |
  | --------- | ------ | -------- | ------------ |
  | `q`       | string | Yes      | Search query |

  ### news-search

  News content search.

  **Estimated cost:** \$0.035

  | Parameter | Type   | Required | Description  |
  | --------- | ------ | -------- | ------------ |
  | `q`       | string | Yes      | Search query |

  ### image-search

  Image search.

  **Estimated cost:** \$0.035

  | Parameter | Type   | Required | Description  |
  | --------- | ------ | -------- | ------------ |
  | `q`       | string | Yes      | Search query |

  ### video-search

  Video search.

  **Estimated cost:** \$0.035

  | Parameter | Type   | Required | Description  |
  | --------- | ------ | -------- | ------------ |
  | `q`       | string | Yes      | Search query |

  ### llm-context

  Pre-extracted web content optimized for AI/RAG pipelines.

  **Estimated cost:** \$0.035

  | Parameter | Type   | Required | Description  |
  | --------- | ------ | -------- | ------------ |
  | `q`       | string | Yes      | Search query |

  ### answers

  AI-generated answers grounded in web search results.

  **Estimated cost:** \$0.085

  | Parameter  | Type  | Required | Description                             |
  | ---------- | ----- | -------- | --------------------------------------- |
  | `messages` | array | Yes      | Conversation messages for the AI answer |

***

## CoinGecko

Cryptocurrency market data — prices, charts, market cap, exchanges, trending, and global stats.

**Available on [MPP](/wrapped-apis/mpp)**

### CoinGecko Docs (https://www.coingecko.com/en/api/documentation)

  Full upstream API documentation

| Endpoint             | Est. Cost | Description                                         |
| -------------------- | --------- | --------------------------------------------------- |
| `simple-price`       | \$0.06    | Get price for one or more coins in given currencies |
| `coins-markets`      | \$0.06    | List coins with market data (price, cap, volume)    |
| `coin-data`          | \$0.06    | Get full data for a specific coin                   |
| `search`             | \$0.06    | Search coins, categories, and exchanges             |
| `trending`           | \$0.06    | Trending coins, NFTs, and categories                |
| `global`             | \$0.06    | Global crypto market stats                          |
| `market-chart`       | \$0.06    | Historical market chart data for a coin             |
| `exchanges`          | \$0.06    | List exchanges with volume data                     |
| `categories`         | \$0.06    | List coin categories with market data               |
| `top-gainers-losers` | \$0.06    | Top gaining and losing coins                        |

  ### simple-price

  Get current price for one or more coins in given currencies.

  **Estimated cost:** \$0.06

  | Parameter       | Type   | Required | Description                                        |
  | --------------- | ------ | -------- | -------------------------------------------------- |
  | `ids`           | string | Yes      | Comma-separated coin IDs (e.g. `bitcoin,ethereum`) |
  | `vs_currencies` | string | Yes      | Comma-separated target currencies (e.g. `usd,eur`) |

  ### coins-markets

  List coins with market data including price, market cap, and volume.

  **Estimated cost:** \$0.06

  | Parameter     | Type   | Required | Description                  |
  | ------------- | ------ | -------- | ---------------------------- |
  | `vs_currency` | string | Yes      | Target currency (e.g. `usd`) |

  ### coin-data

  Get comprehensive data for a specific coin.

  **Estimated cost:** \$0.06

  | Parameter | Type   | Required | Description              |
  | --------- | ------ | -------- | ------------------------ |
  | `id`      | string | Yes      | Coin ID (e.g. `bitcoin`) |

  ### search

  Search for coins, categories, and exchanges.

  **Estimated cost:** \$0.06

  | Parameter | Type   | Required | Description  |
  | --------- | ------ | -------- | ------------ |
  | `query`   | string | Yes      | Search query |

  ### trending

  Get trending coins, NFTs, and categories.

  **Estimated cost:** \$0.06

  *No parameters required.*

  ### global

  Get global cryptocurrency market stats.

  **Estimated cost:** \$0.06

  *No parameters required.*

  ### market-chart

  Get historical market chart data for a coin.

  **Estimated cost:** \$0.06

  | Parameter     | Type   | Required | Description                                           |
  | ------------- | ------ | -------- | ----------------------------------------------------- |
  | `id`          | string | Yes      | Coin ID (e.g. `bitcoin`)                              |
  | `vs_currency` | string | Yes      | Target currency (e.g. `usd`)                          |
  | `days`        | string | Yes      | Data up to number of days ago (e.g. `7`, `30`, `max`) |

  ### exchanges

  List exchanges with trading volume data.

  **Estimated cost:** \$0.06

  *No parameters required.*

  ### categories

  List coin categories with market data.

  **Estimated cost:** \$0.06

  *No parameters required.*

  ### top-gainers-losers

  Get top gaining and losing coins.

  **Estimated cost:** \$0.06

  *No parameters required.*

***

## DeepL

Professional translation — translate text between 30+ languages or improve text with DeepL Write.

**Available on [MPP](/wrapped-apis/mpp)**

### DeepL Docs (https://developers.deepl.com/docs)

  Full upstream API documentation

| Endpoint    | Est. Cost                   | Description                            |
| ----------- | --------------------------- | -------------------------------------- |
| `translate` | \$0.025+ (scales with text) | Neural machine translation             |
| `rephrase`  | \$0.025+ (scales with text) | Improve/rephrase text with DeepL Write |
| `languages` | Fee only                    | List supported languages               |

  ### translate

  Neural machine translation between 30+ languages.

  **Estimated cost:** \$0.025+ (scales with text length)

  | Parameter     | Type   | Required | Description                                  |
  | ------------- | ------ | -------- | -------------------------------------------- |
  | `text`        | string | Yes      | Text to translate                            |
  | `target_lang` | string | Yes      | Target language code (e.g. `DE`, `FR`, `ES`) |

  ### rephrase

  Improve or rephrase text using DeepL Write.

  **Estimated cost:** \$0.025+ (scales with text length)

  | Parameter     | Type   | Required | Description          |
  | ------------- | ------ | -------- | -------------------- |
  | `text`        | string | Yes      | Text to rephrase     |
  | `target_lang` | string | Yes      | Target language code |

  ### languages

  List all supported languages.

  **Estimated cost:** Fee only

  *No parameters required.*

***

## Groq

Ultra-fast LLM inference — Llama, DeepSeek R1, Gemma, Qwen, Whisper, and more. OpenAI-compatible.

**Available on [MPP](/wrapped-apis/mpp)**

### Groq Docs (https://console.groq.com/docs)

  Full upstream API documentation

| Endpoint | Est. Cost                        | Description                               |
| -------- | -------------------------------- | ----------------------------------------- |
| `chat`   | \$0.005–\$0.10 (model-dependent) | Chat completion with ultra-fast inference |
| `models` | Fee only                         | List available models                     |

  ### chat

  Chat completion with ultra-fast inference. OpenAI-compatible format.

  **Estimated cost:** \$0.005–\$0.10 (model-dependent)

  | Parameter  | Type   | Required | Description                                                                                |
  | ---------- | ------ | -------- | ------------------------------------------------------------------------------------------ |
  | `model`    | string | Yes      | Model ID (e.g. `llama-3.3-70b-versatile`, `deepseek-r1-distill-llama-70b`, `gemma2-9b-it`) |
  | `messages` | array  | Yes      | Conversation messages. Each: `{ role: "system"\|"user"\|"assistant", content: "text" }`    |

  ### models

  List available models.

  **Estimated cost:** Fee only

  *No parameters required.*

***

## Mistral AI

Premier and open-source LLMs — Mistral Large, Codestral, Magistral reasoning, Pixtral vision, and embeddings.

**Available on [MPP](/wrapped-apis/mpp)**

### Mistral Docs (https://docs.mistral.ai)

  Full upstream API documentation

| Endpoint   | Est. Cost                        | Description                                              |
| ---------- | -------------------------------- | -------------------------------------------------------- |
| `chat`     | \$0.005–\$0.10 (model-dependent) | Chat completion with function calling, vision, reasoning |
| `embed`    | \$0.008                          | Text/code embeddings (1024-dim)                          |
| `moderate` | \$0.008                          | Content moderation                                       |
| `models`   | Fee only                         | List available models                                    |

  ### chat

  Chat completion with function calling, vision, and reasoning support.

  **Estimated cost:** \$0.005–\$0.10 (model-dependent)

  | Parameter  | Type   | Required | Description                                                                                                   |
  | ---------- | ------ | -------- | ------------------------------------------------------------------------------------------------------------- |
  | `model`    | string | Yes      | Model ID (e.g. `mistral-large-latest`, `codestral-latest`, `magistral-medium-latest`, `pixtral-large-latest`) |
  | `messages` | array  | Yes      | Conversation messages. Each: `{ role: "system"\|"user"\|"assistant", content: "text" }`                       |

  ### embed

  Generate text or code embeddings.

  **Estimated cost:** \$0.008

  | Parameter | Type                | Required | Description                            |
  | --------- | ------------------- | -------- | -------------------------------------- |
  | `model`   | string              | Yes      | Embedding model (e.g. `mistral-embed`) |
  | `input`   | string \| string\[] | Yes      | Text to embed                          |

  ### moderate

  Content moderation.

  **Estimated cost:** \$0.008

  | Parameter | Type                | Required | Description      |
  | --------- | ------------------- | -------- | ---------------- |
  | `model`   | string              | Yes      | Moderation model |
  | `input`   | string \| string\[] | Yes      | Text to classify |

  ### models

  List available models.

  **Estimated cost:** Fee only

  *No parameters required.*

***

## ScreenshotOne

Website screenshot API — capture any URL as PNG, JPEG, WebP, or PDF with full-page, dark mode, and ad blocking.

**Available on [MPP](/wrapped-apis/mpp)**

### ScreenshotOne Docs (https://screenshotone.com/docs)

  Full upstream API documentation

| Endpoint | Est. Cost | Description                              |
| -------- | --------- | ---------------------------------------- |
| `take`   | \$0.055   | Capture screenshot of any URL or content |

  ### take

  Capture a screenshot of any URL, raw HTML, or Markdown content.

  **Estimated cost:** \$0.055

  | Parameter  | Type   | Required | Description                                                        |
  | ---------- | ------ | -------- | ------------------------------------------------------------------ |
  | `url`      | string | Yes\*    | URL to screenshot (\*one of `url`, `html`, or `markdown` required) |
  | `html`     | string | Yes\*    | Raw HTML to render and capture                                     |
  | `markdown` | string | Yes\*    | Markdown to render and capture                                     |

***

## Tavily

AI-optimized web search, content extraction, site mapping, and crawling.

**Available on [MPP](/wrapped-apis/mpp)**

### Tavily Docs (https://docs.tavily.com)

  Full upstream API documentation

| Endpoint  | Est. Cost     | Description                             |
| --------- | ------------- | --------------------------------------- |
| `search`  | \$0.09–\$0.16 | AI-optimized web search                 |
| `extract` | \$0.11+       | Extract clean content from URLs         |
| `map`     | \$0.09        | Discover all URLs on a website          |
| `crawl`   | \$0.21+       | Crawl and extract from discovered pages |

  ### search

  AI-optimized web search returning relevant results with extracted content.

  **Estimated cost:** \$0.09–\$0.16

  | Parameter | Type   | Required | Description  |
  | --------- | ------ | -------- | ------------ |
  | `query`   | string | Yes      | Search query |

  ### extract

  Extract clean, structured content from one or more URLs.

  **Estimated cost:** \$0.11+

  | Parameter | Type                | Required | Description                    |
  | --------- | ------------------- | -------- | ------------------------------ |
  | `urls`    | string \| string\[] | Yes      | URL(s) to extract content from |

  ### map

  Discover all URLs on a website.

  **Estimated cost:** \$0.09

  | Parameter | Type   | Required | Description        |
  | --------- | ------ | -------- | ------------------ |
  | `url`     | string | Yes      | Website URL to map |

  ### crawl

  Crawl a website and extract content from discovered pages.

  **Estimated cost:** \$0.21+

  | Parameter | Type   | Required | Description           |
  | --------- | ------ | -------- | --------------------- |
  | `url`     | string | Yes      | Starting URL to crawl |

***

## VirusTotal

Threat intelligence — scan files, URLs, domains, and IPs against 70+ antivirus engines.

**Available on [MPP](/wrapped-apis/mpp)**

### VirusTotal Docs (https://docs.virustotal.com)

  Full upstream API documentation

| Endpoint        | Est. Cost | Description                            |
| --------------- | --------- | -------------------------------------- |
| `file-report`   | \$0.055   | Get analysis report for a file by hash |
| `url-report`    | \$0.055   | Get analysis report for a URL          |
| `domain-report` | \$0.055   | Get report for a domain                |
| `ip-report`     | \$0.055   | Get report for an IP address           |
| `url-scan`      | \$0.085   | Submit a URL for scanning              |
| `analysis`      | \$0.055   | Get status of a pending analysis       |
| `search`        | \$0.085   | Search across VirusTotal's dataset     |

  ### file-report

  Get the analysis report for a file by its hash.

  **Estimated cost:** \$0.055

  | Parameter | Type   | Required | Description                        |
  | --------- | ------ | -------- | ---------------------------------- |
  | `hash`    | string | Yes      | File hash (MD5, SHA-1, or SHA-256) |

  ### url-report

  Get the analysis report for a URL.

  **Estimated cost:** \$0.055

  | Parameter | Type   | Required | Description    |
  | --------- | ------ | -------- | -------------- |
  | `url`     | string | Yes      | URL to look up |

  ### domain-report

  Get the report for a domain.

  **Estimated cost:** \$0.055

  | Parameter | Type   | Required | Description            |
  | --------- | ------ | -------- | ---------------------- |
  | `domain`  | string | Yes      | Domain name to look up |

  ### ip-report

  Get the report for an IP address.

  **Estimated cost:** \$0.055

  | Parameter | Type   | Required | Description           |
  | --------- | ------ | -------- | --------------------- |
  | `ip`      | string | Yes      | IP address to look up |

  ### url-scan

  Submit a URL for scanning.

  **Estimated cost:** \$0.085

  | Parameter | Type   | Required | Description |
  | --------- | ------ | -------- | ----------- |
  | `url`     | string | Yes      | URL to scan |

  ### analysis

  Get the status and results of a pending analysis.

  **Estimated cost:** \$0.055

  | Parameter | Type   | Required | Description |
  | --------- | ------ | -------- | ----------- |
  | `id`      | string | Yes      | Analysis ID |

  ### search

  Search across VirusTotal's dataset.

  **Estimated cost:** \$0.085

  | Parameter | Type   | Required | Description                                  |
  | --------- | ------ | -------- | -------------------------------------------- |
  | `query`   | string | Yes      | Search query (VT Intelligence search syntax) |

***

## Wolfram|Alpha

Computational knowledge engine — math, science, geography, finance, and more.

**Available on [MPP](/wrapped-apis/mpp)**

### Wolfram|Alpha Docs (https://products.wolframalpha.com/api)

  Full upstream API documentation

| Endpoint       | Est. Cost | Description                           |
| -------------- | --------- | ------------------------------------- |
| `short-answer` | \$0.055   | Brief plain text answer               |
| `spoken`       | \$0.055   | Answer as full sentence for TTS       |
| `full-results` | \$0.055   | Comprehensive structured JSON results |
| `simple`       | \$0.055   | Full result page as image             |

  ### short-answer

  Get a brief plain text answer to a query.

  **Estimated cost:** \$0.055

  | Parameter | Type   | Required | Description                                |
  | --------- | ------ | -------- | ------------------------------------------ |
  | `i`       | string | Yes      | Query (e.g. `distance from Earth to Mars`) |

  ### spoken

  Get an answer as a full sentence, suitable for text-to-speech.

  **Estimated cost:** \$0.055

  | Parameter | Type   | Required | Description |
  | --------- | ------ | -------- | ----------- |
  | `i`       | string | Yes      | Query       |

  ### full-results

  Get comprehensive structured JSON results with multiple pods.

  **Estimated cost:** \$0.055

  | Parameter | Type   | Required | Description |
  | --------- | ------ | -------- | ----------- |
  | `input`   | string | Yes      | Query       |

  ### simple

  Get the full result page as an image.

  **Estimated cost:** \$0.055

  | Parameter | Type   | Required | Description |
  | --------- | ------ | -------- | ----------- |
  | `i`       | string | Yes      | Query       |

***

## Billboard

Post to @MPPBillboard on X. Price starts at \$0.01 and doubles with every post.

**Available on [MPP](/wrapped-apis/mpp)**

### @MPPBillboard on X (https://x.com/MPPBillboard)

  View the billboard

| Endpoint    | Est. Cost             | Description                                             |
| ----------- | --------------------- | ------------------------------------------------------- |
| `post`      | \$0.01+ (exponential) | Post a message (max 280 chars), price doubles each post |
| `get-price` | Free                  | Check the current post price                            |

  ### post

  Post a message to the @MPPBillboard account on X. Price doubles with every post.

  **Estimated cost:** \$0.01+ (exponential — doubles each post)

  | Parameter | Type   | Required | Description                          |
  | --------- | ------ | -------- | ------------------------------------ |
  | `text`    | string | Yes      | Message to post (max 280 characters) |

  ### get-price

  Check the current price for posting.

  **Estimated cost:** Free

  *No parameters required.*

---

# Machine Payments Protocol (MPP)

> Pay-per-request API access via HTTP 402 on Tempo chain

MPP lets your agent call Locus wrapped APIs and pay inline via HTTP 402 challenges on Tempo chain. No Locus account or pre-funded wallet needed — just a Tempo wallet with USDC.e.

## How it works

  
    Your agent sends a POST to the MPP endpoint with the same request body the upstream API expects.
  

  
    The server responds with payment details: price, recipient address, and token (USDC.e on Tempo).
  

  
    Your agent signs and submits the payment transaction on Tempo.
  

  
    The server verifies the on-chain payment and forwards the request to the upstream API.
  

  
    Your agent receives the upstream API response as normal.
  

## Supported providers

32 of 42 wrapped API providers support MPP. See the full [provider catalog](/wrapped-apis/providers) for details on each.

  ### AI / LLM

    DeepSeek, Grok, Groq, Mistral AI, Perplexity
  

  ### AI / Generative

    Replicate, Stability AI, Suno
  

  ### AI / Documents & Audio

    Mathpix, Deepgram
  

  ### Search & Web

    Brave Search, Tavily, ScreenshotOne
  

  ### Data / Finance

    Alpha Vantage, SEC EDGAR, CoinGecko
  

  ### Data / Real Estate

    RentCast
  

  ### Data / Weather

    OpenWeather
  

  ### Data / Intelligence

    Apollo, Diffbot, BuiltWith, Hunter, Clado, IPinfo
  

  ### Compliance & Security

    OFAC, VirusTotal
  

  ### Developer Tools

    Judge0
  

  ### Location

    Mapbox
  

  ### Translation

    DeepL
  

  ### Knowledge & Computation

    Wolfram|Alpha
  

  ### Other

    Abstract API, Billboard
  

## Endpoint reference files

Each MPP-enabled provider has a machine-readable endpoint file your agent can fetch for discovery. Point your agent at one of these to learn the available endpoints, parameters, and pricing:

| Provider       | Endpoint File                                        |
| -------------- | ---------------------------------------------------- |
| DeepSeek       | `https://paywithlocus.com/discover/deepseek.md`      |
| Grok           | `https://paywithlocus.com/discover/grok.md`          |
| Groq           | `https://paywithlocus.com/discover/groq.md`          |
| Mistral AI     | `https://paywithlocus.com/discover/mistral.md`       |
| Perplexity     | `https://paywithlocus.com/discover/perplexity.md`    |
| Replicate      | `https://paywithlocus.com/discover/replicate.md`     |
| Stability AI   | `https://paywithlocus.com/discover/stability-ai.md`  |
| Suno           | `https://paywithlocus.com/discover/suno.md`          |
| Mathpix        | `https://paywithlocus.com/discover/mathpix.md`       |
| Deepgram       | `https://paywithlocus.com/discover/deepgram.md`      |
| Brave Search   | `https://paywithlocus.com/discover/brave.md`         |
| Tavily         | `https://paywithlocus.com/discover/tavily.md`        |
| ScreenshotOne  | `https://paywithlocus.com/discover/screenshotone.md` |
| Alpha Vantage  | `https://paywithlocus.com/discover/alphavantage.md`  |
| SEC EDGAR      | `https://paywithlocus.com/discover/edgar.md`         |
| CoinGecko      | `https://paywithlocus.com/discover/coingecko.md`     |
| RentCast       | `https://paywithlocus.com/discover/rentcast.md`      |
| OpenWeather    | `https://paywithlocus.com/discover/openweather.md`   |
| Apollo         | `https://paywithlocus.com/discover/apollo.md`        |
| Diffbot        | `https://paywithlocus.com/discover/diffbot.md`       |
| BuiltWith      | `https://paywithlocus.com/discover/builtwith.md`     |
| Hunter         | `https://paywithlocus.com/discover/hunter.md`        |
| Clado          | `https://paywithlocus.com/discover/clado.md`         |
| IPinfo         | `https://paywithlocus.com/discover/ipinfo.md`        |
| OFAC           | `https://paywithlocus.com/discover/ofac.md`          |
| VirusTotal     | `https://paywithlocus.com/discover/virustotal.md`    |
| Judge0         | `https://paywithlocus.com/discover/judge0.md`        |
| Mapbox         | `https://paywithlocus.com/discover/mapbox.md`        |
| DeepL          | `https://paywithlocus.com/discover/deepl.md`         |
| Wolfram\|Alpha | `https://paywithlocus.com/discover/wolframalpha.md`  |
| Billboard      | `https://paywithlocus.com/discover/billboard.md`     |
| Abstract API   | `https://paywithlocus.com/discover/abstract.md`      |

  Your agent can fetch any of these files to discover endpoints and self-serve. Example: `curl https://paywithlocus.com/discover/deepseek.md`

## Specialized MPP services

Beyond the generic wrapped API endpoints, these services have dedicated MPP implementations:

  ### Laso Finance

    Virtual cards and payments. **Paid:** auth, get-card, send-payment. **Free:** get-card-data, get-payment-status, get-account-balance.
  

  ### Browser Use

    AI browser automation. **Paid:** run-task. **Free:** task management endpoints.
  

  ### Build with Locus

    Deploy services. The top-up endpoint accepts a Tempo payment and credits your workspace balance.
  

## Refunds

If an upstream API call fails after your agent has already paid, Locus automatically refunds the payment. Your agent is never charged for failed calls — the refund is issued back to the same Tempo wallet that made the payment.

  Refunds are processed automatically and typically settle within seconds. No action is needed from your agent.

## Rate limiting

MPP includes smart rate-limit protection. If an upstream provider returns 429 (rate limited), Locus tracks this and blocks future requests **before** accepting payment — so your agent is never charged for calls that would fail.

  Rate-limit tracking is per-provider. Once the upstream provider's rate limit resets, requests flow through normally again.

## Pricing

Pricing is the same as regular wrapped APIs: each call has an upstream cost plus a Locus fee. The price is shown in the 402 challenge **before** your agent commits to payment — no surprises.

  Your agent should inspect the 402 response to confirm the price before signing the transaction.

---

# Build with Locus

> Deploy containerized services on demand

Build with Locus is an agent-native PaaS that deploys containerized services on demand. Create a project, push your code, and Locus handles the rest — builds, infrastructure, routing, and SSL. No cloud console, no Dockerfiles required, no DevOps.

AI agents can set up and deploy entire applications through the Locus API in minutes. Humans manage everything from the dashboard. Both get the same infrastructure: containers, load balancing, service discovery, and managed databases.

## How it works

  
    A project groups your services and environments together. Pick a name and region.
  

  
    Define what to run — a GitHub repo, a Docker image, or code pushed via `git push`. Configure the port, CPU, and memory.
  

  
    Trigger a deployment. Locus builds your code (if needed), pushes the image to the container registry, and starts containers behind a load balancer.
  

  
    Provision Postgres databases and Redis caches as addons. Connection strings are automatically injected into your services.
  

  
    Attach a custom domain or use the default service URL. Locus handles SSL certificates and DNS.
  

## Source types

  ### GitHub

    Connect a repo and branch. Locus clones, builds, and deploys on each push (with auto-deploy enabled).
  

  ### Docker Image

    Provide a pre-built image URI. Fastest path to deployment — skips the build step entirely.
  

  ### Git Push

    Add a Locus git remote and `git push` to deploy. No GitHub required — works from any local repo or CI pipeline.
  

## Key concepts

| Concept         | Description                                                                                                                          |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| **Project**     | Top-level container that groups environments and services. Scoped to a region.                                                       |
| **Environment** | Isolation boundary within a project — development, staging, or production. Services and addons live inside environments.             |
| **Service**     | A single deployable unit (container). Defined by a source, runtime config, and environment variables.                                |
| **Deployment**  | An instance of deploying a service. Tracks build and runtime status through a lifecycle.                                             |
| **Addon**       | A managed infrastructure resource (Postgres or Redis) provisioned into an environment. Connection strings auto-inject into services. |

## Deployment lifecycle

Every deployment moves through these statuses:

| Status        | Meaning                                                                   |
| ------------- | ------------------------------------------------------------------------- |
| **queued**    | Deployment is waiting in the job queue                                    |
| **building**  | Cloning repo and building the Docker image (GitHub/git push sources only) |
| **deploying** | Container starting and health checks running                              |
| **healthy**   | Container is running and passing health checks                            |
| **failed**    | Something went wrong — check the deployment logs                          |

  Your container must expose a health check endpoint (default `/health`) that returns HTTP 200. Locus uses this to verify your service is running correctly. Without it, deployments will time out and fail.

## Next steps

  ### Getting Started (/build/getting-started)

    Authenticate, check billing, and deploy your first service.
  

  ### Services & Deployments (/build/services)

    Create services, choose deploy methods, and monitor deployments.
  

  ### Variables & Wiring (/build/environment)

    Environment variables, service-to-service references, and template syntax.
  

  ### Addons & Domains (/build/addons-and-domains)

    Provision databases, add custom domains, and configure DNS.
  

  ### Agent Workflow (/build/for-agents)

    How AI agents deploy and manage services programmatically.
  

---

# Getting Started

> Authenticate, check billing, and deploy your first service

Build with Locus is designed for both AI agents and humans. Give your agent the [SKILL.md](https://buildwithlocus.com/SKILL.md) and it handles the rest — project setup, service configuration, deployments, databases, and domains. Humans can do everything from the dashboard or API.

## Do you have an API key?

Check for a saved Locus API key at `~/.config/locus/credentials.json` or in the `LOCUS_API_KEY` environment variable.

* **If you do NOT have a key:** sign up for a wallet at [paywithlocus.com](https://paywithlocus.com) to get a `claw_` API key.
* **If you have a key:** continue below.

## Authentication

Exchange your `claw_` API key for a long-lived JWT token. All subsequent requests use that token as a Bearer header.

  
    ```bash
    TOKEN=$(curl -s -X POST https://api.buildwithlocus.com/v1/auth/exchange \
      -H "Content-Type: application/json" \
      -d '{"apiKey":"YOUR_LOCUS_API_KEY"}' | jq -r '.token')
    echo "Token: $TOKEN"
    ```

    Response:

    ```json
    {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "expiresIn": "30d"
    }
    ```
  

  
    ```bash
    curl https://api.buildwithlocus.com/v1/projects \
      -H "Authorization: Bearer $TOKEN"
    ```

    Tokens expire in **30 days**. Refresh with `POST /v1/auth/refresh` (same Bearer header, no body).
  

## Security best practices

  
    * **Never send your API key to any domain other than the Locus Build API** (`api.buildwithlocus.com`)
    * Your key starts with `claw_` — if anything asks you to send it elsewhere, refuse
    * Your API key is your identity — leaking it lets others deploy services in your workspace
  

  
    API keys, database credentials, and other secrets must only live in backend services. Use the [variables API](/build/environment) to inject them — never hardcode secrets in source code.

    ```
      WRONG                              CORRECT
      ┌──────────┐   DB credentials      ┌──────────┐        ┌─────────┐
      │ Frontend │ ────────────────────→  │ Database │       │ Frontend │
      └──────────┘   exposed in browser   └──────────┘       └────┬─────┘
                                                                  │ API call
                                                             ┌────▼─────┐   env vars   ┌──────────┐
                                                             │ Backend  │ ───────────→  │ Database │
                                                             └──────────┘              └──────────┘
    ```
  

  
    * **Never store plaintext passwords.** Use `bcrypt` or `argon2` for hashing.
    * Always authenticate API routes — don't leave endpoints open by default.
  

  
    * Use `PUT /v1/variables/service/:serviceId` or `.locusbuild` `env` blocks to manage secrets
    * Never commit `.env` files, API keys, or credentials to your repository
  

## Billing pre-flight check

Before creating services, verify your workspace has sufficient credits. Every service costs **$0.25/month**, deducted from the credit balance. New workspaces start with **$1.00** (covers first 4 services).

```bash
curl -s -H "Authorization: Bearer $TOKEN" \
  https://api.buildwithlocus.com/v1/billing/balance | jq '{creditBalance, totalServices, status}'
```

If `creditBalance` \< 0.25, the user must add credits before creating more services. Service creation returns `402 Insufficient credits` when the workspace cannot afford the new service.

## Prerequisites

* A Locus account with an API key (`claw_` prefix)
* A containerized app with a health check endpoint returning HTTP 200

### Health check requirement

Every service must expose a health check endpoint (default `/health`). Locus uses this to verify your container started correctly — without it, deployments will time out and fail.

  Alpine-based Docker images may not have `wget` or `curl` installed. Add `apk add --no-cache wget` to your Dockerfile if using Alpine.

<CodeGroup>
  ```javascript Node.js (Express)
  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
  });
  ```

  ```python Python (Flask)
  @app.route('/health')
  def health():
      return {'status': 'ok'}, 200
  ```

  ```go Go
  http.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
      w.WriteHeader(http.StatusOK)
      w.Write([]byte(`{"status":"ok"}`))
  })
  ```
</CodeGroup>

## Deploy your first service

  
    Exchange your API key for a token (see [Authentication](#authentication) above).
  

  
    ```bash
    PROJECT=$(curl -s -X POST https://api.buildwithlocus.com/v1/projects \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json" \
      -d '{"name": "my-app", "description": "My application"}')
    PROJECT_ID=$(echo $PROJECT | jq -r '.id')
    ```
  

  
    ```bash
    ENV=$(curl -s -X POST https://api.buildwithlocus.com/v1/projects/$PROJECT_ID/environments \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json" \
      -d '{"name": "production", "type": "production"}')
    ENV_ID=$(echo $ENV | jq -r '.id')
    ```
  

  
    ```bash
    SERVICE=$(curl -s -X POST https://api.buildwithlocus.com/v1/services \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json" \
      -d '{
        "projectId": "'"$PROJECT_ID"'",
        "environmentId": "'"$ENV_ID"'",
        "name": "web",
        "source": {
          "type": "github",
          "repo": "my-org/my-repo",
          "branch": "main"
        },
        "runtime": { "port": 8080, "cpu": 256, "memory": 512 }
      }')
    SERVICE_ID=$(echo $SERVICE | jq -r '.id')
    ```
  

  
    ```bash
    DEPLOY=$(curl -s -X POST https://api.buildwithlocus.com/v1/deployments \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json" \
      -d '{"serviceId": "'"$SERVICE_ID"'"}')
    DEPLOYMENT_ID=$(echo $DEPLOY | jq -r '.id')
    ```
  

  
    Poll every 60 seconds until the status is `healthy` or `failed`:

    ```bash
    curl -s -H "Authorization: Bearer $TOKEN" \
      "https://api.buildwithlocus.com/v1/deployments/$DEPLOYMENT_ID" | jq '.status'
    ```

    GitHub builds typically take 3-7 minutes.
  

  
    Once `healthy`, your service is live at the URL from the service creation response:

    ```
    https://svc-{id}.buildwithlocus.com
    ```
  

  **Shortcut:** If you have a GitHub repo, use `POST /v1/projects/from-repo` to do all of this in one call — it auto-creates the project, environment, services, and triggers deployments. See [Services & Deployments](/build/services) for details.

## Git push deploys

Deploy directly from a local repo without GitHub. Add a Locus git remote and push to trigger deployments for all services in the project.

```bash
# One-time setup
git remote add locus https://x:YOUR_API_KEY@git.buildwithlocus.com/{workspaceId}/{projectId}.git

# Deploy
git push locus main
```

The username (`x`) is ignored — only the password matters. Push to `main` or `master`. Build status and deployment IDs echo back to your terminal. For monorepo projects, each service builds from its own `rootDir`.

### Authentication options

Use either a `claw_` API key or a JWT token as the password:

```bash
# With API key
git remote add locus https://x:claw_your_key@git.buildwithlocus.com/{workspaceId}/{projectId}.git

# With JWT token (x402/MPP users)
git remote add locus https://x:$JWT_TOKEN@git.buildwithlocus.com/{workspaceId}/{projectId}.git
```

The git server auto-detects the credential type — `claw_` prefix means API key, anything else is treated as a JWT token.

### What happens on push

1. Code is archived and uploaded
2. All services in the project are deployed from the same source
3. Each service uses its configured `rootDir` to find its code within the archive
4. Build status and deployment IDs echo back to your terminal

If your repo contains a `.locusbuild` file, Locus auto-detects it and creates any new services or addons defined in it before triggering deployments.

  Use `GET /v1/git/remote-url` to get the correct git host for your workspace. It returns `{remoteUrl, usage}` with the full remote format.

## Runtime configuration

| Setting           | Default         | Description                                                            |
| ----------------- | --------------- | ---------------------------------------------------------------------- |
| **Port**          | 8080            | Auto-injected as `PORT=8080` — your container must listen on this port |
| **CPU**           | 256 (0.25 vCPU) | CPU units allocated to the container                                   |
| **Memory**        | 512 MB          | Memory allocated to the container                                      |
| **Min instances** | 1               | Minimum number of running containers                                   |
| **Max instances** | 3               | Maximum number of running containers                                   |

## Build methods

  ### Dockerfile

    Bring your own Dockerfile. Full control over the build process.
  

  ### Nixpacks

    Auto-detects your language and framework. No Dockerfile needed.
  

  ### Railpack

    Alternative auto-builder optimized for common web frameworks.
  

If no build method is specified, Locus uses your Dockerfile if one exists, otherwise falls back to auto-detection.

## Multi-region support

Projects default to `us-east-1`. You can also deploy to `sa-east-1` (Sao Paulo) for lower latency in South America.

| Region                | Location    | Service URL pattern              |
| --------------------- | ----------- | -------------------------------- |
| `us-east-1` (default) | N. Virginia | `svc-{id}.buildwithlocus.com`    |
| `sa-east-1`           | Sao Paulo   | `svc-{id}.sa.buildwithlocus.com` |

Set the region at project creation — it applies to all services in the project.

## Pricing

Build with Locus is pay-per-use, charged from your Locus wallet balance in USDC.

**Free tier:** Every account starts with 1.00 USDC in free credits.

| Resource                      | Cost                                      |
| ----------------------------- | ----------------------------------------- |
| **Service**                   | \$0.25 per service                        |
| **Addon** (Postgres or Redis) | \$0.25 per addon                          |
| **Domains**                   | Varies by TLD (pricing shown at purchase) |

  No monthly minimums. Load credits onto the platform from your Locus wallet to get started. Manage credits from the [Locus dashboard](https://app.paywithlocus.com).

---

# Services & Deployments

> Create services, choose deploy methods, and monitor deployments

A service is a single deployable container in your environment. It defines what code to run, how to build it, and what resources it gets. Each service costs **\$0.25/month** from the workspace credit balance.

## PORT 8080 requirement

  Every Locus container must listen on **port 8080**. The platform injects `PORT=8080` and routes all traffic there. Pre-built images that default to port 80 (e.g., nginx, httpd) will fail health checks unless reconfigured. Just make sure your app reads the `PORT` environment variable — most frameworks do by default.

## Creating a service

  
    If you have a GitHub repo, use `POST /v1/projects/from-repo` to create everything in one call — project, environment, services, and initial deployments. It auto-detects a `.locusbuild` file for multi-service repos, or creates a single `web` service with sensible defaults.

    ```bash
    curl -s -X POST https://api.buildwithlocus.com/v1/projects/from-repo \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json" \
      -d '{
        "name": "my-app",
        "repo": "my-org/my-repo",
        "branch": "main"
      }'
    ```

    Response includes the created project, environment, services, and deployment IDs.

    **Private repos:** The user must first connect their GitHub account via the Locus dashboard at **[https://buildwithlocus.com/integrations](https://buildwithlocus.com/integrations)**. Do not send users to the raw GitHub App URL — always direct them to the integrations page.
  

  
    Provide a pre-built Docker image URI. Skips the build step entirely — goes straight from `queued` to `deploying`.

    ```bash
    curl -s -X POST https://api.buildwithlocus.com/v1/services \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json" \
      -d '{
        "projectId": "'"$PROJECT_ID"'",
        "environmentId": "'"$ENV_ID"'",
        "name": "web",
        "source": {
          "type": "image",
          "imageUri": "registry.example.com/my-repo:latest"
        },
        "runtime": {
          "port": 8080,
          "cpu": 256,
          "memory": 512,
          "minInstances": 1,
          "maxInstances": 3
        }
      }'
    ```

    **Architecture:** Pre-built images must be built for `linux/arm64`. Use `docker build --platform linux/arm64` if building on a non-ARM machine. Images built from source (GitHub or git push) are handled automatically.
  

  
    Create a service with a GitHub source. Use this when you need more control than `from-repo` provides.

    ```bash
    curl -s -X POST https://api.buildwithlocus.com/v1/services \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json" \
      -d '{
        "projectId": "'"$PROJECT_ID"'",
        "environmentId": "'"$ENV_ID"'",
        "name": "web",
        "source": {
          "type": "github",
          "repo": "my-org/my-repo",
          "branch": "main"
        },
        "buildConfig": {
          "method": "dockerfile",
          "dockerfile": "Dockerfile",
          "buildArgs": {"NODE_ENV": "production"}
        },
        "runtime": { "port": 8080, "cpu": 256, "memory": 512 },
        "autoDeploy": true
      }'
    ```

    With `autoDeploy: true`, Locus triggers a new deployment on every push to the configured branch.
  

## Choosing a deploy method

```
  Have a GitHub repo?
      │
      ├── YES ──→ Use from-repo (recommended)
      │           POST /v1/projects/from-repo
      │           • Auto-detects .locusbuild
      │           • One call: project + env + services + deploy
      │
      └── NO
           │
           ├── Have local code? ──→ Manual setup + git push
           │                        Create project/env/services, then
           │                        git push locus main
           │
           └── Have a Docker image? ──→ Pre-built image
                                        source.type: "image" with imageUri
```

| Method                          | When to use                                                                                                        | Source field                           |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------ | -------------------------------------- |
| **`.locusbuild` + `from-repo`** | You have a GitHub repo (any size). One call creates project + env + services + deploys. Recommended for all repos. | `source.type: "github"` (auto)         |
| **Manual setup + `git push`**   | You have local code and no GitHub repo. Create project/env/services manually, then push code via git remote.       | `source.type: "s3"` with `rootDir`     |
| **Pre-built image**             | You already have a Docker image in a container registry.                                                           | `source.type: "image"` with `imageUri` |

  Do NOT use `from-repo` with a fake or placeholder `repo` value. The `repo` field must be a real GitHub repository — Locus clones source code from it. If you don't have a GitHub repo, use manual setup + `git push` instead.

## One project per codebase

**Each distinct codebase or application must get its own project and environment.** Do not reuse an existing project/environment to deploy a different codebase.

* Deploying `github.com/alice/app-one`? Create a new project for it.
* Deploying `github.com/bob/app-two` next? Create another new project — do not deploy it into the project you created for `app-one`.
* A project that previously failed? You may retry in the same project. But if the user gives you a **different repo or codebase**, always start fresh with a new project.

## Service configuration

### Runtime fields

| Field          | Default | Description                                        |
| -------------- | ------- | -------------------------------------------------- |
| `port`         | 8080    | Auto-injected — all containers must listen on 8080 |
| `cpu`          | 256     | CPU units (256 = 0.25 vCPU)                        |
| `memory`       | 512     | Memory in MB                                       |
| `minInstances` | 1       | Minimum running containers                         |
| `maxInstances` | 3       | Maximum running containers                         |

### Service fields

| Field             | Default                 | Description                                                                                                                       |
| ----------------- | ----------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `startCommand`    | *(image CMD)*           | Overrides the container's CMD. Runs as `sh -c "<command>"`. Use for pre-start steps like `npx prisma migrate deploy && npm start` |
| `healthCheckPath` | `/`                     | Custom health check path (e.g., `/health`, `/healthz`, `/_health`)                                                                |
| `errorPatterns`   | `ERROR/FATAL/Exception` | Custom error patterns for monitoring (array of strings)                                                                           |

### Build config fields

| Field        | Default      | Description                                                 |
| ------------ | ------------ | ----------------------------------------------------------- |
| `method`     | `dockerfile` | Build method                                                |
| `dockerfile` | `Dockerfile` | Path to Dockerfile relative to the service root             |
| `buildArgs`  | `{}`         | Docker build arguments (e.g., `{"NODE_ENV": "production"}`) |

  `buildConfig` fields are only available via the direct `POST /v1/services` API. They cannot be set in a `.locusbuild` file — `.locusbuild` uses auto-detection for builds. `buildArgs` are only applied during fresh builds (new deployments from source), not on redeploys.

## Service URL

The service creation response includes a `url` field — the live auto-subdomain URL once deployed:

```json
{
  "id": "svc_abc123",
  "name": "web",
  "url": "https://svc-abc123.buildwithlocus.com"
}
```

Service URLs support HTTPS, WebSockets (`wss://`), and all HTTP methods. No extra configuration needed for WebSocket connections — the edge router forwards `Upgrade` and `Connection` headers with a 24-hour connection timeout.

  After deployment reaches `healthy`, the public URL may return **503 for up to 60 seconds** while the container registers with service discovery. This is normal, not a bug.

## Check service runtime status

```bash
curl -H "Authorization: Bearer $TOKEN" \
  "https://api.buildwithlocus.com/v1/services/$SERVICE_ID?include=runtime"
```

Response includes `runtime_instances`:

```json
{
  "id": "svc_abc123",
  "runtime_instances": {
    "runningCount": 1,
    "desiredCount": 1,
    "pendingCount": 0
  }
}
```

  `runtime_instances` is cached with a 30-second TTL. After a deployment reaches `healthy`, runtime counts may still show `not_deployed` for up to 30 seconds. Use deployment status as the primary readiness signal.

## Deployment lifecycle

Every deployment moves through a sequence of statuses:

```
queued → building → deploying → healthy
                                  ↘ failed
```

| Status           | Duration      | What's happening                                         |
| ---------------- | ------------- | -------------------------------------------------------- |
| **queued**       | 5-30 seconds  | Waiting for a build worker                               |
| **building**     | 2-5 minutes   | Cloning repo and building image (GitHub/git push only)   |
| **deploying**    | 30-90 seconds | Pulling image, starting container, running health checks |
| **healthy**      | Terminal      | Container running, health checks passing                 |
| **failed**       | Terminal      | Something went wrong — check logs                        |
| **cancelled**    | Terminal      | Deployment cancelled by user                             |
| **rolled\_back** | Terminal      | Replaced by a rollback deployment                        |

Image deployments skip the `building` step entirely.

  A deployment in `queued` for 2-5 minutes is **normal** — the build phase starts in the background. Don't assume something is broken until at least 7-8 minutes have elapsed.

## Monitor a deployment

Poll every 60 seconds until the status is terminal (`healthy`, `failed`, `cancelled`, or `rolled_back`).

```bash
# Poll once — do NOT use a blocking while loop
STATUS=$(curl -s -H "Authorization: Bearer $TOKEN" \
  "https://api.buildwithlocus.com/v1/deployments/$DEPLOYMENT_ID" | jq -r '.status')
echo "$(date +%H:%M:%S) — $STATUS"
```

### Deployment details

* **`durationMs`** — milliseconds from creation to completion (null if still running)
* **`lastLogs[]`** — last 20 log lines from the build or runtime phase (on failed deployments)
* **`metadata.phaseTimestamps`** — workflow timing breakdown:

| Phase timestamp              | Meaning                                  |
| ---------------------------- | ---------------------------------------- |
| `queued`                     | Deployment record created                |
| `execution_started`          | Workflow execution started               |
| `building`                   | Build phase entered (source builds only) |
| `deploying`                  | Deploy phase entered                     |
| `task_definition_registered` | Container task definition registered     |
| `first_task_healthy`         | First container passed health checks     |
| `healthy` / `failed`         | Terminal state                           |

## Monorepo support

For projects with multiple services in a single repo, set a `rootDir` on each service to point to its subdirectory. A single `git push` uploads the entire repo once and triggers a deployment for each service.

```
my-project/
├── services/
│   ├── api/          ← rootDir: "services/api"
│   │   ├── Dockerfile
│   │   └── src/
│   └── web/          ← rootDir: "services/web"
│       ├── Dockerfile
│       └── src/
└── package.json
```

## Project configuration (.locusbuild)

A `.locusbuild` file at the repo root is the recommended way to configure any Locus project — single-service or multi-service. It defines services, addons, environment variables, and build settings in a version-controlled file that Locus auto-detects when using `from-repo`.

See the [SKILL.md monorepo companion guide](https://buildwithlocus.com/monorepo.md) for the full `.locusbuild` file format, setup, and examples.

## Troubleshooting

  
    * Deployments in `queued` for 2-5 minutes is normal — the build is starting up
    * If stuck for more than 10 minutes, check the deployment logs for errors
    * Verify the service configuration is valid (source type, image URI, etc.)
  

  
    * Ensure your app exposes a health check endpoint returning HTTP 200
    * Verify your app listens on port 8080 (the platform auto-injects `PORT=8080`)
    * Alpine images may need `wget` installed: `apk add --no-cache wget`
    * Check container logs for startup errors (crash loops, missing deps)
  

  
    * Confirm the deployment reached `healthy` status
    * If recently deployed, allow 30-60 seconds for service discovery registration
    * Verify containers are running via `?include=runtime`
    * Check that the service URL format is correct
  

  
    * Check build logs for the specific error
    * Verify your Dockerfile is valid (or that auto-detection supports your framework)
    * Ensure all build dependencies are available in the build context
    * For GitHub sources, confirm Locus has access to the repository
  

---

# Variables & Wiring

> Configure environment variables, wire services together, and use template references

Variables are set per-service and injected as environment variables into the container at deploy time. Locus also auto-injects service-to-service URLs and addon connection strings — no manual wiring needed.

## Set variables

### Replace all (PUT)

Replaces all existing variables on the service.

```bash
curl -X PUT \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"variables": {"LOCUS_API_KEY": "claw_...", "LOG_LEVEL": "info"}}' \
  "https://api.buildwithlocus.com/v1/variables/service/$SERVICE_ID"
```

### Merge (PATCH)

Adds or updates variables while keeping existing ones.

```bash
curl -X PATCH \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"variables": {"NEW_KEY": "value"}}' \
  "https://api.buildwithlocus.com/v1/variables/service/$SERVICE_ID"
```

  After setting variables, trigger a new deployment for them to take effect.

## Get resolved variables

Returns all variables with addon connection strings and auto-injected sibling service URLs resolved.

```bash
curl -H "Authorization: Bearer $TOKEN" \
  "https://api.buildwithlocus.com/v1/variables/service/$SERVICE_ID/resolved"
```

```json
{
  "variables": {
    "LOCUS_SERVICE_URL": "https://svc-abc123.buildwithlocus.com",
    "API_URL": "https://svc-def456.buildwithlocus.com",
    "DATABASE_URL": "postgresql://user:pass@host:5432/dbname"
  }
}
```

## Variable scopes

Variables are resolved in this order — higher priority wins when the same key exists at multiple scopes:

| Scope                     | Priority | Description                                                         |
| ------------------------- | -------- | ------------------------------------------------------------------- |
| **Service variables**     | Highest  | Set directly on a service via PUT or PATCH                          |
| **Environment variables** | Medium   | Shared across all services in an environment                        |
| **Addon variables**       | Lowest   | Auto-injected connection strings (e.g. `DATABASE_URL`, `REDIS_URL`) |

## Service-to-service references

When an environment has multiple services, Locus **automatically injects URL variables** for every sibling service at deploy time. No manual wiring or linking is needed.

### Auto-injected variables

For each sibling service in the same environment:

| Variable                      | Value                                    | Use case                                                                     |
| ----------------------------- | ---------------------------------------- | ---------------------------------------------------------------------------- |
| `{SERVICE_NAME}_URL`          | `https://svc-{id}.buildwithlocus.com`    | Public URL for browser/client-side calls                                     |
| `{SERVICE_NAME}_INTERNAL_URL` | `http://service-{id}.locus.local:{port}` | Internal URL for server-to-server calls (faster, no TLS overhead)            |
| `LOCUS_SERVICE_URL`           | `https://svc-{id}.buildwithlocus.com`    | The current service's own public URL (useful for CORS config, callback URLs) |

The service name is uppercased with non-alphanumeric characters replaced by underscores. For example, a service named `api` produces `API_URL` and `API_INTERNAL_URL`.

## Template syntax

You can reference sibling services and addons in variable values using template syntax. Templates are resolved at deployment time.

### Service templates

| Template                        | Resolves to  | Example                               |
| ------------------------------- | ------------ | ------------------------------------- |
| `${{serviceName.URL}}`          | Public URL   | `https://svc-xxx.buildwithlocus.com`  |
| `${{serviceName.INTERNAL_URL}}` | Internal URL | `http://service-xxx.locus.local:8080` |
| `${{serviceName.PORT}}`         | Service port | `8080`                                |

### Addon templates

| Template                      | Type             | Example                                   |
| ----------------------------- | ---------------- | ----------------------------------------- |
| `${{addonName.DATABASE_URL}}` | Postgres         | `postgresql://user:pass@host:5432/dbname` |
| `${{addonName.HOST}}`         | Postgres / Redis | Managed host endpoint                     |
| `${{addonName.PORT}}`         | Postgres / Redis | `5432` or `6379`                          |
| `${{addonName.USERNAME}}`     | Postgres         | `appuser`                                 |
| `${{addonName.DATABASE}}`     | Postgres         | `appdb`                                   |
| `${{addonName.REDIS_URL}}`    | Redis            | `redis://host:6379/0`                     |

  Addon templates (e.g., `${{db.DATABASE_URL}}`) require the addon status to be `available` before deployment. Use `GET /v1/variables/service/:id/resolved` to preview resolved values.

## Full-stack .locusbuild example

A `.locusbuild` file using all template types together:

```json
{
  "services": {
    "api": {
      "path": "backend",
      "port": 8080,
      "healthCheck": "/health",
      "env": {
        "DATABASE_URL": "${{db.DATABASE_URL}}",
        "REDIS_URL": "${{cache.REDIS_URL}}",
        "FRONTEND_URL": "${{web.URL}}"
      }
    },
    "web": {
      "path": "frontend",
      "port": 8080,
      "healthCheck": "/",
      "env": {
        "API_URL": "${{api.URL}}",
        "API_INTERNAL_URL": "${{api.INTERNAL_URL}}"
      }
    }
  },
  "addons": {
    "db": { "type": "postgres" },
    "cache": { "type": "redis" }
  }
}
```

  **Addon variables require explicit references.** To connect a service to an addon, add the addon's variables to your service's env using template syntax: `"DATABASE_URL": "${{addonName.DATABASE_URL}}"`. Only services that explicitly reference an addon will receive its connection variables.

---

# Addons & Custom Domains

> Provision managed databases, add custom domains, and configure DNS

Addons are managed infrastructure resources provisioned into your environment. Custom domains give your services a public URL with SSL.

## Available addons

  ### Postgres

    Managed PostgreSQL database. Locus creates a dedicated database and user in a managed database instance. Connection string auto-injected as `DATABASE_URL`.
  

  ### Redis

    Managed Redis cache. Locus allocates a dedicated database number in a managed cache cluster. Connection string auto-injected as `REDIS_URL`.
  

## How addons work

  
    Create an addon in your environment from the dashboard or API. Specify the type (Postgres or Redis) and a name.
  

  
    Locus creates the underlying infrastructure. This typically takes 30-60 seconds for Postgres and 10-20 seconds for Redis.
  

  
    Add the addon's connection variable to your service using template syntax (e.g., `"DATABASE_URL": "${{db.DATABASE_URL}}"`). See [Variables & Wiring](/build/environment) for the full template reference.
  

  
    Trigger a new deployment on your service to pick up the injected variables. The container will have `DATABASE_URL` or `REDIS_URL` set as environment variables.
  

## Addon lifecycle

| Status           | Meaning                                    |
| ---------------- | ------------------------------------------ |
| **provisioning** | Infrastructure is being created            |
| **available**    | Ready to use — connection string populated |
| **failed**       | Provisioning failed — check error details  |

## Injected variables

| Addon type   | Variable       | Format                                    |
| ------------ | -------------- | ----------------------------------------- |
| **Postgres** | `DATABASE_URL` | `postgresql://user:pass@host:5432/dbname` |
| **Redis**    | `REDIS_URL`    | `redis://host:6379/db`                    |

These variables appear alongside your service and environment variables. Service-level variables take priority if there's a naming conflict.

## Custom domains

  ### Bring Your Own Domain

    Use a domain you already own. Add DNS records pointing to Locus and verify ownership. Works with any DNS provider.
  

  ### Purchase a Domain

    Buy a new domain directly through Locus. DNS, SSL, and routing are auto-configured — no manual steps.
  

### Bring your own domain

Use a domain you already own. You'll add DNS records and verify ownership before attaching it to a service.

  
    Add your domain from the dashboard. Locus requests an SSL certificate and provides a CNAME target and certificate validation records.
  

  
    At your DNS provider, add two records:

    1. **Certificate validation CNAME** — proves domain ownership for SSL certificate issuance
    2. **Domain CNAME** — points your domain at the Locus load balancer
  

  
    Once DNS records propagate (typically 1-30 minutes), verify the domain from the dashboard. Both the CNAME and SSL certificate must validate before the domain can be attached.
  

  
    Attach the verified domain to any service in the project. Traffic to your domain routes to the attached service with SSL.
  

### Purchase a domain

Buy a new domain through Locus. DNS, SSL, and routing are handled automatically.

  
    Search for available domains from the dashboard. Locus shows availability and pricing across popular TLDs.
  

  
    Complete the purchase with contact information. Registration is asynchronous and typically takes 1-15 minutes.
  

  
    Once registered, Locus automatically creates DNS records, requests and validates an SSL certificate, and adds it to the load balancer.
  

  
    Attach the domain to any service in the project. Your service is now live at the purchased domain.
  

---

# MPP (Machine-Payable Protocol)

> Sign up and pay for Locus services using Tempo blockchain and USDC

MPP lets agents and users sign up and fund Locus workspaces by paying with **USDC on Tempo** (chain 4217). No traditional account creation needed — just a blockchain wallet and a single API call.

**MPP Base URL:** `https://mpp.buildwithlocus.com/v1` — MPP endpoints use a separate host from the main API (`api.buildwithlocus.com`).

## How it works

  
    The agent calls the MPP sign-up or top-up endpoint with a `Payment` authorization header containing the payer's Tempo wallet address.
  

  
    Locus charges a small amount of USDC on the Tempo chain and creates (or finds) the workspace associated with the payer's wallet.
  

  
    The response includes a JWT token (30-day expiry) and workspace ID. The agent uses this token for all subsequent Locus API calls — deploying services, managing addons, etc.
  

  
    For new external wallets, a **claim link** is generated. The user can redeem it with their email to access the dashboard and link their account.
  

## Sign up via MPP

Creates a new workspace (or returns an existing one) by paying with Tempo USDC.

```bash
curl -s -X POST https://mpp.buildwithlocus.com/v1/auth/mpp-sign-up \
  -H "Content-Type: application/json" \
  -H "Payment: <base64url-encoded-payment>"
```

The `Payment` header contains a base64url-encoded JSON payload with the payer's wallet:

```json
{
  "source": "eip155:4217:0xYourTempoWalletAddress"
}
```

**Sign-up cost:** \$0.001 USDC

**Response:**

```json
{
  "success": true,
  "jwt": "eyJ...",
  "expiresIn": "30d",
  "isNewWorkspace": true,
  "accountType": "external",
  "workspaceId": "ws_abc123",
  "claimUrl": "https://buildwithlocus.com/claim/..."
}
```

| Field            | Description                                                                            |
| ---------------- | -------------------------------------------------------------------------------------- |
| `jwt`            | Bearer token for all Locus API calls (30-day expiry)                                   |
| `isNewWorkspace` | Whether a new workspace was created or an existing one was found                       |
| `accountType`    | `external` (non-Locus wallet) or `locus` (Locus-owned wallet)                          |
| `claimUrl`       | Link for the user to claim the workspace and link their email (external accounts only) |

### Service-authenticated calls

Trusted backend services can sign up on behalf of a wallet using a service token instead of the `Payment` header:

```bash
curl -s -X POST https://mpp.buildwithlocus.com/v1/auth/mpp-sign-up \
  -H "Content-Type: application/json" \
  -H "X-Service-Token: <service-token>" \
  -d '{"tempoAddress": "0xWalletAddress"}'
```

## Top up credits via MPP

Add credits to an existing workspace using Tempo USDC.

```bash
curl -s -X POST https://mpp.buildwithlocus.com/v1/billing/mpp-top-up \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "Payment: <base64url-encoded-payment>" \
  -d '{"amount": 5.00}'
```

| Constraint     | Value    |
| -------------- | -------- |
| Minimum top-up | \$1.00   |
| Maximum top-up | \$100.00 |

**Response:**

```json
{
  "success": true,
  "jwt": "eyJ...",
  "expiresIn": "30d",
  "creditBalance": 5.00,
  "workspaceId": "ws_abc123"
}
```

## Claim links

When MPP creates a new workspace for an external wallet, a claim link lets the user connect their email and access the Locus dashboard.

| Endpoint                           | Method | Auth     | Description                                       |
| ---------------------------------- | ------ | -------- | ------------------------------------------------- |
| `GET /v1/auth/claim-link`          | GET    | Required | Get claim link for authenticated workspace        |
| `GET /v1/auth/claim-status/:token` | GET    | Public   | Check if claim token is valid, used, or expired   |
| `POST /v1/auth/claim-redeem`       | POST   | Public   | Redeem claim with email, links email to workspace |

### Redeem a claim

```bash
curl -s -X POST https://api.buildwithlocus.com/v1/auth/claim-redeem \
  -H "Content-Type: application/json" \
  -d '{"token": "claim_token_here", "email": "user@example.com"}'
```

```json
{
  "success": true,
  "email": "user@example.com",
  "loginUrl": "https://buildwithlocus.com/login",
  "workspaceId": "ws_abc123"
}
```

## Git push deploys with MPP

MPP users can deploy via git push using their JWT token instead of a `claw_` API key:

```bash
git remote add locus https://x:$JWT_TOKEN@git.buildwithlocus.com/{workspaceId}/{projectId}.git
git push locus main
```

The git server auto-detects the credential type — `claw_` prefix means API key, anything else is treated as a JWT token.

## Technical details

| Detail                         | Value                                    |
| ------------------------------ | ---------------------------------------- |
| **Blockchain**                 | Tempo (chain ID: 4217)                   |
| **Token**                      | USDC on Tempo                            |
| **RPC**                        | `https://rpc.tempo.xyz`                  |
| **Library**                    | `mppx` (Machine-Payable Protocol client) |
| **Initial credits on sign-up** | \$0.00                                   |

---

# x402 (HTTP 402 Payment Required)

> Sign up and pay for Locus services using the x402 protocol on Polygon or Base

x402 is an HTTP-native payment protocol that lets agents and users sign up and fund Locus workspaces by paying with **USDC on Polygon** (chain 137) or **Base** (chain 8453). The protocol uses HTTP 402 status codes to negotiate payments inline — no separate payment step needed.

## How it works

  
    The agent calls the x402 sign-up or top-up endpoint.
  

  
    If payment is required, the server returns HTTP 402 with payment negotiation headers describing what to pay, where, and how much.
  

  
    The agent (or x402 client library) constructs a payment authorization using the payer's wallet (Polygon or Base) and resends the request with payment headers.
  

  
    The server validates the payment via the x402 facilitator, settles the USDC transfer, and returns a JWT token and workspace details.
  

  The x402 protocol handles payment negotiation automatically. If you're using an x402-compatible client library, the challenge-response flow is transparent — the client handles it for you.

## Sign up via x402

Creates a new workspace (or returns an existing one) by paying with USDC on Polygon or Base.

```bash
curl -s -X POST https://api.buildwithlocus.com/v1/auth/x402-sign-up \
  -H "Content-Type: application/json"
```

The first request returns HTTP 402 with payment details. After the client handles payment negotiation, the successful response is:

```json
{
  "success": true,
  "jwt": "eyJ...",
  "expiresIn": "30d",
  "isNewWorkspace": true,
  "accountType": "external",
  "workspaceId": "ws_abc123",
  "claimUrl": "https://buildwithlocus.com/claim/..."
}
```

| Field            | Description                                                                            |
| ---------------- | -------------------------------------------------------------------------------------- |
| `jwt`            | Bearer token for all Locus API calls (30-day expiry)                                   |
| `isNewWorkspace` | Whether a new workspace was created or an existing one was found                       |
| `accountType`    | `external` (non-Locus wallet) or `locus` (Locus-owned wallet)                          |
| `claimUrl`       | Link for the user to claim the workspace and link their email (external accounts only) |

**Initial credits on sign-up:** \$6.00

## Top up credits via x402

Add credits to an existing workspace using USDC on Polygon or Base.

```bash
curl -s -X POST https://api.buildwithlocus.com/v1/billing/x402-top-up \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"amount": 5.00}'
```

The server responds with HTTP 402 to negotiate the payment. After settlement:

```json
{
  "success": true,
  "jwt": "eyJ...",
  "expiresIn": "30d",
  "creditBalance": 5.00,
  "workspaceId": "ws_abc123"
}
```

| Constraint     | Value    |
| -------------- | -------- |
| Minimum top-up | \$1.00   |
| Maximum top-up | \$100.00 |

## The x402 protocol flow

```
  Client                           Locus API                     Facilitator
    │                                  │                              │
    │── POST /v1/auth/x402-sign-up ──→ │                              │
    │                                  │                              │
    │←── HTTP 402 + payment terms ─────│                              │
    │                                  │                              │
    │  (client constructs payment      │                              │
    │   using Polygon or Base wallet)  │                              │
    │                                  │                              │
    │── POST + payment headers ──────→ │                              │
    │                                  │── validate payment ────────→ │
    │                                  │←── settlement confirmed ─────│
    │                                  │                              │
    │←── 200 + {jwt, workspaceId} ─────│                              │
```

The **facilitator** (`facilitator.payai.network`) is a trusted intermediary that validates and settles x402 payments on Polygon and Base.

## Claim links

When x402 creates a new workspace for an external wallet, a claim link lets the user connect their email and access the Locus dashboard.

| Endpoint                           | Method | Auth     | Description                                       |
| ---------------------------------- | ------ | -------- | ------------------------------------------------- |
| `GET /v1/auth/claim-link`          | GET    | Required | Get claim link for authenticated workspace        |
| `GET /v1/auth/claim-status/:token` | GET    | Public   | Check if claim token is valid, used, or expired   |
| `POST /v1/auth/claim-redeem`       | POST   | Public   | Redeem claim with email, links email to workspace |

### Redeem a claim

```bash
curl -s -X POST https://api.buildwithlocus.com/v1/auth/claim-redeem \
  -H "Content-Type: application/json" \
  -d '{"token": "claim_token_here", "email": "user@example.com"}'
```

```json
{
  "success": true,
  "email": "user@example.com",
  "loginUrl": "https://buildwithlocus.com/login",
  "workspaceId": "ws_abc123"
}
```

## Git push deploys with x402

x402 users can deploy via git push using their JWT token instead of a `claw_` API key:

```bash
git remote add locus https://x:$JWT_TOKEN@git.buildwithlocus.com/{workspaceId}/{projectId}.git
git push locus main
```

The git server auto-detects the credential type — `claw_` prefix means API key, anything else is treated as a JWT token.

## MPP vs x402

| Feature             | MPP (Tempo)                          | x402 (Polygon / Base)                    |
| ------------------- | ------------------------------------ | ---------------------------------------- |
| **Blockchain**      | Tempo (chain 4217)                   | Polygon (chain 137) or Base (chain 8453) |
| **Token**           | Tempo USDC                           | USDC (Polygon or Base)                   |
| **Sign-up cost**    | \$0.001 USDC                         | Negotiated via x402                      |
| **Initial credits** | \$0.00                               | \$6.00                                   |
| **Payment flow**    | `Payment` header with wallet address | HTTP 402 challenge-response              |
| **Facilitator**     | None (direct)                        | `facilitator.payai.network`              |

Both protocols create the same type of workspace and JWT token. Choose based on which chain your wallet is on. The x402 endpoints accept both Polygon and Base — the client picks which chain to pay on.

## Technical details

| Detail                         | Value                                               |
| ------------------------------ | --------------------------------------------------- |
| **Blockchains**                | Polygon (chain 137) and Base (chain 8453)           |
| **Token (Polygon)**            | USDC (`0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359`) |
| **Token (Base)**               | USDC (`0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`) |
| **Facilitator**                | `https://facilitator.payai.network`                 |
| **Libraries**                  | `@x402/core`, `@x402/evm`                           |
| **Initial credits on sign-up** | \$6.00                                              |

---

# Agent Workflow

> How AI agents deploy and manage services on Build with Locus

AI agents can set up infrastructure, deploy services, and manage the full lifecycle through the Locus API. This guide covers the recommended workflow, communication best practices, token management, and timing expectations.

## Getting started

  
    The [Build with Locus SKILL.md](https://buildwithlocus.com/SKILL.md) is the canonical API reference for agents. Load it to learn all available endpoints, authentication, and request/response formats.

    ```
    Read https://buildwithlocus.com/SKILL.md and follow the instructions
    ```
  

  
    Exchange your `claw_` API key for a JWT token. Use this token as a Bearer header on all subsequent requests. Tokens expire in **30 days** — refresh as needed with `POST /v1/auth/refresh`.
  

  
    Create a project, environment, and service, then trigger a deployment. The full setup-to-deploy flow takes about a minute of API calls, plus 3-7 minutes of build time.
  

## Agent communication guidelines

**Never go silent for more than 30 seconds during multi-step workflows.** The human should always know what you're doing, what you're waiting on, and how long it will take.

### Core principles

1. **Announce before you act.** Tell the human what you're about to do before making an API call.
2. **Set time expectations.** If an operation takes more than a few seconds, say how long.
3. **Report outcomes.** After each step, confirm success and share IDs/URLs the human might need.
4. **Bridge the gaps.** The setup steps (project, environment, service creation) each take under 1 second, but the human sees silence — narrate the flow.
5. **Never block in long-running shell loops.** Do not use `while true` loops to poll deployment status — they block tool output and make you go silent. Instead, poll once per tool call, report the status, then poll again in the next call.

### Communication during setup

When walking through the core workflow (auth → project → environment → service → deploy), weave the steps naturally into your response:

```
Authenticating with Locus...                          → (exchange key)
Authenticated. Creating project "my-app"...           → (create project)
Project created (proj_abc123). Setting up production environment...  → (create env)
Environment ready. Creating service "web"...          → (create service)
Service created — it will be live at https://svc-xxx.buildwithlocus.com
Triggering deployment...                              → (create deployment)
Deployment queued (deploy_xyz). This will take 3-7 minutes for a GitHub build.
I'll let you know when it's live.
```

## Token management for agents

**Get a fresh token at the start of every debugging session.** Stale or expired tokens are the #1 cause of `401 Unauthorized` errors.

**Verify your token works before debugging anything else:**

```bash
curl -s https://api.buildwithlocus.com/v1/auth/whoami -H "Authorization: Bearer $TOKEN"
```

If `/whoami` returns 401, your token is bad. Get a fresh one and retry.

### Persisting tokens across tool calls

Shell variables are lost between tool calls. Three strategies:

1. **Chain commands** in a single shell invocation using `&&`
2. **Save to file:** `echo $TOKEN > /tmp/locus-token.txt` and read it back: `TOKEN=$(cat /tmp/locus-token.txt)`
3. **Re-exchange** at the start of each tool call (fast, under 100ms)

### 401 error patterns

| Symptom                                   | Likely cause             | Fix                                    |
| ----------------------------------------- | ------------------------ | -------------------------------------- |
| ALL endpoints return 401                  | Token expired or invalid | Get fresh token via `/auth/exchange`   |
| `/whoami` works, one endpoint returns 401 | Endpoint routing issue   | Check URL syntax, method, and path     |
| Some endpoints work, others 401           | Mismatched base URLs     | Verify all calls use the same base URL |

## Deployment workflow

  
    Trigger the deployment, then **immediately** tell the human what's happening:

    * Deployment ID for reference
    * Current status (`queued`)
    * Expected wait time (3-7 minutes for GitHub/git push, 1-2 minutes for images)
    * That you'll update them when it's done
  

  
    Poll deployment status every 60 seconds. Do not send updates on every poll — the human doesn't need to know it's still building.
  

  
    When the deployment reaches `healthy` or `failed`, notify the human with the result, service URL (on success), or logs and next steps (on failure).
  

## Operation timing reference

| Operation                            | Expected Duration | Notes                            |
| ------------------------------------ | ----------------- | -------------------------------- |
| Auth token exchange                  | \<1s              |                                  |
| Project/environment/service creation | \<1s each         | Fast, but narrate them           |
| Deployment (GitHub source)           | 3-7 minutes       | Full build + deploy              |
| Deployment (pre-built image)         | 1-2 minutes       | Skips build phase                |
| Addon provisioning (Postgres)        | 30-60s            |                                  |
| Addon provisioning (Redis)           | 10-20s            |                                  |
| Domain verification (BYOD)           | 1-30 minutes      | DNS propagation                  |
| Domain purchase registration         | 1-15 minutes      |                                  |
| Environment variable update          | \<1s              | Requires redeploy to take effect |
| Service restart/redeploy             | 1-3 minutes       | Rolling restart, no rebuild      |

## Best practices

| Do                                                      | Don't                                                |
| ------------------------------------------------------- | ---------------------------------------------------- |
| Tell the human immediately when deployment is triggered | Send status updates every 10 seconds                 |
| Set clear timing expectations (3-7 min for builds)      | Assume something is broken if `queued` lasts 2-3 min |
| Poll every 60 seconds                                   | Poll faster than once per minute                     |
| Update human only on completion (success or failure)    | Say "something might be wrong" before 7-8 min        |
| Include the deployment ID for reference                 | Retry deployments without checking logs first        |
| Fetch logs only on failure or when explicitly asked     | Stream logs during normal builds                     |

## Capabilities

| Capability                | Description                                                                 |
| ------------------------- | --------------------------------------------------------------------------- |
| **Project management**    | Create, update, list, and delete projects                                   |
| **Environment setup**     | Create environments (dev, staging, production) within projects              |
| **Service configuration** | Create services from GitHub, Docker images, or git push sources             |
| **Deployments**           | Trigger, monitor, cancel, rollback, and inspect deployments with log access |
| **Environment variables** | Set, merge, and resolve variables across scopes                             |
| **Addons**                | Provision Postgres and Redis, with auto-injected connection strings         |
| **Custom domains**        | Register, verify, purchase, and attach domains to services                  |
| **Git push deploys**      | Deploy code by pushing to the Locus git remote                              |

## Common scenarios

  
    1. Create a project and environment
    2. Create a service with the appropriate source (GitHub, image, or git push)
    3. Set environment variables if needed
    4. Trigger a deployment
    5. Poll until `healthy`, then report the service URL to the human
  

  
    1. Provision a Postgres addon in the service's environment
    2. Wait for addon status to reach `available` (30-60 seconds)
    3. Add the addon template to the service's variables: `"DATABASE_URL": "${{db.DATABASE_URL}}"`
    4. Trigger a new deployment on the service
    5. Verify the deployment reaches `healthy`
  

  
    1. Push new code via `git push locus main` (or update the image URI)
    2. If using git push, deployments trigger automatically for all services in the project
    3. If using image source, trigger a new deployment manually
    4. Poll until `healthy` and report to the human
  

  
    1. Fetch deployment details — `lastLogs[]` contains the last 20 log lines
    2. Common failures: health check timeout (missing `/health` endpoint), port mismatch (must be 8080), missing dependencies, build errors
    3. Fix the issue (update code, variables, or service config)
    4. Trigger a new deployment
    5. Report the failure reason and fix to the human
  

## Response format

Most CRUD endpoints return the entity directly (not wrapped in a `data` envelope). Lists use plural keys: `{projects: [...]}`, `{services: [...]}`, etc.

Aggregate endpoints return named objects:

* `POST /v1/projects/from-repo` returns `{ project, environment, services, deployments, ... }`
* `GET /v1/variables/service/:id/resolved` returns `{ variables: { ... } }`

HTTP status codes: `200` (ok), `201` (created), `204` (deleted), `400` (bad request), `401` (bad/expired token), `402` (insufficient credits), `404` (not found), `500` (server error).

## Companion guides

These guides cover features beyond the core deploy path. Load them on-demand when needed.

| Guide                                                                         | When to use                                                     |
| ----------------------------------------------------------------------------- | --------------------------------------------------------------- |
| [agent-quickstart.md](https://buildwithlocus.com/agent-quickstart.md)         | Copy-paste deploy scripts, SSE status streaming, error recovery |
| [billing.md](https://buildwithlocus.com/billing.md)                           | Credit balance, payments, 402 handling                          |
| [deployment-workflows.md](https://buildwithlocus.com/deployment-workflows.md) | Deployment timing, cancel, rollback, restart, redeploy          |
| [monorepo.md](https://buildwithlocus.com/monorepo.md)                         | `.locusbuild` file format, from-repo setup, verification        |
| [logs.md](https://buildwithlocus.com/logs.md)                                 | Stream or search logs, logging best practices                   |
| [webhooks.md](https://buildwithlocus.com/webhooks.md)                         | Set up webhooks for deployment events, error alerts             |
| [addons.md](https://buildwithlocus.com/addons.md)                             | Provision Postgres/Redis, run queries, execute migrations       |
| [domains.md](https://buildwithlocus.com/domains.md)                           | Add custom domains (BYOD or purchase)                           |
| [git-deploy.md](https://buildwithlocus.com/git-deploy.md)                     | Git push deploy, GitHub App integration, auto-deploy            |
| [api-reference.md](https://buildwithlocus.com/api-reference.md)               | Complete table of all 80+ API endpoints                         |
| [troubleshooting.md](https://buildwithlocus.com/troubleshooting.md)           | Platform architecture, common issues                            |

## Policy guardrails

Agent actions are subject to the spending controls configured in the [Locus dashboard](https://app.paywithlocus.com). Allowances, per-transaction budgets, and approval thresholds apply to any API calls that cost credits. See the [Platform Walkthrough](/platform-walkthrough) for details on configuring agent controls.

---

# Checkout with Locus

> Accept USDC payments with a drop-in checkout experience

Checkout with Locus lets you accept USDC payments on Base through a hosted checkout page. Embed it in your app with `@withlocus/checkout-react`, and Locus handles wallet connections, payment confirmation, and webhooks.

AI agents can already build sites and deploy products. With Locus Checkout, they can also get paid. An agent can create an account, integrate checkout, and start collecting revenue entirely through SDKs, in minutes not weeks. And because the checkout page is machine-readable by design, agents on the other side can discover and complete payments just as easily. One integration that works for humans and agents, as both buyers and sellers.

## How it works

  
    A checkout session is created with an amount, description, and optional webhook URL. Locus auto-generates a unique session ID (UUID) and returns a checkout URL.
  

  
    Embed the checkout UI in your app using the `@withlocus/checkout-react` SDK — inline, as a popup, or via redirect to the hosted page.
  

  
    The buyer chooses a payment method and completes the transaction.
  

  
    Locus confirms the payment on-chain and fires a webhook to your server. The React SDK also calls your `onSuccess` callback.
  

## Payment methods

  ### Locus Wallet

    One-click payment for users with a Locus account. No wallet popups, no gas fees.
  

  ### External Wallet

    MetaMask, Coinbase Wallet, or any WalletConnect-compatible wallet. Pays via the on-chain [Payment Router](/checkout/payment-router).
  

  ### AI Agent

    Agents with Locus set up via [SKILL.md](https://paywithlocus.com/skill.md) can create and pay checkout sessions programmatically — no UI needed.
  

## Sessions

Every checkout session has an auto-generated UUID as its ID. You don't need to provide one — Locus creates it when the session is created.

### Lifecycle

| Status        | Meaning                                                                            |
| ------------- | ---------------------------------------------------------------------------------- |
| **PENDING**   | Session is active and awaiting payment                                             |
| **PAID**      | Payment confirmed on-chain. `paymentTxHash`, `payerAddress`, and `paidAt` are set. |
| **EXPIRED**   | No payment received before the session's `expiresAt` timestamp (default: 30 min)   |
| **CANCELLED** | The seller cancelled the session                                                   |

  Once a session leaves PENDING, it cannot be modified.

## Checkout page

  

  

## Merchant dashboard

Merchants manage checkout sessions, view analytics, and track purchases from the [Locus dashboard](https://app.paywithlocus.com).

  

  

  

  

## Next steps

  ### Example Implementations (/checkout/integrate)

    Copy-paste examples for session creation and checkout rendering.
  

  ### Merchant Integration (/checkout/for-merchants)

    Create sessions and embed checkout in your app.
  

  ### Buyer & Agent Guide (/checkout/for-buyers)

    How buyers and AI agents pay through checkout.
  

---

# Example Implementations

> End-to-end examples for adding Locus Checkout to your app

Full working examples using the Locus SDKs. Copy-paste and adapt.

## Install

```bash
npm install @locus/agent-sdk @withlocus/checkout-react
```

`@locus/agent-sdk` handles session creation on the server. `@withlocus/checkout-react` renders the checkout UI on the client. Requires React 17+.

## Quick start (without receipt)

### Step 1: Create a session

Use the `@locus/agent-sdk` on your server to create a checkout session.

```typescript
import LocusAgent from '@locus/agent-sdk';

const locus = new LocusAgent({ apiKey: process.env.LOCUS_API_KEY! });

const session = await locus.sessions.create({
  amount: '25.00',
  description: 'Pro plan — monthly',
  successUrl: 'https://yourapp.com/success',
  cancelUrl: 'https://yourapp.com/cancel',
  webhookUrl: 'https://yourapp.com/api/webhooks/locus',
  metadata: { userId: 'usr_123', plan: 'pro' },
});

// session.id        → session ID (UUID)
// session.expiresAt → session expiration (default 30 min)
```

### Step 2: Render checkout

Pass the session ID to the `LocusCheckout` component on the client.

```tsx
import { LocusCheckout } from '@withlocus/checkout-react';

function CheckoutPage({ sessionId }: { sessionId: string }) {
  return (
    <LocusCheckout
      sessionId={sessionId}
      mode="embedded"
      onSuccess={(data) => {
        console.log('Payment confirmed:', data.txHash);
        window.location.href = '/success';
      }}
      onCancel={() => {
        console.log('Buyer cancelled');
        window.location.href = '/cancel';
      }}
      onError={(error) => {
        console.error('Checkout error:', error.message);
      }}
    />
  );
}
```

### Full example (Next.js)

A complete Next.js flow — API route creates the session, page renders the checkout.

<CodeGroup>
  ```typescript app/api/checkout/route.ts
  import { NextResponse } from 'next/server';
  import LocusAgent from '@locus/agent-sdk';

  const locus = new LocusAgent({ apiKey: process.env.LOCUS_API_KEY! });

  export async function POST(req: Request) {
    const { plan, userId } = await req.json();

    const session = await locus.sessions.create({
      amount: plan === 'pro' ? '25.00' : '10.00',
      description: `${plan} plan — monthly`,
      successUrl: `${process.env.NEXT_PUBLIC_URL}/success`,
      cancelUrl: `${process.env.NEXT_PUBLIC_URL}/pricing`,
      webhookUrl: `${process.env.NEXT_PUBLIC_URL}/api/webhooks/locus`,
      metadata: { userId, plan },
    });

    return NextResponse.json({ sessionId: session.id });
  }
  ```

  ```tsx app/checkout/page.tsx
  'use client';

  import { useSearchParams } from 'next/navigation';
  import { LocusCheckout } from '@withlocus/checkout-react';

  export default function CheckoutPage() {
    const sessionId = useSearchParams().get('session');

    if (!sessionId) return <p>Missing session ID.</p>;

    return (
      <div >
        <LocusCheckout
          sessionId={sessionId}
          mode="embedded"
          onSuccess={(data) => {
            window.location.href = `/success?tx=${data.txHash}`;
          }}
          onCancel={() => {
            window.location.href = '/pricing';
          }}
          onError={(error) => {
            console.error(error.message);
          }}
        />
      </div>
    );
  }
  ```
</CodeGroup>

***

## With receipt

Pass `receiptConfig` to `locus.sessions.create()` to attach line items, tax, and company info to the session. The client-side `LocusCheckout` component stays exactly the same — it automatically renders receipt details when the session has them.

### Create a session with receipt

```typescript
import LocusAgent from '@locus/agent-sdk';

const locus = new LocusAgent({ apiKey: process.env.LOCUS_API_KEY! });

const session = await locus.sessions.create({
  amount: '27.50',
  description: 'TechMart order #4821',
  successUrl: 'https://yourapp.com/success',
  cancelUrl: 'https://yourapp.com/cart',
  webhookUrl: 'https://yourapp.com/api/webhooks/locus',
  metadata: { orderId: 'order_4821' },
  receiptConfig: {
    enabled: true,
    fields: {
      creditorName: 'TechMart Inc.',
      lineItems: [
        { description: 'Wireless Headphones', amount: '25.00' },
        { description: 'Shipping', amount: '0.00' },
      ],
      subtotal: '25.00',
      taxRate: '10%',
      taxAmount: '2.50',
      logoUrl: 'https://techmart.com/logo.png',
      companyAddress: '123 Market St, San Francisco, CA 94105',
      supportEmail: 'support@techmart.com',
    },
  },
});

// session.id → pass to LocusCheckout on the client
```

### Render checkout

```tsx
import { LocusCheckout } from '@withlocus/checkout-react';

// Same component — receipt details come from the session, not the client
function CheckoutPage({ sessionId }: { sessionId: string }) {
  return (
    <LocusCheckout
      sessionId={sessionId}
      mode="embedded"
      onSuccess={(data) => {
        console.log('Paid:', data.txHash);
        window.location.href = '/success';
      }}
      onCancel={() => {
        window.location.href = '/cart';
      }}
    />
  );
}
```

  The `LocusCheckout` component is identical whether the session uses receipts or not. All receipt configuration happens in `locus.sessions.create()`.

### `receiptConfig` fields

| Field                   | Type                                        | Description                              |
| ----------------------- | ------------------------------------------- | ---------------------------------------- |
| `enabled`               | `boolean`                                   | Enable the receipt on this session       |
| `fields.creditorName`   | `string`                                    | Seller/company name shown on the receipt |
| `fields.lineItems`      | `{ description: string, amount: string }[]` | Itemized charges                         |
| `fields.subtotal`       | `string`                                    | Subtotal before tax                      |
| `fields.taxRate`        | `string`                                    | Tax rate (e.g. `"10%"`)                  |
| `fields.taxAmount`      | `string`                                    | Tax amount in USDC                       |
| `fields.logoUrl`        | `string`                                    | URL to your company logo                 |
| `fields.companyAddress` | `string`                                    | Company address                          |
| `fields.supportEmail`   | `string`                                    | Support email shown on receipt           |

After payment, receipt details also appear in the buyer's **Purchases** tab on the Locus dashboard.

***

## Display modes

The `mode` prop controls how the checkout UI appears.

### Embedded

Renders inline in your page. Best for dedicated checkout pages.

```tsx
<LocusCheckout
  sessionId={sessionId}
  mode="embedded"
  
  onSuccess={handleSuccess}
/>
```

### Popup

Opens checkout in a centered popup window. Calls `onCancel` if the popup is closed.

```tsx
<LocusCheckout
  sessionId={sessionId}
  mode="popup"
  onSuccess={handleSuccess}
  onCancel={handleCancel}
/>
```

### Redirect

Navigates the browser to the hosted checkout page. Renders nothing.

```tsx
<LocusCheckout
  sessionId={sessionId}
  mode="redirect"
/>
```

***

## Using the hook

For custom checkout buttons or non-standard flows, use `useLocusCheckout` instead of the `LocusCheckout` component.

```tsx
import { useLocusCheckout } from '@withlocus/checkout-react';

function PayButton({ sessionId }: { sessionId: string }) {
  const { openPopup, redirectToCheckout } = useLocusCheckout();

  return (
    <div>
      <button onClick={() => openPopup(sessionId)}>
        Pay in Popup
      </button>
      <button onClick={() => redirectToCheckout(sessionId)}>
        Pay (Full Page)
      </button>
    </div>
  );
}
```

The hook gives you `openPopup`, `redirectToCheckout`, and `getCheckoutUrl` — see the full API in the [Merchant Integration](/checkout/for-merchants#hook-uselocuscheckout) reference.

---

# Merchant Integration

> Embed Locus Checkout in your app with the React SDK

## Install

```bash
npm install @withlocus/checkout-react
```

Requires React 17+.

## Embed checkout

The `LocusCheckout` component takes a session ID and renders the full checkout experience. Buyers can pay with their Locus Wallet, an external wallet, or an AI agent — all handled by the component.

```tsx
import { LocusCheckout } from '@withlocus/checkout-react';

function CheckoutPage({ sessionId }: { sessionId: string }) {
  return (
    <LocusCheckout
      sessionId={sessionId}
      mode="embedded"
      onSuccess={(data) => {
        console.log('Paid!', data.txHash);
        // redirect to your success page, fulfill the order, etc.
      }}
      onCancel={() => {
        console.log('Buyer cancelled');
      }}
      onError={(error) => {
        console.error('Checkout error:', error.message);
      }}
    />
  );
}
```

### Display modes

  ### embedded

    Renders an iframe inline in your page. Best for dedicated checkout pages. The iframe loads at `minHeight: 700px`.
  

  ### popup

    Opens checkout in a centered 450x650 popup window. Shows a branded loading placeholder in the parent. Calls `onCancel` if the popup is closed.
  

  ### redirect

    Navigates the browser to the hosted checkout page. Renders nothing. Simplest integration.
  

### `LocusCheckout` props

| Prop          | Type                                  | Required | Default                               | Description                                                                                                    |
| ------------- | ------------------------------------- | -------- | ------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `sessionId`   | `string`                              | Yes      | —                                     | The checkout session ID                                                                                        |
| `mode`        | `'embedded' \| 'popup' \| 'redirect'` | No       | `'embedded'`                          | How to display the checkout UI                                                                                 |
| `onSuccess`   | `(data: CheckoutSuccessData) => void` | No       | —                                     | Called when payment is confirmed. Receives the transaction hash, payer address, amount, and timestamps.        |
| `onCancel`    | `() => void`                          | No       | —                                     | Called when the buyer cancels, or when a popup is closed without completing payment                            |
| `onError`     | `(error: Error) => void`              | No       | —                                     | Called when an error occurs during checkout                                                                    |
| `checkoutUrl` | `string`                              | No       | `'https://checkout.paywithlocus.com'` | Override the hosted checkout URL. Must be `https:` or `http:`. Invalid URLs silently fall back to the default. |
| `style`       | `React.CSSProperties`                 | No       | —                                     | Inline styles applied to the wrapper `<div>`                                                                   |
| `className`   | `string`                              | No       | —                                     | CSS class applied to the wrapper `<div>`                                                                       |

### `CheckoutSuccessData`

The object passed to your `onSuccess` callback:

| Field          | Type     | Description                                |
| -------------- | -------- | ------------------------------------------ |
| `sessionId`    | `string` | The checkout session ID                    |
| `amount`       | `string` | Payment amount (e.g. `"25.00"`)            |
| `currency`     | `string` | Always `"USDC"`                            |
| `txHash`       | `string` | On-chain transaction hash                  |
| `payerAddress` | `string` | Wallet address that paid                   |
| `paidAt`       | `string` | ISO 8601 timestamp of payment confirmation |

### `CheckoutSession` type

Represents a checkout session's current state:

| Field                 | Type                                              | Description                         |
| --------------------- | ------------------------------------------------- | ----------------------------------- |
| `id`                  | `string`                                          | Session ID                          |
| `amount`              | `string`                                          | Payment amount in USDC              |
| `currency`            | `string`                                          | Always `"USDC"`                     |
| `description`         | `string?`                                         | Description shown to the buyer      |
| `status`              | `'PENDING' \| 'PAID' \| 'EXPIRED' \| 'CANCELLED'` | Current session status              |
| `expiresAt`           | `string`                                          | ISO 8601 expiration timestamp       |
| `sellerWalletAddress` | `string`                                          | Merchant's receiving wallet address |
| `paymentTxHash`       | `string?`                                         | On-chain tx hash (set when `PAID`)  |
| `paidAt`              | `string?`                                         | Payment timestamp (set when `PAID`) |

***

## Hook: `useLocusCheckout`

For more control over how you launch checkout, use the hook directly instead of the component.

```tsx
import { useLocusCheckout } from '@withlocus/checkout-react';

function PayButton({ sessionId }: { sessionId: string }) {
  const { openPopup, redirectToCheckout, getCheckoutUrl } = useLocusCheckout();

  return (
    <div>
      <button onClick={() => openPopup(sessionId)}>Pay in Popup</button>
      <button onClick={() => redirectToCheckout(sessionId)}>Pay (Redirect)</button>
      <a href={getCheckoutUrl(sessionId)}>Direct Link</a>
    </div>
  );
}
```

### Options

| Option        | Type     | Default                               |
| ------------- | -------- | ------------------------------------- |
| `checkoutUrl` | `string` | `'https://checkout.paywithlocus.com'` |

### Return values

| Method                          | Type             | Description                                         |
| ------------------------------- | ---------------- | --------------------------------------------------- |
| `getCheckoutUrl(sessionId)`     | `string`         | Returns the full checkout URL for a session         |
| `openPopup(sessionId)`          | `Window \| null` | Opens a centered 450x650 popup to the checkout page |
| `redirectToCheckout(sessionId)` | `void`           | Navigates the browser to the checkout page          |

All return values are stable across renders (wrapped in `useCallback`).

***

## Brand constants

The SDK exports Locus brand tokens for styling surrounding UI to match:

```typescript
import {
  LOCUS_BRAND_COLORS,
  LOCUS_CTA_GRADIENT,
  LOCUS_FONT_FAMILY,
} from '@withlocus/checkout-react';
```

  **`LOCUS_BRAND_COLORS`**

  | Key             | Value     |
  | --------------- | --------- |
  | `violetPrimary` | `#4101F6` |
  | `violetLight`   | `#5934FF` |
  | `violetSoft`    | `#F4F0FF` |
  | `violetMuted`   | `#E4DEFF` |
  | `textPrimary`   | `#1B1B1C` |
  | `border`        | `#DDDEE0` |
  | `borderStrong`  | `#C7C8CA` |
  | `surface`       | `#F4F4F6` |
  | `surfacePage`   | `#FDFDFD` |

  **`LOCUS_CTA_GRADIENT`**

  ```
  linear-gradient(180deg, #5934FF 0%, #4101F6 100%)
  ```

  **`LOCUS_FONT_FAMILY`**

  ```
  'Suisse Intl', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif
  ```

***

## PostMessage events

If you embed the checkout page in an iframe or popup manually (without the SDK), listen for these `postMessage` events from the checkout origin:

| Event type               | Payload               | Description       |
| ------------------------ | --------------------- | ----------------- |
| `locus:checkout:success` | `CheckoutSuccessData` | Payment confirmed |
| `locus:checkout:cancel`  | —                     | Buyer cancelled   |
| `locus:checkout:error`   | `{ message: string }` | Error occurred    |

***

## Webhooks

When a session is paid or expires, Locus sends a POST request to your webhook URL.

### Events

| Event                      | Trigger                              |
| -------------------------- | ------------------------------------ |
| `checkout.session.paid`    | Payment confirmed on-chain           |
| `checkout.session.expired` | Session TTL exceeded without payment |

### Payload

```json
{
  "event": "checkout.session.paid",
  "data": {
    "sessionId": "SESSION_ID",
    "amount": "25.00",
    "currency": "USDC",
    "paymentTxHash": "0x...",
    "payerAddress": "0x...",
    "paidAt": "2026-03-01T12:00:00.000Z",
    "metadata": { "userId": "usr_123", "plan": "pro" }
  },
  "timestamp": "2026-03-01T12:00:01.000Z"
}
```

### Headers

| Header            | Description                                    |
| ----------------- | ---------------------------------------------- |
| `X-Signature-256` | `sha256={hmac}` — HMAC-SHA256 of the JSON body |
| `X-Webhook-Event` | Event name (e.g. `checkout.session.paid`)      |
| `X-Session-Id`    | The session ID                                 |

### Signature verification

Every webhook includes an `X-Signature-256` header. The webhook secret (starts with `whsec_`) is returned when you create a session with a webhook URL. Verify it to ensure the request came from Locus.

```typescript
import crypto from 'crypto';

function verifyWebhook(payload: string, signature: string, secret: string): boolean {
  const expected = 'sha256=' + crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expected),
  );
}
```

  Always verify the webhook signature before fulfilling orders.

***

## Merchant dashboard

Manage sessions, view analytics, and track purchases from the [Locus dashboard](https://app.paywithlocus.com).

### Checkout instances

Group sessions by integration point using an instance ID. Each instance tracks its own revenue, session count, and conversion rate. Instances are auto-created on first use.

  

### Analytics

Four stats filterable by time range (7d / 30d / 90d / all time) and by instance:

* **Total Revenue** — sum of USDC across paid sessions
* **Total Sessions** — count with paid/expired breakdown
* **Conversion Rate** — paid / total sessions
* **Payment Methods** — breakdown of Locus Wallet, External Wallet, and Agent payments

  

### Recent sessions

A paginated table of checkout sessions filterable by status (PAID, PENDING, EXPIRED, CANCELLED). Shows session ID, amount, status, payment method, and creation time.

  

### Purchases

The buyer-side view. Shows purchases made via any Locus checkout session, with expandable rows showing full receipt details (seller info, line items, tax, on-chain transaction link).

  

---

# Buyer & Agent Guide

> How buyers and AI agents pay through Locus Checkout

Locus Checkout gives buyers three ways to pay. Humans can use their Locus Wallet or an external wallet directly on the checkout page. AI agents can pay programmatically — just send them the checkout URL.

## Paying with Locus Wallet

The fastest option. Buyers with a Locus account pay in one click — no wallet popups, no gas fees.

  
    The checkout page prompts the buyer to log in or auto-detects an existing session.
  

  
    Locus routes the payment through the buyer's smart wallet. Gas is sponsored.
  

  
    The checkout page shows a success screen with the transaction hash.
  

  

## Paying with an external wallet

Buyers can connect MetaMask, Coinbase Wallet, or any WalletConnect-compatible wallet to pay on Base.

  
    The checkout page connects the buyer's wallet via WalletConnect.
  

  
    The buyer approves USDC spending for the [Payment Router](/checkout/payment-router) contract.
  

  
    The buyer signs the payment transaction. The Payment Router transfers USDC to the seller and emits an on-chain event.
  

  
    Locus detects the event and marks the session as paid.
  

  

## Paying with an AI agent

AI agents with Locus can pay checkout sessions programmatically. Agents can also create their own sessions — they don't need a pre-made checkout URL.

### How it works

  
    Just describe the purchase. Your agent handles the rest:

    > Buy headphones from TechMart for \$25

    If the merchant gave you a checkout page URL, you can pass that too — the agent will navigate to it and the page will tell it everything it needs.
  

  
    If the agent doesn't already have a checkout session, it creates one through Locus. Session IDs are auto-generated by Locus — the agent just specifies the amount and details.
  

  
    The agent submits payment using its Locus API key, polls for on-chain confirmation, and reports back with the transaction hash.
  

  

  Checkout pages are self-describing. They include structured data (JSON and `data-*` attributes) so any agent — even one that has never seen Locus before — can navigate to a checkout URL, parse the page, and pay.

### Setting up your agent with Locus

If your agent doesn't have Locus yet, setup is one line:

```
Read https://paywithlocus.com/SKILL.md and follow the instructions to set up Locus
```

The [SKILL.md](https://paywithlocus.com/skill.md) walks your agent through saving your API key and learning the Locus platform, including how to pay checkout sessions. The checkout-specific details are in [CHECKOUT.md](https://paywithlocus.com/checkout.md). See the [Quickstart](/quickstart) for more.

### Policy guardrails

Agent payments are subject to limits you configure in the [Locus dashboard](https://app.paywithlocus.com):

| Guardrail                | Behavior                                                                                                                                 |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| **Allowance**            | Max total USDC the agent can spend. Payment is rejected if exceeded.                                                                     |
| **Max transaction size** | Cap per single payment. Payment is rejected if exceeded.                                                                                 |
| **Approval threshold**   | Payments above this amount need your approval. The agent gets a link to send you — once you approve, the payment executes automatically. |

  

### Common scenarios

| Scenario             | What happens                                                              |
| -------------------- | ------------------------------------------------------------------------- |
| Insufficient balance | Agent can't pay — fund the wallet with USDC from the dashboard            |
| Session expired      | The session timed out — ask the merchant for a new link                   |
| Session already paid | Another buyer paid first — no action needed                               |
| Policy limit hit     | Agent tells you a guardrail was exceeded — adjust limits in the dashboard |
| Approval required    | Agent sends you an approval link — click it to authorize the payment      |

---

# Payment Router

> On-chain contract for external wallet checkout payments

The Payment Router is a smart contract on Base that processes external wallet payments for Locus Checkout. When a buyer pays with MetaMask, Coinbase Wallet, or any other external wallet, the payment goes through this contract.

## Why it exists

The Payment Router serves two purposes:

* **Instant detection** — The contract emits a `CheckoutPayment` event with the session ID, so Locus detects payments immediately without scanning all USDC transfers.
* **Session binding** — Each payment is tied to a specific checkout session on-chain, creating a verifiable link between the payment and the order.

## Contract addresses

### Payment Router

| Network                | Chain ID | Address                                      |
| ---------------------- | -------- | -------------------------------------------- |
| Base (mainnet)         | 8453     | `0x34184b7bCB4E6519C392467402DB8a853EF57806` |
| Base Sepolia (testnet) | 84532    | Not yet deployed                             |

### USDC

| Network                | Chain ID | Address                                      |
| ---------------------- | -------- | -------------------------------------------- |
| Base (mainnet)         | 8453     | `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913` |
| Base Sepolia (testnet) | 84532    | `0x036CbD53842c5426634e7929541eC2318f3dCF7e` |

## How external wallet payments work

External wallet payments require two transactions from the buyer:

  
    The buyer approves the Payment Router to transfer the exact payment amount of USDC on their behalf.
  

  
    The buyer calls `pay()` with the session ID, seller address, and amount. The contract transfers USDC from the buyer to the seller and emits a `CheckoutPayment` event.
  

  
    Locus listens for `CheckoutPayment` events and automatically marks the corresponding checkout session as PAID. The merchant receives a webhook.
  

  The checkout page handles both transactions automatically — the buyer just connects their wallet and clicks "Pay". The approve + pay steps are presented as a guided flow.

## Contract interface

  ```solidity
  interface IPaymentRouter {
      /// @notice Pay for a checkout session
      function pay(
          bytes32 sessionId,
          address recipient,
          uint256 amount
      ) external;

      /// @notice Pay using EIP-2612 permit (approve + pay in one transaction)
      function payWithPermit(
          bytes32 sessionId,
          address recipient,
          uint256 amount,
          uint256 deadline,
          uint8 v,
          bytes32 r,
          bytes32 s
      ) external;

      /// @notice Check if a session has already been paid on-chain
      function sessionPaid(bytes32 sessionId) external view returns (bool);

      /// @notice Get the USDC token address used by this router
      function usdc() external view returns (address);

      /// @notice Emitted on every successful payment
      event CheckoutPayment(
          bytes32 indexed sessionId,
          address indexed from,
          address indexed to,
          uint256 amount
      );

      error InvalidRecipient();
      error InvalidRecipientAddress();
      error InvalidAmount();
      error InvalidSessionId();
      error SessionAlreadyPaid();
  }
  ```

### Session ID encoding

The `sessionId` parameter is a `bytes32` encoding of the checkout session UUID. The encoding is: remove dashes from the UUID hex string, left-align, and zero-pad to 32 bytes.

```
UUID:    a1b2c3d4-e5f6-7890-abcd-ef1234567890
bytes32: 0xa1b2c3d4e5f67890abcdef123456789000000000000000000000000000000000
```

### USDC amounts

USDC has 6 decimals. Amounts are in base units: `$25.00` = `25000000`.

## Verify on BaseScan

You can verify any checkout payment on BaseScan:

  
    Go to the [Payment Router on BaseScan](https://basescan.org/address/0x34184b7bCB4E6519C392467402DB8a853EF57806).
  

  
    Click the **Events** tab. Look for `CheckoutPayment` events — each one shows the `sessionId`, `from` (buyer), `to` (seller), and `amount`.
  

  
    Under the **Read Contract** tab, call `sessionPaid(bytes32)` with the encoded session ID. Returns `true` if the session has been paid on-chain.
  


---

# Technical Agent Skill Protocols


# Locus Documentation Context - ABSOLUTE COMPLETION

The definitive payment infrastructure guide for AI agents. This document consolidates both the high-level portal documentation and the low-level technical skill protocols.

Generated on: 2024-04-20
Sources: 
- https://docs.paywithlocus.com/
- https://beta.paywithlocus.com/skill.md (and referenced guides)

---

## Table of Contents
1. [Core Introduction & Quick Start](#core-introduction)
2. [Beta & Hackathon Program](#beta--hackathon)
3. [Protocol Deep-Dives (Wallet/MPP/x402)](#protocol-deep-dives)
4. [Agent Skill Guides (Technical)](#agent-skill-guides)
   - [Onboarding & Credential Exchange](#onboarding)
   - [AgentMail (Autonomous Email)](#agentmail)
   - [Laso Finance (Virtual Cards & Payments)](#laso-finance)
   - [Autonomous Checkout](#checkout-technical)
   - [Heartbeat & Maintenance](#heartbeat)
5. [API & Service Catalogs](#api--service-catalogs)
   - [Wrapped APIs Index (Proxy APIs)](#wapi)
   - [Provider Details (Firecrawl, Gemini, OpenAI)](#wapi-details)
   - [MPP Service Index](#mpp)
6. [Build & Infrastructure Guide](#build--infrastructure)

---

## 1. Core Introduction
Locus provides payment infrastructure for AI agents on the Base network. It enables agents to manage one USDC balance for use across wallets, global APIs, deployments, and checkouts.

**Key Values:**
- **Sovereignty:** Agents use permissioned keys to sign transactions autonomously.
- **Gasless:** All transactions are gasless.
- **One Balance:** Fund one Locus account to pay for dozens of third-party services.

---

## 2. Beta & Hackathon Program

### Beta environment
- **Home:** `beta.paywithlocus.com`
- **API:** `beta-api.paywithlocus.com/api`
- **Self-Registration:** Agents can register without a pre-existing user account.

### Hackathon — Paygentic
Locus hosts weekly hackathon tracks for agentic builders. Prizes include cash and YC mentorship.

---

## 3. Protocol Deep-Dives

### Locus Smart Wallet (ERC-4337)
- **Permissioned Keys:** Allow agents to act within pre-defined boundaries (allowance, max tx size).
- **Subwallets:** Ephemeral wallets used for escrow and email sends.

### Machine Payments Protocol (MPP) / Tempo Chain
A low-latency protocol for real-time asset settlement. No pre-funding individual accounts needed for participating services.

### x402 (HTTP 402 Payment Required)
Autonomous agents settle payment challenges on-chain to unlock API responses.

---

## 4. Agent Skill Guides (Technical)

### Onboarding
The onboarding protocol handles the initial handshake between a new agent and Locus.
- **Goal:** Exchange an initial payment for persistent credentials.
- **Protocol:** Agent generates a session key, pays the onboarding fee via x402, and receives a `credentials.json` block including the `claw_` API key and `wallet_address`.

### AgentMail
Autonomous email inboxes for agents.
- **Endpoint:** `POST /api/x402/agentmail-<action>`
- **Features:** Create inbox (`xxx@agentmail.to`), list messages, reply to threads.
- **Cost:** ~$2.00 to create, ~$0.01 per send/reply.

### Laso Finance
Legacy payment bridge for virtual cards and US-based transfers.
- **Endpoints:** Paid x402 endpoints for card ordering; free endpoints at `laso.finance` for polling status.
- **Cards:** Non-reloadable virtual debit cards. Order the exact amount needed.
- **Payments:** Supports Venmo and PayPal settlement via agent API.

### Autonomous Checkout
Enables agents to navigate merchant checkouts.
- **Preflight:** Verify session payability.
- **Pay:** Execute settlement via the Locus Payment Router.
- **Poll:** Monitor on-chain confirmation.

### Heartbeat
A maintenance protocol for long-running agents.
- **Schedule:** Check every 30 minutes.
- **Actions:** Sync balance, verify spending policies, submit operational feedback, and update technical guides.

---

## 5. API & Service Catalogs

### Wrapped APIs (WAPI)
A curated proxy for popular APIs billed in USDC.
- **Format:** `POST /api/wrapped/<provider>/<endpoint>`
- **Firecrawl:** Website Scraping/Crawl.
- **Gemini:** Vision, Chat, Document analysis.
- **OpenAI:** GPT-4, DALL-E, Embeddings.

### MPP Services
Directly accessible services using the Machine Payments Protocol on Tempo. No Locus account required for the agent to call these if they have native Tempo assets.

---

## 6. Build & Infrastructure Guide
Locus allows developers to host their agents and services directly.
- **Deploy:** `git push locus main`
- **Managed Addons:** Postgres, Redis, Vector DBs.
- **Wiring:** Automatic injection of `LOCUS_API_KEY` and wallet context into hosted services.

---

*Document compiled from full site-map crawl of Locus Documentation Portal and Beta Technical Manifest.*

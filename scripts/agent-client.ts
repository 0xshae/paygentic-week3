/**
 * 🤖 Agentic Checkout — Demo Agent Client
 *
 * This script simulates an AI agent hitting the /checkout endpoint.
 * It demonstrates the full x402 payment flow:
 *
 *   1. Agent requests GET /checkout
 *   2. Server returns 402 Payment Required
 *   3. x402 client automatically signs payment + retries
 *   4. Server returns 200 + product payload
 *
 * Usage:
 *   EVM_PRIVATE_KEY=0x... npx tsx scripts/agent-client.ts
 *
 * Prerequisites:
 *   - Server running at GATEWAY_URL (default: http://localhost:4021)
 *   - Wallet funded with testnet USDC on Base Sepolia
 *   - Get testnet funds: https://docs.cdp.coinbase.com/faucets/introduction/quickstart
 */

import { x402Client, wrapFetchWithPayment, x402HTTPClient } from "@x402/fetch";
import { registerExactEvmScheme } from "@x402/evm/exact/client";
import { privateKeyToAccount } from "viem/accounts";

// ── Config ──────────────────────────────────────────
const GATEWAY_URL = process.env.GATEWAY_URL || "http://localhost:4021";
const PRIVATE_KEY = process.env.EVM_PRIVATE_KEY as `0x${string}`;

if (!PRIVATE_KEY) {
  console.error("❌ Missing EVM_PRIVATE_KEY environment variable");
  console.error("   Usage: EVM_PRIVATE_KEY=0x... npx tsx scripts/agent-client.ts");
  process.exit(1);
}

async function main() {
  console.log(`
╔══════════════════════════════════════════════════╗
║  🤖  AGENTIC CLIENT — Demo Agent                ║
║──────────────────────────────────────────────────║
║  Gateway: ${GATEWAY_URL.padEnd(38)}║
╚══════════════════════════════════════════════════╝
  `);

  // ── Step 1: Create wallet signer ──────────────────
  const signer = privateKeyToAccount(PRIVATE_KEY);
  console.log(`🔑 Agent wallet: ${signer.address}`);

  // ── Step 2: Create x402 client ────────────────────
  const client = new x402Client();
  registerExactEvmScheme(client, { signer });

  // Wrap fetch with automatic payment handling
  const fetchWithPayment = wrapFetchWithPayment(fetch, client);

  // ── Step 3: Hit the gateway ───────────────────────
  console.log(`\n📡 Requesting: GET ${GATEWAY_URL}/checkout`);
  console.log("   (x402 will handle 402 → payment → retry automatically)\n");

  try {
    const response = await fetchWithPayment(`${GATEWAY_URL}/checkout`, {
      method: "GET",
      headers: {
        "x-agent-id": `demo-agent-${signer.address.slice(0, 8)}`,
      },
    });

    const body = await response.json();

    if (response.ok) {
      console.log("✅ Checkout successful!\n");
      console.log("📦 Product:", JSON.stringify(body.product, null, 2));
      console.log("💳 Transaction:", JSON.stringify(body.transaction, null, 2));

      // Check for payment receipt in headers
      const httpClient = new x402HTTPClient(client);
      const paymentResponse = httpClient.getPaymentSettleResponse(
        (name) => response.headers.get(name)
      );
      if (paymentResponse) {
        console.log("🧾 Payment receipt:", JSON.stringify(paymentResponse, null, 2));
      }

      // Show revoke URL if short_code exists
      if (body.transaction?.short_code) {
        console.log(`\n🔗 Revoke URL: ${GATEWAY_URL}/revoke?code=${body.transaction.short_code}`);
      }
    } else {
      console.log(`❌ Request failed with status ${response.status}`);
      console.log("   Response:", JSON.stringify(body, null, 2));
    }
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

main().catch(console.error);

/**
 * 🤖 Agentic Checkout — Demo Agent Client
 *
 * Simulates an AI agent purchasing premium data through the gateway.
 * Demonstrates the full x402 payment flow with live polling and revocation.
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
  // ── Step 1: Create wallet signer ──────────────────
  const signer = privateKeyToAccount(PRIVATE_KEY);

  console.log(`
╔══════════════════════════════════════════════════════════╗
║  🤖  AGENTIC GATEWAY — Agent Client                     ║
║──────────────────────────────────────────────────────────║
║  Gateway:   ${GATEWAY_URL.padEnd(44)}║
║  Wallet:    ${signer.address.padEnd(44)}║
║  Network:   Base Sepolia (eip155:84532)                  ║
║  Payment:   USDC via x402 protocol                       ║
╚══════════════════════════════════════════════════════════╝
  `);

  // ── Step 2: Create x402 client ────────────────────
  console.log("⏳ Step 1/3 — Initializing x402 payment client...");
  const client = new x402Client();
  registerExactEvmScheme(client, { signer });
  const fetchWithPayment = wrapFetchWithPayment(fetch, client);
  console.log("✅ Payment client ready.\n");

  // ── Step 3: Hit the gateway ───────────────────────
  console.log("⏳ Step 2/3 — Requesting access via GET /checkout...");
  console.log("   → Server will challenge with HTTP 402 Payment Required");
  console.log("   → x402 client will auto-sign USDC payment on Base Sepolia");
  console.log("   → Facilitator settles payment on-chain\n");

  let shortCode: string;

  try {
    const headers: Record<string, string> = {
      "x-agent-id": `demo-agent-${signer.address.slice(0, 8)}`,
    };

    const response = await fetchWithPayment(`${GATEWAY_URL}/checkout`, {
      method: "GET",
      headers,
    });

    const body = await response.json();

    if (response.ok) {
      console.log("✅ Payment settled on-chain! Transaction complete.\n");
      console.log("📦 Transaction Receipt:");
      console.log(`   Short Code:  ${body.transaction?.short_code}`);
      console.log(`   Amount:      ${body.transaction?.amount} ${body.transaction?.currency}`);
      console.log(`   Network:     ${body.transaction?.network}`);
      console.log(`   Status:      ${body.status}`);

      shortCode = body.transaction?.short_code;
      if (!shortCode) {
        throw new Error("No short_code returned from checkout");
      }

      // Explorer link
      console.log(`\n🔍 View on Explorer: https://sepolia.basescan.org/address/${signer.address}`);
      console.log(`🔗 Revoke URL:       ${GATEWAY_URL}/revoke?code=${shortCode}`);
    } else {
      console.log(`❌ Request failed with status ${response.status}`);
      console.log("   Response:", JSON.stringify(body, null, 2));
      return;
    }
  } catch (error) {
    console.error("❌ Error during checkout:", error);
    return;
  }

  // ── Step 4: Poll Premium Data ──────────────────────
  console.log(`\n⏳ Step 3/3 — Polling /premium-data every 3s with Bearer token...`);
  console.log(`   ┌─────────────────────────────────────────────────────┐`);
  console.log(`   │  💡 Open the Dashboard to revoke this agent live!  │`);
  console.log(`   │     ${GATEWAY_URL.padEnd(47)}│`);
  console.log(`   └─────────────────────────────────────────────────────┘\n`);

  setInterval(async () => {
    try {
      const res = await fetch(`${GATEWAY_URL}/premium-data`, {
        headers: {
          Authorization: `Bearer ${shortCode}`
        }
      });
      const data = await res.json();
      
      if (res.ok) {
        process.stdout.write(`  ✅ [${new Date().toLocaleTimeString()}] Data fetched — ${data.data.metrics}\n`);
      } else if (res.status === 403) {
        console.error(`\n  ╔══════════════════════════════════════════════════╗`);
        console.error(`  ║  🚫  403 FORBIDDEN                               ║`);
        console.error(`  ║  Access revoked by human owner!                  ║`);
        console.error(`  ║  Server: ${(data.error || "").slice(0, 39).padEnd(39)}║`);
        console.error(`  ╚══════════════════════════════════════════════════╝\n`);
        process.exit(1);
      } else {
        console.error(`  ⚠️  Unexpected status: ${res.status}`, data);
      }
    } catch (e: any) {
      console.error(`  ❌ Fetch error:`, e.message);
    }
  }, 3000);
}

main().catch(console.error);

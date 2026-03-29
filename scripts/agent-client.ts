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
  console.error("   Usage: EVM_PRIVATE_KEY=0x... npx tsx scripts/agent-client.ts [--human]");
  process.exit(1);
}

// Check for --human flag
const isHuman = process.argv.includes("--human");

async function main() {
  console.log(`
╔══════════════════════════════════════════════════╗
║  🤖  AGENTIC CLIENT — Demo Agent                ║
║──────────────────────────────────────────────────║
║  Gateway: ${GATEWAY_URL.padEnd(38)}║
║  Mode:    ${(isHuman ? "Human 👤 (Discount)" : "Bot 🤖 (Full Price)").padEnd(38)}║
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

  let shortCode: string;

  try {
    const headers: Record<string, string> = {
      "x-agent-id": `demo-agent-${signer.address.slice(0, 8)}`,
    };

    if (isHuman) {
      console.log("ℹ️  Note: To use the 99% human discount, this wallet must be registered!");
      console.log("   Run: npx @worldcoin/agentkit-cli register " + signer.address + "\\n");
    }

    const response = await fetchWithPayment(`${GATEWAY_URL}/checkout`, {
      method: "GET",
      headers,
    });

    const body = await response.json();

    if (response.ok) {
      console.log("✅ Checkout successful! Transaction settled.\n");
      console.log("💳 Transaction:", JSON.stringify(body.transaction, null, 2));

      shortCode = body.transaction?.short_code;
      if (!shortCode) {
        throw new Error("No short_code returned from checkout");
      }

      // Show revoke URL if short_code exists
      console.log(`\n🔗 Revoke URL: ${GATEWAY_URL}/revoke?code=${shortCode}\n`);
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
  console.log(`\n🔄 Polling GET ${GATEWAY_URL}/premium-data with Bearer ${shortCode}...`);
  console.log(`   (Hit the Revoke URL above to instantly kill this agent!)`);

  setInterval(async () => {
    try {
      const res = await fetch(`${GATEWAY_URL}/premium-data`, {
        headers: {
          Authorization: `Bearer ${shortCode}`
        }
      });
      const data = await res.json();
      
      if (res.ok) {
        process.stdout.write(`✅ [${new Date().toISOString()}] Data fetched! Metrics: ${data.data.metrics}\n`);
      } else if (res.status === 403) {
        console.error(`\n🚫 [403 FORBIDDEN] Access revoked by human owner!\n   Server message: ${data.error}\n`);
        process.exit(1);
      } else {
        console.error(`\n⚠️ Unexpected status: ${res.status}`, data);
      }
    } catch (e: any) {
      console.error(`\n❌ Fetch error:`, e.message);
    }
  }, 3000);
}

main().catch(console.error);

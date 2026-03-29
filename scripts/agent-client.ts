/**
 * 🤖 Glide — Demo Agent Client
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
 *   - Get testnet USDC: https://faucet.circle.com  (select Base Sepolia)
 */

import { x402Client, wrapFetchWithPayment, x402HTTPClient } from "@x402/fetch";
import { registerExactEvmScheme } from "@x402/evm/exact/client";
import { privateKeyToAccount } from "viem/accounts";
import { createPublicClient, http, formatUnits } from "viem";
import { baseSepolia } from "viem/chains";

// ── Config ──────────────────────────────────────────
const GATEWAY_URL = process.env.GATEWAY_URL || "http://localhost:4021";
const PRIVATE_KEY = process.env.EVM_PRIVATE_KEY as `0x${string}`;
const USDC_ADDRESS = "0x036CbD53842c5426634e7929541eC2318f3dCF7e" as const;

if (!PRIVATE_KEY) {
  console.error("❌ Missing EVM_PRIVATE_KEY environment variable");
  console.error("   Usage: EVM_PRIVATE_KEY=0x... npx tsx scripts/agent-client.ts");
  process.exit(1);
}

// ── Helper: Check USDC balance ──────────────────────
async function checkUSDCBalance(address: string): Promise<bigint> {
  const client = createPublicClient({
    chain: baseSepolia,
    transport: http(),
  });

  const balance = await client.readContract({
    address: USDC_ADDRESS,
    abi: [
      {
        name: "balanceOf",
        type: "function",
        stateMutability: "view",
        inputs: [{ name: "account", type: "address" }],
        outputs: [{ name: "", type: "uint256" }],
      },
    ] as const,
    functionName: "balanceOf",
    args: [address as `0x${string}`],
  });

  return balance;
}

async function main() {
  // ── Step 1: Create wallet signer ──────────────────
  const signer = privateKeyToAccount(PRIVATE_KEY);

  console.log(`
╔══════════════════════════════════════════════════════════╗
║  🤖  GLIDE GATEWAY — Agent Client                       ║
║──────────────────────────────────────────────────────────║
║  Gateway:   ${GATEWAY_URL.padEnd(44)}║
║  Wallet:    ${signer.address.padEnd(44)}║
║  Network:   Base Sepolia (eip155:84532)                  ║
║  Payment:   USDC via x402 protocol                       ║
╚══════════════════════════════════════════════════════════╝
  `);

  // ── Pre-flight: Check USDC balance ────────────────
  console.log("⏳ Pre-flight — Checking USDC balance on Base Sepolia...");
  try {
    const balance = await checkUSDCBalance(signer.address);
    const formatted = formatUnits(balance, 6);
    console.log(`   💰 Balance: ${formatted} USDC`);

    if (balance === 0n) {
      console.error(`
  ╔══════════════════════════════════════════════════════════╗
  ║  ❌  INSUFFICIENT FUNDS                                  ║
  ║──────────────────────────────────────────────────────────║
  ║  Your agent wallet has 0 USDC on Base Sepolia.           ║
  ║                                                          ║
  ║  To fund your wallet:                                    ║
  ║  1. Go to https://faucet.circle.com                      ║
  ║  2. Select "Base Sepolia" network                        ║
  ║  3. Paste: ${signer.address.slice(0, 42).padEnd(42)}    ║
  ║  4. Request testnet USDC                                 ║
  ║                                                          ║
  ║  You need at least $1.00 USDC to make a payment.         ║
  ╚══════════════════════════════════════════════════════════╝
      `);
      process.exit(1);
    }

    if (balance < 1_000_000n) {
      console.warn(`   ⚠️  Balance below $1.00 — payment may fail!\n`);
    } else {
      console.log(`   ✅ Sufficient funds for payment.\n`);
    }
  } catch (e: any) {
    console.warn(`   ⚠️  Could not check balance: ${e.message}\n`);
  }

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
    } else if (response.status === 402) {
      console.error(`❌ Payment failed! The x402 client could not settle the payment.`);
      console.error(`   This usually means your wallet has insufficient USDC.`);
      console.error(`   Fund your wallet at: https://faucet.circle.com (Base Sepolia)`);
      console.error(`   Wallet: ${signer.address}`);
      return;
    } else {
      console.log(`❌ Request failed with status ${response.status}`);
      console.log("   Response:", JSON.stringify(body, null, 2));
      return;
    }
  } catch (error: any) {
    console.error("❌ Error during checkout:", error.message || error);
    if (error.message?.includes("payment")) {
      console.error("   → This likely means your wallet needs USDC on Base Sepolia.");
      console.error("   → Get testnet USDC: https://faucet.circle.com");
    }
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

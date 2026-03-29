/**
 * 🤖 DEMO TIER 1: The Bot
 * 
 * Flow:
 * 1. Agent calls GET /checkout with NO World ID
 * 2. Gets HTTP 402 Payment Required for $1.00 USDC
 * 3. x402 client signs real USDC transaction on Base Sepolia
 * 4. Gets short_code token -> fetches premium data
 */

import { x402Client, wrapFetchWithPayment } from "@x402/fetch";
import { registerExactEvmScheme } from "@x402/evm/exact/client";
import { privateKeyToAccount } from "viem/accounts";
import { createPublicClient, http, formatUnits } from "viem";
import { baseSepolia } from "viem/chains";

const GATEWAY_URL = process.env.GATEWAY_URL || "http://localhost:4021";
const PRIVATE_KEY = process.env.EVM_PRIVATE_KEY as `0x${string}`;
const USDC_ADDRESS = "0x036CbD53842c5426634e7929541eC2318f3dCF7e" as const;

if (!PRIVATE_KEY) {
  console.error("❌ Missing EVM_PRIVATE_KEY");
  process.exit(1);
}

async function checkUSDCBalance(address: string) {
  const client = createPublicClient({ chain: baseSepolia, transport: http() });
  return client.readContract({
    address: USDC_ADDRESS,
    abi: [{ name: "balanceOf", type: "function", stateMutability: "view", inputs: [{ name: "account", type: "address" }], outputs: [{ name: "", type: "uint256" }] }] as const,
    functionName: "balanceOf",
    args: [address as `0x${string}`],
  });
}

async function main() {
  const signer = privateKeyToAccount(PRIVATE_KEY);
  console.log(`\n🤖 TIER 1: THE BOT`);
  console.log(`Wallet: ${signer.address}`);

  const bal = await checkUSDCBalance(signer.address);
  if (bal < 1_000_000n) {
    console.error(`\n❌ INSUFFICIENT FUNDS. You need at least 1.00 USDC on Base Sepolia.`);
    console.error(`Get funds here: https://faucet.circle.com`);
    process.exit(1);
  }
  console.log(`Balance: ${formatUnits(bal, 6)} USDC - Ready.\n`);

  const client = new x402Client();
  registerExactEvmScheme(client, { signer });
  const fetchWithPayment = wrapFetchWithPayment(fetch, client);

  console.log("⏳ Hitting GET /checkout (Bot Tax = $1.00)...");
  
  try {
    const res = await fetchWithPayment(`${GATEWAY_URL}/checkout`, {
      method: "GET",
      headers: { "x-agent-id": `bot-${signer.address.slice(0, 6)}` },
    });
    
    if (res.ok) {
      const data = await res.json();
      console.log(`✅ Payment settled on-chain!`);
      console.log(`🔗 Transaction Explorer: https://sepolia.basescan.org/address/${signer.address}#tokentxns`);
      console.log(`🔑 Received short_code: ${data.transaction.short_code}\n`);
      
      console.log(`⏳ Fetching /premium-data with Bearer token...`);
      const dataRes = await fetch(`${GATEWAY_URL}/premium-data`, {
        headers: { Authorization: `Bearer ${data.transaction.short_code}` }
      });
      console.log(`✅ Success: ${(await dataRes.json()).data.metrics}`);
    } else {
      console.error(`❌ Request failed: ${res.status}`);
    }
  } catch (e: any) {
    console.error(`❌ Error: ${e.message}`);
  }
}

main().catch(console.error);

export {};

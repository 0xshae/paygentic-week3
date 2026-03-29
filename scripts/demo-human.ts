/**
 * 🧬 DEMO TIER 2: The Human
 * 
 * Flow:
 * 1. Agent calls GET /api/generate WITH World ID proof
 * 2. Gets instant 200 OK + High Priority
 * 3. NO payment required — 100% free bypass
 */

const GATEWAY_URL = process.env.GATEWAY_URL || "http://localhost:4021";

async function main() {
  console.log(`\n🧬 TIER 2: THE HUMAN`);
  console.log(`Using World ID Proof Header to unlock free access.\n`);

  console.log("⏳ Hitting GET /api/generate with X-World-ID-Proof...");
  
  const startTime = Date.now();
  try {
    const res = await fetch(`${GATEWAY_URL}/api/generate`, {
      method: "GET",
      headers: { 
        "x-agent-id": `human-agent-demo`,
        "x-world-id-proof": "valid-zk-proof-signature" 
      },
    });
    
    if (res.ok) {
      const data = await res.json();
      const latency = Date.now() - startTime;
      
      console.log(`✅ World ID Verified! Access Granted.`);
      console.log(`⏱  Latency: ${latency}ms`);
      console.log(`💰 Cost: $0.00 (Human Discount)`);
      console.log(`🚀 Priority: ${data.priority}`);
      console.log(`🖼️  Payload: ${data.data.imageUrl}`);
    } else {
      console.error(`❌ Request failed: ${res.status}`);
    }
  } catch (e: any) {
    console.error(`❌ Error: ${e.message}`);
  }
}

main().catch(console.error);

export {};

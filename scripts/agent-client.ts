/**
 * 🤖 Glide — 3-Tier Demo Script
 *
 * Demonstrates the core value proposition:
 *   "Same API. Same request. The only difference is whether it's backed by a real human."
 *
 * Step 1: Bot         → slow + expensive (no World ID)
 * Step 2: Human       → fast + free (World ID verified)
 * Step 3: Premium     → instant + premium (World ID + payment)
 *
 * Usage:
 *   npx tsx scripts/agent-client.ts
 *
 * Prerequisites:
 *   - Server running at GATEWAY_URL (default: http://localhost:4021)
 */

const GATEWAY_URL = process.env.GATEWAY_URL || "http://localhost:4021";

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  console.log(`
╔══════════════════════════════════════════════════════════╗
║  ✦  GLIDE — Human-Aware API Gateway Demo                ║
║──────────────────────────────────────────────────────────║
║  Endpoint:  ${(GATEWAY_URL + "/api/generate").padEnd(44)}║
║  Demo:      3-Tier Access Gradient                       ║
║                                                          ║
║  "Same API. Same request.                                ║
║   The only difference is proof of humanity."             ║
╚══════════════════════════════════════════════════════════╝
  `);

  await sleep(1000);

  // ─────────────────────────────────────────────
  //  STEP 1: "The Bot" — No World ID
  // ─────────────────────────────────────────────
  console.log("━".repeat(60));
  console.log("  🤖  STEP 1: The Bot");
  console.log("  An agent hitting the API without proof of humanity.");
  console.log("━".repeat(60));
  console.log();

  const t1 = Date.now();
  console.log("  ⏳ Calling GET /api/generate (no World ID)...");

  try {
    const res1 = await fetch(`${GATEWAY_URL}/api/generate`, {
      headers: { "x-agent-id": "demo-bot-001" },
    });
    const data1 = await res1.json();
    const latency1 = Date.now() - t1;

    console.log(`  ⏱  Response time: ${latency1}ms`);
    console.log(`  📊 Tier:     ${data1.tier}`);
    console.log(`  📊 Priority: ${data1.priority}`);
    console.log(`  📊 Verified: ${data1.verified}`);
    console.log(`  📊 Quality:  ${data1.data?.quality}`);
    console.log(`  💬 "${data1.message}"`);
    console.log();
    console.log(`  Result: SLOW (${latency1}ms) + LOW PRIORITY`);
  } catch (e: any) {
    console.error(`  ❌ Error: ${e.message}`);
  }

  await sleep(2000);
  console.log();

  // ─────────────────────────────────────────────
  //  STEP 2: "The Human" — World ID Verified
  // ─────────────────────────────────────────────
  console.log("━".repeat(60));
  console.log("  🧬  STEP 2: The Human-Backed Agent");
  console.log("  Same agent — but now backed by World ID.");
  console.log("━".repeat(60));
  console.log();

  const t2 = Date.now();
  console.log("  ⏳ Calling GET /api/generate (with X-World-ID-Proof)...");

  try {
    const res2 = await fetch(`${GATEWAY_URL}/api/generate`, {
      headers: {
        "x-agent-id": "demo-human-001",
        "x-world-id-proof": "verified-human-zkproof-demo",
      },
    });
    const data2 = await res2.json();
    const latency2 = Date.now() - t2;

    console.log(`  ⏱  Response time: ${latency2}ms`);
    console.log(`  📊 Tier:       ${data2.tier}`);
    console.log(`  📊 Priority:   ${data2.priority}`);
    console.log(`  📊 Verified:   ${data2.verified}`);
    console.log(`  📊 Quality:    ${data2.data?.quality}`);
    console.log(`  📊 Resolution: ${data2.data?.resolution}`);
    console.log(`  💬 "${data2.message}"`);
    console.log();
    console.log(`  Result: FAST (${latency2}ms) + FREE + HIGH PRIORITY`);
  } catch (e: any) {
    console.error(`  ❌ Error: ${e.message}`);
  }

  await sleep(2000);
  console.log();

  // ─────────────────────────────────────────────
  //  STEP 3: "Premium" — World ID + Payment
  // ─────────────────────────────────────────────
  console.log("━".repeat(60));
  console.log("  ⚡  STEP 3: Premium Tier");
  console.log("  World ID + Payment = maximum priority.");
  console.log("━".repeat(60));
  console.log();

  const t3 = Date.now();
  console.log("  ⏳ Calling GET /api/generate (World ID + Payment)...");

  try {
    const res3 = await fetch(`${GATEWAY_URL}/api/generate`, {
      headers: {
        "x-agent-id": "demo-premium-001",
        "x-world-id-proof": "verified-human-zkproof-demo",
        "x-payment-verified": "true",
      },
    });
    const data3 = await res3.json();
    const latency3 = Date.now() - t3;

    console.log(`  ⏱  Response time: ${latency3}ms`);
    console.log(`  📊 Tier:       ${data3.tier}`);
    console.log(`  📊 Priority:   ${data3.priority}`);
    console.log(`  📊 Verified:   ${data3.verified}`);
    console.log(`  📊 Quality:    ${data3.data?.quality}`);
    console.log(`  📊 Resolution: ${data3.data?.resolution}`);
    console.log(`  📊 Upscaled:   ${data3.data?.upscaled}`);
    console.log(`  💬 "${data3.message}"`);
    console.log();
    console.log(`  Result: INSTANT (${latency3}ms) + PREMIUM QUALITY`);
  } catch (e: any) {
    console.error(`  ❌ Error: ${e.message}`);
  }

  // ─────────────────────────────────────────────
  //  Summary
  // ─────────────────────────────────────────────
  console.log();
  console.log("═".repeat(60));
  console.log();
  console.log("  Same API. Same request.");
  console.log("  The only difference is whether it's backed by a real human.");
  console.log();
  console.log("  ┌──────────────┬──────────┬──────────┬──────────┐");
  console.log("  │ Tier         │ Speed    │ Cost     │ Quality  │");
  console.log("  ├──────────────┼──────────┼──────────┼──────────┤");
  console.log("  │ 🤖 No ID     │ ~2000ms  │ $1.00    │ standard │");
  console.log("  │ 🧬 World ID  │ <50ms    │ FREE     │ high     │");
  console.log("  │ ⚡ ID + Pay  │ <10ms    │ $0.50    │ ultra    │");
  console.log("  └──────────────┴──────────┴──────────┴──────────┘");
  console.log();
  console.log("  Powered by World ID × x402 × XMTP");
  console.log("  https://github.com/0xshae/agentic-checkout");
  console.log();
}

main().catch(console.error);

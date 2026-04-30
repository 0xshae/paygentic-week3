#!/bin/bash
# ═══════════════════════════════════════════════════════
#  AgentCred Demo — Agent A (New Agent, Never Staked)
#  
#  This script simulates a brand new agent:
#  1. First call → gets checkout URL (stake required)
#  2. Simulates Locus payment via webhook
#  3. Makes 10 successful calls, showing reputation growth
# ═══════════════════════════════════════════════════════

BASE_URL="${1:-http://localhost:4021}"
WALLET="0xNewAgent_$(date +%s)"

echo ""
echo "╔══════════════════════════════════════════════╗"
echo "║  🤖 AGENT A — New Agent Demo                ║"
echo "║  Wallet: ${WALLET:0:30}...      ║"
echo "╚══════════════════════════════════════════════╝"
echo ""

# ── Step 1: First call (should fail — no stake) ─────
echo "━━━ Step 1: First API call (no stake yet) ━━━"
echo ""

RESPONSE=$(curl -s -w "\n%{http_code}" \
  -X POST "${BASE_URL}/v1/generate" \
  -H "Content-Type: application/json" \
  -H "x-agent-wallet: ${WALLET}" \
  -d '{"prompt": "hello world"}')

HTTP_CODE=$(echo "$RESPONSE" | tail -1)
BODY=$(echo "$RESPONSE" | sed '$d')

echo "HTTP Status: ${HTTP_CODE}"
echo "Response:"
echo "$BODY" | python3 -m json.tool 2>/dev/null || echo "$BODY"
echo ""

if [ "$HTTP_CODE" = "402" ]; then
  echo "✅ Expected! Agent has no stake — checkout URL returned."
else
  echo "⚠️  Unexpected status code: ${HTTP_CODE}"
fi
echo ""

sleep 1

# ── Step 2: Simulate Locus payment (stake $1 USDC) ──
echo "━━━ Step 2: Simulating Locus payment ($1 USDC stake) ━━━"
echo ""

WEBHOOK_RESPONSE=$(curl -s \
  -X POST "${BASE_URL}/webhook/locus/simulate" \
  -H "Content-Type: application/json" \
  -d "{\"wallet\": \"${WALLET}\", \"amount\": 1}")

echo "Webhook Response:"
echo "$WEBHOOK_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$WEBHOOK_RESPONSE"
echo ""
echo "✅ Stake added! Agent now has $1 USDC balance."
echo ""

sleep 1

# ── Step 3: Check agent status ──────────────────────
echo "━━━ Step 3: Check agent reputation ━━━"
echo ""

AGENT_DATA=$(curl -s "${BASE_URL}/api/agents/${WALLET}")
echo "$AGENT_DATA" | python3 -m json.tool 2>/dev/null || echo "$AGENT_DATA"
echo ""

sleep 1

# ── Step 4: Make 10 successful API calls ────────────
echo "━━━ Step 4: Making 10 API calls ━━━"
echo ""

for i in $(seq 1 10); do
  RESPONSE=$(curl -s -w "\n%{http_code}" \
    -X POST "${BASE_URL}/v1/generate" \
    -H "Content-Type: application/json" \
    -H "x-agent-wallet: ${WALLET}" \
    -d "{\"prompt\": \"Call number ${i}\"}")

  HTTP_CODE=$(echo "$RESPONSE" | tail -1)
  BODY=$(echo "$RESPONSE" | sed '$d')

  # Extract reputation info
  REP=$(echo "$BODY" | python3 -c "import sys,json; d=json.load(sys.stdin); print(f'Rep: {d[\"agentcred\"][\"reputation\"]} | Tier: {d[\"agentcred\"][\"tier\"]} | Cost: \${d[\"agentcred\"][\"cost_deducted\"]} | Balance: \${d[\"agentcred\"][\"balance_remaining\"]}')" 2>/dev/null)

  if [ -n "$REP" ]; then
    echo "  Call #${i}: ${REP}"
  else
    echo "  Call #${i}: HTTP ${HTTP_CODE}"
  fi

  sleep 0.3
done

echo ""

# ── Final Check ─────────────────────────────────────
echo "━━━ Final Agent Status ━━━"
echo ""

AGENT_DATA=$(curl -s "${BASE_URL}/api/agents/${WALLET}")
echo "$AGENT_DATA" | python3 -m json.tool 2>/dev/null || echo "$AGENT_DATA"
echo ""
echo "╔══════════════════════════════════════════════╗"
echo "║  ✅ Agent A Demo Complete!                   ║"
echo "║  Wallet: ${WALLET:0:30}...      ║"
echo "╚══════════════════════════════════════════════╝"
echo ""

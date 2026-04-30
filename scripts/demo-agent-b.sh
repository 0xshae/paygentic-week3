#!/bin/bash
# ═══════════════════════════════════════════════════════
#  AgentCred Demo — Agent B (Pre-Funded, High Reputation)
#
#  This script demonstrates a trusted agent:
#  1. Seed Agent B (5 USDC staked, 20 prior successes)
#  2. Make 20 calls at Gold tier ($0.001/call)
#  3. Show dramatic cost savings vs Agent A
# ═══════════════════════════════════════════════════════

BASE_URL="${1:-http://localhost:4021}"
WALLET="0xProAgent_Established_HighRep_001"

echo ""
echo "╔══════════════════════════════════════════════╗"
echo "║  🥇 AGENT B — Trusted Agent Demo             ║"
echo "║  Wallet: ${WALLET:0:30}...       ║"
echo "╚══════════════════════════════════════════════╝"
echo ""

# ── Step 1: Seed the agent ──────────────────────────
echo "━━━ Step 1: Seed Agent B (5 USDC + 20 prior calls) ━━━"
echo ""

bash scripts/seed-agent-b.sh "$BASE_URL"
sleep 1

# ── Step 2: Check initial status ────────────────────
echo "━━━ Step 2: Initial Agent Status ━━━"
echo ""

AGENT_DATA=$(curl -s "${BASE_URL}/api/agents/${WALLET}")
echo "$AGENT_DATA" | python3 -m json.tool 2>/dev/null || echo "$AGENT_DATA"
echo ""

sleep 1

# ── Step 3: Make 20 API calls at Gold rate ──────────
echo "━━━ Step 3: Making 20 API calls at Gold tier ($0.001 each) ━━━"
echo ""

TOTAL_COST=0

for i in $(seq 1 20); do
  RESPONSE=$(curl -s -w "\n%{http_code}" \
    -X POST "${BASE_URL}/v1/generate" \
    -H "Content-Type: application/json" \
    -H "x-agent-wallet: ${WALLET}" \
    -d "{\"prompt\": \"Gold tier call number ${i}\"}")

  HTTP_CODE=$(echo "$RESPONSE" | tail -1)
  BODY=$(echo "$RESPONSE" | sed '$d')

  REP=$(echo "$BODY" | python3 -c "import sys,json; d=json.load(sys.stdin); print(f'Rep: {d[\"agentcred\"][\"reputation\"]} | Tier: {d[\"agentcred\"][\"tier\"]} | Cost: \${d[\"agentcred\"][\"cost_deducted\"]} | Balance: \${d[\"agentcred\"][\"balance_remaining\"]}')" 2>/dev/null)

  if [ -n "$REP" ]; then
    echo "  Call #${i}: ${REP}"
  else
    echo "  Call #${i}: HTTP ${HTTP_CODE}"
  fi

  sleep 0.2
done

echo ""

# ── Step 4: Compare costs ───────────────────────────
echo "━━━ Cost Comparison ━━━"
echo ""
echo "  Agent A (Bronze): 10 calls × \$0.01  = \$0.10 total"
echo "  Agent B (Gold):   20 calls × \$0.001 = \$0.02 total"
echo "  ─────────────────────────────────────────────"
echo "  Agent B saved 80% per call with higher reputation! 🎉"
echo ""

# ── Final Status ────────────────────────────────────
echo "━━━ Final Agent Status ━━━"
echo ""

AGENT_DATA=$(curl -s "${BASE_URL}/api/agents/${WALLET}")
echo "$AGENT_DATA" | python3 -m json.tool 2>/dev/null || echo "$AGENT_DATA"
echo ""

echo "╔══════════════════════════════════════════════╗"
echo "║  ✅ Agent B Demo Complete!                    ║"
echo "║  20 calls at \$0.001/call (Gold tier)         ║"
echo "╚══════════════════════════════════════════════╝"
echo ""

#!/bin/bash
# ═══════════════════════════════════════════════════════
#  AgentCred Demo — Seed Agent B (Pre-Funded)
#
#  Creates a pre-staked agent with 5 USDC and 20 
#  successful prior calls. This sets reputation to ~60
#  (Gold tier = $0.001/call).
# ═══════════════════════════════════════════════════════

BASE_URL="${1:-http://localhost:4021}"
WALLET="0xProAgent_Established_HighRep_001"

echo ""
echo "╔══════════════════════════════════════════════╗"
echo "║  🌟 Seeding Agent B (Pre-Funded)             ║"
echo "╚══════════════════════════════════════════════╝"
echo ""

RESPONSE=$(curl -s \
  -X POST "${BASE_URL}/api/seed" \
  -H "Content-Type: application/json" \
  -d "{
    \"wallet\": \"${WALLET}\",
    \"stake\": 5,
    \"successful_calls\": 20
  }")

echo "Seeded Agent B:"
echo "$RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$RESPONSE"
echo ""
echo "✅ Agent B is ready with 5 USDC stake + 20 prior successes"
echo ""

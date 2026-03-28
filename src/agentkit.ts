import {
  createAgentBookVerifier,
  createAgentkitHooks,
  declareAgentkitExtension,
  agentkitResourceServerExtension,
} from "@worldcoin/agentkit";
import type { AgentkitHookEvent } from "@worldcoin/agentkit";
import { SqliteAgentKitStorage } from "./db";
import { config } from "./config";
import { sendAuditMessage } from "./services/xmtp";

// ── AgentBook verifier (World Chain registry) ───────
export const agentBook = createAgentBookVerifier();

// ── Persistent storage (SQLite) ─────────────────────
export const agentKitStorage = new SqliteAgentKitStorage();

// ── AgentKit hooks with discount mode ───────────────
// 99% discount × 1 use = $1.00 → $0.01 for first verified human
export const agentkitHooks = createAgentkitHooks({
  agentBook,
  storage: agentKitStorage,
  mode: {
    type: "discount",
    percent: config.discountPercent,
    uses: config.discountUses,
  },
  onEvent: (event: AgentkitHookEvent) => {
    console.info(`[AgentKit] Event: ${event.type}`, JSON.stringify(event));

    // Fire XMTP audit on successful verification
    if (event.type === "agent_verified" || event.type === "discount_applied") {
      const amount = event.type === "discount_applied"
        ? "$0.01"
        : config.botPrice;

      sendAuditMessage({
        amount,
        agentId: "address" in event ? event.address : null,
        humanId: "humanId" in event ? event.humanId : null,
      }).catch((err) => {
        console.error("[AgentKit] Failed to send XMTP audit:", err);
      });
    }
  },
});

// ── Extension declaration for route config ──────────
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function getAgentkitExtension(): ReturnType<typeof declareAgentkitExtension> {
  return declareAgentkitExtension({
    statement: "Verify your agent is backed by a real human to unlock a 99% discount",
    mode: {
      type: "discount",
      percent: config.discountPercent,
      uses: config.discountUses,
    },
  });
}

export { agentkitResourceServerExtension };

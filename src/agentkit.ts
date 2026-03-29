import {
  createAgentBookVerifier,
  createAgentkitHooks,
  declareAgentkitExtension,
  agentkitResourceServerExtension,
} from "@worldcoin/agentkit";
import type { AgentkitHookEvent } from "@worldcoin/agentkit";
import { SqliteAgentKitStorage } from "./db";
import { config } from "./config";
// ── AgentBook verifier (World Chain registry) ───────
export const agentBook = createAgentBookVerifier();

// ── Persistent storage (SQLite) ─────────────────────
export const agentKitStorage = new SqliteAgentKitStorage();

// ── AgentKit hooks with free-trial mode ─────────────
// Verified humans get 3 free requests; bots pay $1.00 via x402
export const agentkitHooks = createAgentkitHooks({
  agentBook,
  storage: agentKitStorage,
  mode: {
    type: "free-trial",
    uses: config.freeTrialUses,
  },
  onEvent: (event: AgentkitHookEvent) => {
    console.info(`[AgentKit] Event: ${event.type}`, JSON.stringify(event));

    if (event.type === "agent_verified" || event.type === "discount_applied") {
      console.info(`[AgentKit] User passed verification. Event: ${event.type}`);
    }
  },
});

// ── Extension declaration for route config ──────────
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function getAgentkitExtension(): ReturnType<typeof declareAgentkitExtension> {
  return declareAgentkitExtension({
    statement: "Verify your agent is backed by a real human to unlock 3 free requests",
    mode: {
      type: "free-trial",
      uses: config.freeTrialUses,
    },
  });
}

export { agentkitResourceServerExtension };

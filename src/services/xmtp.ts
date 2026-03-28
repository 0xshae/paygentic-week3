import { config } from "../config";
import { insertTransaction } from "../db";
import { nanoid } from "nanoid";

/**
 * Structured audit payload sent over XMTP.
 */
export interface AuditPayload {
  type: "AGENT_TRANSACTION";
  merchant: string;
  cost: string;
  currency: string;
  status: string;
  short_code: string;
  revoke_url: string;
}

/**
 * Sends an audit message over XMTP to the human owner.
 *
 * Records the transaction in SQLite first, then attempts XMTP delivery.
 * Fire-and-forget: errors are logged but never throw.
 */
export async function sendAuditMessage(opts: {
  shortCode: string;
  recipientAddress?: string;
  amount: string;
  agentId: string | null;
  humanId: string | null;
}): Promise<void> {

  const payload: AuditPayload = {
    type: "AGENT_TRANSACTION",
    merchant: "AgenticStore_v1",
    cost: opts.amount,
    currency: "USDC",
    status: "SETTLED",
    short_code: opts.shortCode,
    revoke_url: `http://localhost:${config.port}/revoke?code=${opts.shortCode}`,
  };

  const recipient = opts.recipientAddress || config.xmtpRecipientAddress;

  // ── XMTP delivery via @xmtp/agent-sdk ─────────────
  if (!config.xmtpWalletKey || !recipient) {
    console.info("[XMTP] Credentials not configured — logging audit locally");
    console.info("[XMTP] Payload:", JSON.stringify(payload, null, 2));
    return;
  }

  try {
    const { Agent, createUser, createSigner } = await import("@xmtp/agent-sdk");

    const user = createUser(config.xmtpWalletKey as `0x${string}`);
    const signer = createSigner(user);

    const agent = await Agent.create(signer, {
      env: config.xmtpEnv as "dev" | "production" | "local",
    });

    const dm = await agent.createDmWithAddress(recipient as `0x${string}`);
    await dm.sendText(JSON.stringify(payload));
    await agent.stop();

    console.info(`[XMTP] Audit sent to ${recipient} | code=${opts.shortCode}`);
  } catch (err) {
    console.error("[XMTP] Failed to send audit message:", err);
    // Non-fatal — transaction is already recorded in SQLite
  }
}

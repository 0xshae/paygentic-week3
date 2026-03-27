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
 * This is fire-and-forget: errors are logged but never throw.
 * Uses the XMTP Node SDK with TextCodec.
 */
export async function sendAuditMessage(opts: {
  recipientAddress?: string;
  amount: string;
  agentId: string | null;
  nullifierHash: string | null;
}): Promise<{ shortCode: string; payload: AuditPayload } | null> {
  const shortCode = nanoid(10);

  // Record the transaction in SQLite
  insertTransaction({
    shortCode,
    nullifierHash: opts.nullifierHash,
    amount: opts.amount,
    agentId: opts.agentId,
  });

  const payload: AuditPayload = {
    type: "AGENT_TRANSACTION",
    merchant: "AgenticStore_v1",
    cost: opts.amount,
    currency: "USDC",
    status: "SETTLED",
    short_code: shortCode,
    revoke_url: `http://localhost:${config.port}/revoke?code=${shortCode}`,
  };

  const recipient = opts.recipientAddress || config.xmtpRecipientAddress;

  // ── XMTP delivery ────────────────────────────────
  // The XMTP client requires env keys. In demo mode we log the payload
  // and skip if credentials are not configured.
  if (!config.xmtpPrivateKey || !recipient) {
    console.info("[XMTP] Credentials not configured — logging audit locally");
    console.info("[XMTP] Payload:", JSON.stringify(payload, null, 2));
    return { shortCode, payload };
  }

  try {
    // Dynamic import to avoid crashing if @xmtp/node-sdk is not installed
    // @ts-ignore — optional dependency, gracefully degrades
    const xmtp = await import("@xmtp/node-sdk");

    // Create a signer from the private key
    const key = config.xmtpPrivateKey.startsWith("0x")
      ? config.xmtpPrivateKey.slice(2)
      : config.xmtpPrivateKey;
    const keyBytes = Buffer.from(key, "hex");

    const client = await (xmtp as any).Client.create(keyBytes, {
      env: "production",
    });

    const conversation = await client.conversations.newDm(recipient);
    await conversation.send(JSON.stringify(payload));

    console.info(`[XMTP] Audit sent to ${recipient} | code=${shortCode}`);
  } catch (err) {
    console.error("[XMTP] Failed to send audit message:", err);
    // Non-fatal — the transaction is already recorded in SQLite
  }

  return { shortCode, payload };
}

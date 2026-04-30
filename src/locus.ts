/**
 * Locus Checkout Integration — AgentCred
 *
 * Handles creating Locus Checkout sessions for agent staking
 * and processing webhook callbacks when payments are confirmed.
 */

import crypto from "crypto";
import { config } from "./config";
import { saveLocusSession, updateLocusSession, getLocusSession, ensureAgent, addStake } from "./db";
import { v4 as uuidv4 } from "uuid";
import { Request, Response } from "express";

// ── Session Creation ────────────────────────────────

interface CreateSessionResult {
  sessionId: string;
  checkoutUrl: string;
}

/**
 * Create a Locus Checkout session for an agent to stake USDC.
 *
 * Uses the Locus beta API to create a checkout session.
 * Falls back to a local mock if the API is unavailable.
 */
export async function createStakeSession(
  wallet: string,
  amount: number
): Promise<CreateSessionResult> {
  // Ensure the agent exists in our DB
  ensureAgent(wallet);

  // Try to create a real Locus session
  if (config.locusApiKey) {
    try {
      const response = await fetch(`${config.locusApiBase}/checkout/sessions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${config.locusApiKey}`,
        },
        body: JSON.stringify({
          amount: amount.toFixed(2),
          description: `AgentCred stake deposit — agent ${wallet.slice(0, 10)}...`,
          webhookUrl: `${config.publicUrl}/webhook/locus`,
          successUrl: `${config.publicUrl}/?stake=success&wallet=${wallet}`,
          cancelUrl: `${config.publicUrl}/?stake=cancelled`,
          metadata: {
            wallet,
            purpose: "stake",
            gateway: "agentcred",
          },
        }),
      });

      if (response.ok) {
        const data = await response.json() as { data?: { id?: string }; id?: string };
        const sessionId = data.data?.id || data.id || uuidv4();
        const checkoutUrl = `${config.checkoutBaseUrl}/${sessionId}`;

        // Track in our DB
        saveLocusSession(sessionId, wallet, amount);

        console.log(`[Locus] ✅ Session created: ${sessionId} for ${wallet} ($${amount} USDC)`);
        return { sessionId, checkoutUrl };
      }

      console.warn(`[Locus] ⚠️ API returned ${response.status}, falling back to mock session`);
    } catch (err: any) {
      console.warn(`[Locus] ⚠️ API error: ${err.message}, falling back to mock session`);
    }
  }

  // Fallback: create a mock session (for demo without real Locus)
  const sessionId = `mock_${uuidv4().slice(0, 8)}`;
  const checkoutUrl = `${config.publicUrl}/checkout/mock/${sessionId}?amount=${amount}&wallet=${wallet}`;

  saveLocusSession(sessionId, wallet, amount);

  console.log(`[Locus] 🔧 Mock session created: ${sessionId} for ${wallet} ($${amount} USDC)`);
  return { sessionId, checkoutUrl };
}

// ── Webhook Verification ────────────────────────────

/**
 * Verify a Locus webhook signature using HMAC-SHA256.
 */
export function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  if (!secret) return true; // Skip verification if no secret configured

  const expected =
    "sha256=" +
    crypto.createHmac("sha256", secret).update(payload).digest("hex");

  try {
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expected)
    );
  } catch {
    return false;
  }
}

// ── Webhook Handler ─────────────────────────────────

/**
 * Handle incoming Locus webhook events.
 * On `checkout.session.paid`: add stake to agent's balance.
 */
export function handleWebhook(req: Request, res: Response): void {
  const signature = req.headers["x-signature-256"] as string;
  const event = req.headers["x-webhook-event"] as string;
  const rawBody = JSON.stringify(req.body);

  // Verify signature if we have a webhook secret
  if (config.locusWebhookSecret && signature) {
    const valid = verifyWebhookSignature(rawBody, signature, config.locusWebhookSecret);
    if (!valid) {
      console.error("[Webhook] ❌ Invalid signature");
      res.status(401).json({ error: "Invalid webhook signature" });
      return;
    }
  }

  console.log(`[Webhook] 📬 Received event: ${event || req.body?.event}`);

  const eventType = event || req.body?.event;
  const data = req.body?.data || req.body;

  if (eventType === "checkout.session.paid") {
    const sessionId = data.sessionId || data.session_id;
    const amount = parseFloat(data.amount);
    const wallet = data.metadata?.wallet;

    if (!sessionId || !wallet || isNaN(amount)) {
      console.error("[Webhook] ❌ Missing required fields:", { sessionId, wallet, amount });
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    // Update session status
    updateLocusSession(sessionId, "PAID");

    // Add stake to agent's balance
    ensureAgent(wallet);
    addStake(wallet, amount);

    console.log(`[Webhook] ✅ Stake added: ${wallet} +$${amount} USDC (session: ${sessionId})`);
    res.status(200).json({ received: true, wallet, amount });
    return;
  }

  if (eventType === "checkout.session.expired") {
    const sessionId = data.sessionId || data.session_id;
    if (sessionId) {
      updateLocusSession(sessionId, "EXPIRED");
      console.log(`[Webhook] ⏰ Session expired: ${sessionId}`);
    }
    res.status(200).json({ received: true });
    return;
  }

  // Unknown event — acknowledge anyway
  console.log(`[Webhook] ℹ️ Unhandled event type: ${eventType}`);
  res.status(200).json({ received: true });
}

// ── Simulate Webhook (for demo) ─────────────────────

/**
 * Simulate a Locus payment webhook for demo/testing.
 * This allows the demo to work without ngrok or real Locus payments.
 */
export function handleSimulateWebhook(req: Request, res: Response): void {
  const { session_id, wallet, amount } = req.body;

  if (!wallet) {
    res.status(400).json({ error: "Missing wallet address" });
    return;
  }

  const stakeAmount = parseFloat(amount) || 1;
  const sessionId = session_id || `sim_${uuidv4().slice(0, 8)}`;

  // Check if session exists in our DB, if so update it
  const existing = getLocusSession(sessionId);
  if (existing) {
    updateLocusSession(sessionId, "PAID");
  } else {
    saveLocusSession(sessionId, wallet, stakeAmount);
    updateLocusSession(sessionId, "PAID");
  }

  // Add stake to agent
  ensureAgent(wallet);
  addStake(wallet, stakeAmount);

  console.log(`[Simulate] ✅ Stake simulated: ${wallet} +$${stakeAmount} USDC`);
  res.status(200).json({
    simulated: true,
    wallet,
    amount: stakeAmount,
    session_id: sessionId,
    message: `Successfully simulated $${stakeAmount} USDC stake for ${wallet}`,
  });
}

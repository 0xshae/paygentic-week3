/**
 * Reputation Middleware — RepGate
 *
 * Intercepts requests to protected endpoints and enforces
 * access based on the agent's reputation score and balance.
 *
 * Flow:
 * 1. Extract wallet from x-agent-wallet header
 * 2. Auto-create agent if new
 * 3. Compute reputation → tier → cost
 * 4. Check balance:
 *    - Tier 1 & never staked → return checkout URL (402)
 *    - Balance < cost → return checkout URL (402)
 * 5. Deduct cost, attach metadata, call next()
 */

import { Request, Response, NextFunction } from "express";
import { ensureAgent, getAgent, deductCost } from "../db";
import { getReputation, getTier } from "../reputation";
import { createStakeSession } from "../locus";

export interface ReputationData {
  wallet: string;
  score: number;
  tierName: string;
  costPerCall: number;
  balanceBefore: number;
  balanceAfter: number;
}

/**
 * Creates reputation middleware for protected routes.
 */
export function reputationMiddleware() {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // 1. Extract wallet
    const wallet = req.headers["x-agent-wallet"] as string;
    if (!wallet) {
      res.status(400).json({
        error: "Missing x-agent-wallet header",
        message: "Provide your agent wallet address in the x-agent-wallet header.",
      });
      return;
    }

    // 2. Ensure agent exists
    const agent = ensureAgent(wallet);

    // 3. Compute reputation and tier
    const score = getReputation(wallet);
    const tier = getTier(score);
    const cost = tier.costPerCall;

    const logPrefix = `[RepGate] ${wallet.slice(0, 10)}...`;
    console.log(`${logPrefix} Score: ${score} | Tier: ${tier.name} | Cost: $${cost} | Balance: $${agent.stake_balance.toFixed(4)}`);

    // 4. Check staking requirements (only for first-time staking)
    // An agent needs to have staked at least minStake total (balance + spent = total deposited)
    const totalDeposited = Math.round((agent.stake_balance + agent.total_spent) * 10000) / 10000;
    if (tier.minStake > 0 && totalDeposited < tier.minStake) {
      // Agent needs to stake first
      try {
        const session = await createStakeSession(wallet, tier.minStake);
        console.log(`${logPrefix} ⚠️ Stake required ($${tier.minStake} USDC)`);
        res.status(402).json({
          action: "stake_required",
          checkout_url: session.checkoutUrl,
          session_id: session.sessionId,
          min_stake: tier.minStake,
          current_balance: agent.stake_balance,
          reputation: score,
          tier: tier.name,
          message: `You must stake at least $${tier.minStake} USDC before making API calls. Complete payment at the checkout URL.`,
        });
      } catch (err: any) {
        console.error(`${logPrefix} ❌ Failed to create stake session:`, err.message);
        res.status(500).json({ error: "Failed to create checkout session" });
      }
      return;
    }

    // 5. Check sufficient balance
    if (agent.stake_balance < cost) {
      // Need more USDC
      const topUpAmount = Math.max(1, cost * 100); // Suggest topping up at least $1
      try {
        const session = await createStakeSession(wallet, topUpAmount);
        console.log(`${logPrefix} ⚠️ Insufficient balance ($${agent.stake_balance.toFixed(4)} < $${cost})`);
        res.status(402).json({
          action: "insufficient_balance",
          checkout_url: session.checkoutUrl,
          session_id: session.sessionId,
          required: cost,
          available: agent.stake_balance,
          suggested_topup: topUpAmount,
          reputation: score,
          tier: tier.name,
          message: `Insufficient balance. You need $${cost} USDC but only have $${agent.stake_balance.toFixed(4)}. Top up at the checkout URL.`,
        });
      } catch (err: any) {
        console.error(`${logPrefix} ❌ Failed to create top-up session:`, err.message);
        res.status(500).json({ error: "Failed to create checkout session" });
      }
      return;
    }

    // 6. Deduct cost and proceed
    const balanceBefore = agent.stake_balance;
    deductCost(wallet, cost);
    const balanceAfter = balanceBefore - cost;

    // Attach reputation data to request for downstream handlers
    (req as any).repData = {
      wallet,
      score,
      tierName: tier.name,
      costPerCall: cost,
      balanceBefore,
      balanceAfter,
    } as ReputationData;

    console.log(`${logPrefix} ✅ Deducted $${cost} | Balance: $${balanceBefore.toFixed(4)} → $${balanceAfter.toFixed(4)}`);
    next();
  };
}

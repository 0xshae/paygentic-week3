/**
 * Reputation Module — AgentCred
 *
 * Computes an agent's reputation score (0–100) based on:
 *   - Stake: each 0.1 USDC staked → +1 point (max 50)
 *   - Success: each successful API call → +0.5 point (max 50)
 *   - Failure: each failed API call → -2 points
 *
 * Score is clamped to [0, 100].
 */

import { config, TIERS, type TierConfig } from "./config";
import { getAgent, ensureAgent, incrementSuccess, incrementFailure } from "./db";

/**
 * Compute reputation score for a wallet.
 * Returns 0 if the agent doesn't exist.
 */
export function getReputation(wallet: string): number {
  const agent = getAgent(wallet);
  if (!agent) return 0;

  const { reputation: r } = config;

  // Stake points: each 0.1 USDC → +1 point, max 50
  const stakePoints = Math.min(
    (agent.stake_balance / 0.1) * r.stakePointsPer01,
    r.maxStakePoints
  );

  // Call success points: each success → +0.5 point, max 50
  const successPoints = Math.min(
    agent.successful_calls * r.successPoints,
    r.maxSuccessPoints
  );

  // Failure penalty: each failure → -2 points
  const penalty = agent.failed_calls * r.failurePenalty;

  // Clamp to [0, 100]
  const raw = stakePoints + successPoints - penalty;
  return Math.max(r.minScore, Math.min(r.maxScore, Math.round(raw * 10) / 10));
}

/**
 * Get tier configuration for a given reputation score.
 */
export function getTier(score: number): TierConfig {
  for (let i = TIERS.length - 1; i >= 0; i--) {
    if (score >= TIERS[i].minScore) {
      return TIERS[i];
    }
  }
  return TIERS[0]; // fallback to lowest tier
}

/**
 * Update reputation after an API call based on the HTTP status code.
 * 2xx → success (+0.5 points)
 * 4xx/5xx → failure (-2 points)
 */
export function updateAfterCall(wallet: string, statusCode: number): void {
  ensureAgent(wallet);

  if (statusCode >= 200 && statusCode < 300) {
    incrementSuccess(wallet);
  } else if (statusCode >= 400) {
    incrementFailure(wallet);
  }
}

/**
 * Get a formatted reputation summary for logging.
 */
export function getReputationSummary(wallet: string): {
  score: number;
  tier: TierConfig;
  costPerCall: number;
} {
  const score = getReputation(wallet);
  const tier = getTier(score);
  return {
    score,
    tier,
    costPerCall: tier.costPerCall,
  };
}

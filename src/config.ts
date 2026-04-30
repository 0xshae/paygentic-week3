import dotenv from "dotenv";
dotenv.config();

// ── Tier Definitions ────────────────────────────────
export interface TierConfig {
  name: string;
  minScore: number;
  maxScore: number;
  costPerCall: number;
  minStake: number;
}

export const TIERS: TierConfig[] = [
  { name: "Bronze",   minScore: 0,  maxScore: 20,  costPerCall: 0.01,  minStake: 1 },
  { name: "Silver",   minScore: 21, maxScore: 50,  costPerCall: 0.005, minStake: 0 },
  { name: "Gold",     minScore: 51, maxScore: 100, costPerCall: 0.001, minStake: 0 },
];

// ── Configuration ───────────────────────────────────
export const config = {
  port: parseInt(process.env.PORT || "4021", 10),

  // Locus Checkout
  locusApiKey: process.env.LOCUS_API_KEY || "",
  locusWebhookSecret: process.env.LOCUS_WEBHOOK_SECRET || "",
  locusApiBase: "https://beta-api.paywithlocus.com/api",
  checkoutBaseUrl: "https://checkout.paywithlocus.com",

  // Target API (the real API being proxied)
  targetApiUrl: process.env.TARGET_API_URL || "https://httpbin.org/post",

  // Public URL for webhook callbacks
  publicUrl: process.env.PUBLIC_URL || "http://localhost:4021",

  // Reputation scoring constants
  reputation: {
    stakePointsPer01: 1,       // +1 point per 0.1 USDC staked
    maxStakePoints: 50,
    successPoints: 0.5,        // +0.5 per successful call
    maxSuccessPoints: 50,
    failurePenalty: 2,          // -2 per failed call
    minScore: 0,
    maxScore: 100,
  },
} as const;

/**
 * Glide Middleware — Human-Aware API Gateway
 *
 * Sits in front of any Express route and enforces a 3-tier access model:
 *
 *   Tier 1 (No World ID):      slow + expensive  → x402 payment required
 *   Tier 2 (World ID):         fast + free        → instant access
 *   Tier 3 (World ID + Pay):   instant + premium  → highest priority
 *
 * Usage:
 *   app.use('/api/generate', glideMiddleware({ requireWorldId: true, fallback: 'pay' }));
 */

import { Request, Response, NextFunction } from "express";

export interface GlidePolicy {
  /** If true, World ID proof grants free access */
  requireWorldId: boolean;
  /** What happens when no World ID is present: "pay" | "reject" | "rate-limit" */
  fallback: "pay" | "reject" | "rate-limit";
  /** Artificial delay (ms) for unverified requests (demo purposes) */
  botDelayMs?: number;
}

export type GlideTier = "bot" | "human" | "premium";

/**
 * Resolves the access tier from request headers.
 *
 * Header: X-World-ID-Proof — simulated World ID ZK-proof (hackathon demo)
 * In production, this would be a real EIP-4361 signed message verified
 * against the AgentBook on World Chain.
 */
function resolveTier(req: Request): GlideTier {
  const hasWorldId = !!req.headers["x-world-id-proof"];
  const hasPaid = !!req.headers["x-payment-verified"];

  if (hasWorldId && hasPaid) return "premium";
  if (hasWorldId)            return "human";
  return "bot";
}

/**
 * Creates a Glide middleware that enforces identity-aware access control.
 */
export function glideMiddleware(policy: GlidePolicy) {
  const delayMs = policy.botDelayMs ?? 2000;

  return (req: Request, res: Response, next: NextFunction): void => {
    const tier = resolveTier(req);

    // Attach tier to request for downstream handlers
    (req as any).glideTier = tier;
    (req as any).glideVerified = tier !== "bot";

    console.log(`[Glide] ${req.method} ${req.path} → Tier: ${tier.toUpperCase()}`);

    switch (tier) {
      case "premium":
        // World ID + Payment → instant, no delay, highest priority
        (req as any).glidePriority = "instant";
        next();
        return;

      case "human":
        // World ID only → fast, free access
        (req as any).glidePriority = "high";
        next();
        return;

      case "bot":
        // No World ID → apply fallback policy
        switch (policy.fallback) {
          case "reject":
            res.status(403).json({
              error: "World ID verification required",
              message: "This API requires proof of human identity. Provide a valid X-World-ID-Proof header.",
            });
            return;

          case "rate-limit":
            // Allow but with artificial delay
            (req as any).glidePriority = "low";
            setTimeout(() => next(), delayMs);
            return;

          case "pay":
          default:
            // Fall through to x402 payment middleware
            // The x402 middleware mounted earlier will handle this
            (req as any).glidePriority = "low";
            (req as any).glideRequiresPayment = true;
            next();
            return;
        }
    }
  };
}

export { resolveTier };

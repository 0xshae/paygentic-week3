import { Request, Response, NextFunction } from "express";
import { config } from "../config";
import { hasNullifier, markNullifier } from "../db";

/**
 * World ID proof payload expected in the `x-world-id-proof` header (JSON).
 */
interface WorldIdProof {
  proof: string;
  merkle_root: string;
  nullifier_hash: string;
  credential_type: string;
  verification_level: string;
}

/**
 * Extended request with identity-aware pricing fields.
 */
declare global {
  namespace Express {
    interface Request {
      humanDiscount?: boolean;
      nullifierHash?: string | null;
      resolvedPrice?: string;
      agentId?: string | null;
    }
  }
}

/**
 * Verifies a World ID proof against the v4 cloud API.
 */
async function verifyWithWorldId(proof: WorldIdProof): Promise<boolean> {
  try {
    const res = await fetch(
      `https://developer.worldcoin.org/api/v4/verify/${config.worldAppId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: config.worldActionId,
          proof: proof.proof,
          merkle_root: proof.merkle_root,
          nullifier_hash: proof.nullifier_hash,
          credential_type: proof.credential_type,
          verification_level: proof.verification_level,
        }),
      }
    );
    return res.ok;
  } catch (err) {
    console.error("[WorldID] Verification request failed:", err);
    return false;
  }
}

/**
 * Express middleware — World ID Sybil Shield.
 *
 * 1. Reads `x-world-id-proof` header.
 * 2. Verifies the ZK proof via World ID.
 * 3. Checks the nullifier_hash against SQLite.
 * 4. Sets `req.humanDiscount` and `req.resolvedPrice`.
 *
 * If proof is missing/invalid → defaults to Bot Tax ($1.00).
 * If valid but already used → defaults to Bot Tax ($1.00).
 * If valid and first use → Human Discount ($0.01), marks nullifier.
 */
export async function worldIdMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  // Default: Bot Tax
  req.humanDiscount = false;
  req.resolvedPrice = config.botPrice;
  req.nullifierHash = null;
  req.agentId = (req.headers["x-agent-id"] as string) || null;

  const proofHeader = req.headers["x-world-id-proof"] as string | undefined;
  if (!proofHeader) {
    return next();
  }

  let proof: WorldIdProof;
  try {
    proof = JSON.parse(proofHeader);
  } catch {
    console.warn("[WorldID] Malformed proof header");
    return next();
  }

  if (!proof.nullifier_hash) {
    console.warn("[WorldID] Missing nullifier_hash");
    return next();
  }

  // Verify with World ID cloud
  const isValid = await verifyWithWorldId(proof);
  if (!isValid) {
    console.warn("[WorldID] Proof verification failed");
    return next();
  }

  req.nullifierHash = proof.nullifier_hash;

  // Sybil check: has this human already used their discount?
  if (hasNullifier(proof.nullifier_hash)) {
    console.info("[WorldID] Returning user — Bot Tax applies");
    return next();
  }

  // First-time verified human → grant discount & mark
  markNullifier(proof.nullifier_hash);
  req.humanDiscount = true;
  req.resolvedPrice = config.humanPrice;
  console.info("[WorldID] New human verified — discount granted");

  return next();
}

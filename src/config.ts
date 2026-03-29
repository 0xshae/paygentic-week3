import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || "4021", 10),

  // ── Merchant ──────────────────────────────────────
  merchantWallet: (process.env.MERCHANT_WALLET || "0x0000000000000000000000000000000000000000") as `0x${string}`,

  // ── Pricing (Identity-Aware) ──────────────────────
  // Full price for unverified agents ("Bot Tax")
  botPrice: "$1.00",
  // Premium price for World ID + Payment tier
  premiumPrice: "$0.50",
  // AgentKit `free-trial` mode gives verified humans 3 free requests
  freeTrialUses: 3,
  asset: "USDC",

  // ── Networks (CAIP-2) ─────────────────────────────
  baseSepolia: "eip155:84532" as const,
  worldSepolia: "eip155:4801" as const,

  // ── x402 Facilitator ──────────────────────────────
  facilitatorUrl: process.env.FACILITATOR_URL || "https://x402.org/facilitator",

  // ── XMTP ──────────────────────────────────────────
  xmtpEnv: process.env.XMTP_ENV || "dev",
  xmtpWalletKey: process.env.XMTP_WALLET_KEY || "",
  xmtpDbEncryptionKey: process.env.XMTP_DB_ENCRYPTION_KEY || "",
  xmtpRecipientAddress: process.env.XMTP_RECIPIENT_ADDRESS || "",
} as const;

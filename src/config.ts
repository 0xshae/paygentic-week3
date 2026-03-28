import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || "4021", 10),

  // ── Merchant ──────────────────────────────────────
  merchantWallet: (process.env.MERCHANT_WALLET || "0x0000000000000000000000000000000000000000") as `0x${string}`,

  // ── Pricing (Identity-Aware) ──────────────────────
  // Full price for unverified agents ("Bot Tax")
  botPrice: "$1.00",
  // AgentKit `discount` mode gives verified humans 99% off → $0.01
  discountPercent: 99,
  discountUses: 1,
  asset: "USDC",

  // ── Networks (CAIP-2) ─────────────────────────────
  baseSepolia: "eip155:84532" as const,
  worldChain: "eip155:480" as const,

  // ── x402 Facilitator ──────────────────────────────
  facilitatorUrl: process.env.FACILITATOR_URL || "https://x402.org/facilitator",

  // ── XMTP ──────────────────────────────────────────
  xmtpEnv: process.env.XMTP_ENV || "dev",
  xmtpWalletKey: process.env.XMTP_WALLET_KEY || "",
  xmtpDbEncryptionKey: process.env.XMTP_DB_ENCRYPTION_KEY || "",
  xmtpRecipientAddress: process.env.XMTP_RECIPIENT_ADDRESS || "",
} as const;

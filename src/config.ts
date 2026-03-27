import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || "3000", 10),

  // ── Merchant ──────────────────────────────────────
  merchantWallet: process.env.MERCHANT_WALLET || "",

  // ── Pricing (Identity-Aware) ──────────────────────
  humanPrice: "0.01",   // $0.01 USDC — Human Discount
  botPrice: "1.00",     // $1.00 USDC — Bot Tax
  asset: "USDC",
  network: "base",

  // ── Coinbase x402 ────────────────────────────────
  cdpApiKeyId: process.env.CDP_API_KEY_ID || "",
  cdpApiKeySecret: process.env.CDP_API_KEY_SECRET || "",

  // ── World ID ─────────────────────────────────────
  worldAppId: process.env.WORLD_APP_ID || "",
  worldActionId: process.env.WORLD_ACTION_ID || "",

  // ── XMTP ─────────────────────────────────────────
  xmtpPrivateKey: process.env.XMTP_PRIVATE_KEY || "",
  xmtpRecipientAddress: process.env.XMTP_RECIPIENT_ADDRESS || "",
} as const;

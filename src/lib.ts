/**
 * Glide — Human-Aware API Gateway
 * 
 * Core Export Entry Point
 */

// Middleware & Types
export { glideMiddleware, resolveTier } from "./middleware/glide";
export type { GlidePolicy, GlideTier } from "./middleware/glide";

// Services
export { sendAuditMessage } from "./services/xmtp";
export type { AuditPayload } from "./services/xmtp";

// Database (Optional, for consumers who want to use the same persistence)
export * from "./db";

// Configuration types
export { config } from "./config";

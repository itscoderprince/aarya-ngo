// lib/phonepe/client.js

import { StandardCheckoutClient, Env } from "pg-sdk-node";

// Detect if we are inside the Vercel build phase
// Vercel sets NEXT_PHASE="phase-production-build" during build
const isBuildTime = process.env.NEXT_PHASE === "phase-production-build";

/**
 * SAFE lazy loader for the PhonePe client.
 * Prevents authentication during Vercel build.
 */
export function getPhonePeClient() {
  if (isBuildTime) {
    console.warn("⚠️ PhonePeClient skipped during Vercel build — using mock client.");

    // Mock client — prevents ANY real API call at build time
    return {
      pay: async () => ({
        redirectUrl: "#",
        orderId: "BUILD_SKIP",
        expireAt: Date.now(),
        state: "SKIPPED",
      }),

      getOrderStatus: async () => ({
        state: "SKIPPED",
        amount: 0,
      }),

      validateCallback: () => ({
        valid: true,
      }),

      refund: async () => ({
        success: true,
        message: "Refund skipped in build mode"
      }),
    };
  }

  // Runtime actual PhonePe client
  return StandardCheckoutClient.getInstance(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    parseInt(process.env.CLIENT_VERSION || "1"),
    process.env.NODE_ENV === "production"
      ? Env.PRODUCTION
      : Env.SANDBOX
  );
}

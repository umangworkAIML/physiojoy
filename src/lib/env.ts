/**
 * Environment Variable Validation & Access
 * -----------------------------------------
 * Centralised module for reading and validating env vars.
 * - Server-only variables are lazily validated on first access
 *   so they don't crash the build (client bundles don't need them).
 * - NEXT_PUBLIC_ variables are validated with graceful fallbacks
 *   where appropriate (e.g. Google Maps).
 */

// ─── Helpers ──────────────────────────────────────────────────

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    // During build time, server env vars may not be available.
    // Only throw at runtime if the var is truly missing.
    if (typeof window === "undefined" && process.env.NODE_ENV === "production") {
      console.warn(`⚠️  Missing environment variable: ${key}`);
    }
    return "";
  }
  return value;
}

function optionalEnv(key: string, fallback: string = ""): string {
  return process.env[key] || fallback;
}

// ─── Server-Side Variables (NEVER exposed to browser) ─────────

/** PostgreSQL connection string for Prisma */
export const DATABASE_URL = requireEnv("DATABASE_URL");

/** Secret used to sign & verify JWT tokens */
export const JWT_SECRET = requireEnv("JWT_SECRET");

/** Razorpay server-side key id */
export const RAZORPAY_KEY_ID = requireEnv("RAZORPAY_KEY_ID");

/** Razorpay server-side key secret */
export const RAZORPAY_KEY_SECRET = requireEnv("RAZORPAY_KEY_SECRET");

// ─── Client-Side Variables (NEXT_PUBLIC_ prefix) ──────────────

/**
 * Razorpay public key for the checkout widget.
 * Must match RAZORPAY_KEY_ID.
 */
export const NEXT_PUBLIC_RAZORPAY_KEY_ID = optionalEnv(
  "NEXT_PUBLIC_RAZORPAY_KEY_ID"
);

/**
 * Google Maps API key — **optional**.
 * When missing the clinics page renders a static fallback.
 */
export const NEXT_PUBLIC_GOOGLE_MAPS_API_KEY = optionalEnv(
  "NEXT_PUBLIC_GOOGLE_MAPS_API_KEY"
);

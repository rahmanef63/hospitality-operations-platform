import { createHash, createHmac, timingSafeEqual } from "node:crypto";

export type AdminRuntimeConfig = {
  email: string;
  password: string;
  sessionSecret: string;
  convexAdminSecret: string;
  siteOrigin: string;
};

function requireValue(name: string, minimumLength = 1): string {
  const value = process.env[name]?.trim();
  if (!value || value.length < minimumLength) {
    throw new Error(`${name} is not configured correctly.`);
  }
  return value;
}

export function getAdminRuntimeConfig(): AdminRuntimeConfig {
  const email = requireValue("HOSPITALITY_ADMIN_EMAIL").toLowerCase();
  if (!/^\S+@\S+\.\S+$/.test(email)) throw new Error("HOSPITALITY_ADMIN_EMAIL is invalid.");
  const siteUrl = new URL(requireValue("NEXT_PUBLIC_SITE_URL"));
  if (process.env.NODE_ENV === "production" && siteUrl.protocol !== "https:") {
    throw new Error("NEXT_PUBLIC_SITE_URL must use HTTPS in production.");
  }
  return {
    email,
    password: requireValue("HOSPITALITY_ADMIN_PASSWORD", 16),
    sessionSecret: requireValue("HOSPITALITY_ADMIN_SESSION_SECRET", 32),
    convexAdminSecret: requireValue("HOSPITALITY_CONVEX_ADMIN_SECRET", 32),
    siteOrigin: siteUrl.origin,
  };
}

export function secureTextEqual(left: string, right: string): boolean {
  const leftHash = createHash("sha256").update(left).digest();
  const rightHash = createHash("sha256").update(right).digest();
  return timingSafeEqual(leftHash, rightHash);
}

export function verifyAdminCredentials(email: string, password: string): boolean {
  try {
    const config = getAdminRuntimeConfig();
    return secureTextEqual(email.trim().toLowerCase(), config.email)
      && secureTextEqual(password, config.password);
  } catch {
    return false;
  }
}

export function hashAdminIdentity(email: string): string {
  const { sessionSecret } = getAdminRuntimeConfig();
  return createHmac("sha256", sessionSecret).update(email.trim().toLowerCase()).digest("hex");
}

export function fingerprintAdminRequest(ip: string, userAgent: string): string {
  const { sessionSecret } = getAdminRuntimeConfig();
  return createHmac("sha256", sessionSecret)
    .update(`${ip.trim()}\n${userAgent.slice(0, 300)}`)
    .digest("hex");
}

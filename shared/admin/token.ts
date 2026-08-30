import { createHmac, timingSafeEqual } from "node:crypto";

export type AdminSessionClaims = {
  version: 1;
  email: string;
  issuedAt: number;
  expiresAt: number;
};

const SESSION_TTL_MS = 12 * 60 * 60 * 1000;

function sign(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

export function createAdminSessionToken(
  email: string,
  secret: string,
  now = Date.now(),
): string {
  const claims: AdminSessionClaims = {
    version: 1,
    email: email.trim().toLowerCase(),
    issuedAt: now,
    expiresAt: now + SESSION_TTL_MS,
  };
  const payload = Buffer.from(JSON.stringify(claims)).toString("base64url");
  return `${payload}.${sign(payload, secret)}`;
}

export function verifyAdminSessionToken(
  token: string,
  secret: string,
  now = Date.now(),
): AdminSessionClaims | null {
  const [payload, signature, extra] = token.split(".");
  if (!payload || !signature || extra) return null;
  const expected = Buffer.from(sign(payload, secret));
  const received = Buffer.from(signature);
  if (expected.length !== received.length || !timingSafeEqual(expected, received)) return null;
  try {
    const claims = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as AdminSessionClaims;
    if (claims.version !== 1 || !claims.email || claims.expiresAt <= now || claims.issuedAt > now + 60_000) {
      return null;
    }
    return claims;
  } catch {
    return null;
  }
}

export const ADMIN_SESSION_TTL_SECONDS = SESSION_TTL_MS / 1000;

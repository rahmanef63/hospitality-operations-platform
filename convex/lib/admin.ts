import { createAdminSessionToken, hmacSha256, verifyAdminSessionToken, type AdminSessionClaims } from "../../shared/admin/token";

function constantTimeTextEqual(left: string, right: string): boolean {
  const length = Math.max(left.length, right.length);
  let mismatch = left.length ^ right.length;
  for (let index = 0; index < length; index += 1) {
    mismatch |= (left.charCodeAt(index) || 0) ^ (right.charCodeAt(index) || 0);
  }
  return mismatch === 0;
}

function requireValue(name: string, minimumLength = 1): string {
  const value = process.env[name]?.trim();
  if (!value || value.length < minimumLength) throw new Error(`${name} is not configured correctly.`);
  return value;
}

function adminEmail() {
  const value = requireValue("HOSPITALITY_ADMIN_EMAIL").toLowerCase();
  if (!/^\S+@\S+\.\S+$/.test(value)) throw new Error("HOSPITALITY_ADMIN_EMAIL is invalid.");
  return value;
}

function sessionSecret() { return requireValue("HOSPITALITY_ADMIN_SESSION_SECRET", 32); }

export function verifyAdminCredentials(email: string, password: string): boolean {
  try {
    return constantTimeTextEqual(email.trim().toLowerCase(), adminEmail())
      && constantTimeTextEqual(password, requireValue("HOSPITALITY_ADMIN_PASSWORD", 16));
  } catch {
    return false;
  }
}

export async function adminIdentityHash(email: string): Promise<string> {
  return hmacSha256(email.trim().toLowerCase(), sessionSecret());
}

export async function adminRequestFingerprint(ip: string, userAgent: string): Promise<string> {
  return hmacSha256(`${ip.trim()}\n${userAgent.slice(0, 300)}`, sessionSecret());
}

export async function issueAdminSession(): Promise<{ token: string; claims: AdminSessionClaims }> {
  const email = adminEmail();
  const actorEmailHash = await adminIdentityHash(email);
  const token = await createAdminSessionToken(email, actorEmailHash, sessionSecret());
  const claims = await verifyAdminSessionToken(token, sessionSecret());
  if (!claims) throw new Error("Failed to create admin session.");
  return { token, claims };
}

export async function authorizeAdminRequest(request: Request): Promise<AdminSessionClaims | null> {
  const authorization = request.headers.get("authorization");
  if (!authorization?.startsWith("Bearer ")) return null;
  try {
    const claims = await verifyAdminSessionToken(authorization.slice(7), sessionSecret());
    return claims && constantTimeTextEqual(claims.email, adminEmail()) ? claims : null;
  } catch {
    return null;
  }
}

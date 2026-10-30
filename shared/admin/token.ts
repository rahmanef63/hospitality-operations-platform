export type AdminSessionClaims = {
  version: 2;
  email: string;
  actorEmailHash: string;
  issuedAt: number;
  expiresAt: number;
};

const SESSION_TTL_MS = 12 * 60 * 60 * 1000;
const encoder = new TextEncoder();
const decoder = new TextDecoder();

function base64UrlEncode(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlDecode(value: string): Uint8Array {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  const binary = atob(padded);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

async function hmacKey(secret: string, usages: KeyUsage[]) {
  if (secret.length < 32) throw new Error("Admin session secret must be at least 32 characters.");
  return crypto.subtle.importKey(
    "raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, usages,
  );
}

export async function hmacSha256(value: string, secret: string): Promise<string> {
  const key = await hmacKey(secret, ["sign"]);
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(value));
  return base64UrlEncode(new Uint8Array(signature));
}

export async function createAdminSessionToken(
  email: string,
  actorEmailHash: string,
  secret: string,
  now = Date.now(),
): Promise<string> {
  const claims: AdminSessionClaims = {
    version: 2,
    email: email.trim().toLowerCase(),
    actorEmailHash,
    issuedAt: now,
    expiresAt: now + SESSION_TTL_MS,
  };
  const payload = base64UrlEncode(encoder.encode(JSON.stringify(claims)));
  return `${payload}.${await hmacSha256(payload, secret)}`;
}

export async function verifyAdminSessionToken(
  token: string,
  secret: string,
  now = Date.now(),
): Promise<AdminSessionClaims | null> {
  const [payload, signature, extra] = token.split(".");
  if (!payload || !signature || extra) return null;
  try {
    const key = await hmacKey(secret, ["verify"]);
    const valid = await crypto.subtle.verify(
      "HMAC", key, base64UrlDecode(signature).buffer as ArrayBuffer, encoder.encode(payload),
    );
    if (!valid) return null;
    const claims = JSON.parse(decoder.decode(base64UrlDecode(payload))) as AdminSessionClaims;
    if (claims.version !== 2 || !claims.email || !claims.actorEmailHash) return null;
    if (claims.expiresAt <= now || claims.issuedAt > now + 60_000) return null;
    return claims;
  } catch {
    return null;
  }
}

export const ADMIN_SESSION_TTL_SECONDS = SESSION_TTL_MS / 1000;

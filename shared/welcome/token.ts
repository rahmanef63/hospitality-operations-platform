import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";

export type GuestWelcomeClaims = {
  version: 1;
  reservationId: string;
  issuedAt: number;
  expiresAt: number;
};

function keyFromSecret(secret: string) {
  if (secret.length < 32) throw new Error("Guest link secret must be at least 32 characters.");
  return createHash("sha256").update(secret).digest();
}

function encode(value: Buffer) {
  return value.toString("base64url");
}

function decode(value: string) {
  return Buffer.from(value, "base64url");
}

export function createGuestWelcomeToken(
  reservationId: string,
  secret: string,
  expiresAt: number,
  now = Date.now(),
): string {
  if (!reservationId || reservationId.length > 160) throw new Error("Reservation ID is invalid.");
  if (!Number.isSafeInteger(expiresAt) || expiresAt <= now) throw new Error("Guest link expiry is invalid.");
  const claims: GuestWelcomeClaims = { version: 1, reservationId, issuedAt: now, expiresAt };
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", keyFromSecret(secret), iv);
  cipher.setAAD(Buffer.from("kamyna-guest-welcome-v1"));
  const ciphertext = Buffer.concat([cipher.update(JSON.stringify(claims), "utf8"), cipher.final()]);
  return ["v1", encode(iv), encode(cipher.getAuthTag()), encode(ciphertext)].join(".");
}

export function verifyGuestWelcomeToken(
  token: string,
  secret: string,
  now = Date.now(),
): GuestWelcomeClaims | null {
  const [version, ivValue, tagValue, ciphertextValue, extra] = token.split(".");
  if (version !== "v1" || !ivValue || !tagValue || !ciphertextValue || extra) return null;
  try {
    const decipher = createDecipheriv("aes-256-gcm", keyFromSecret(secret), decode(ivValue));
    decipher.setAAD(Buffer.from("kamyna-guest-welcome-v1"));
    decipher.setAuthTag(decode(tagValue));
    const payload = Buffer.concat([decipher.update(decode(ciphertextValue)), decipher.final()]).toString("utf8");
    const claims = JSON.parse(payload) as GuestWelcomeClaims;
    if (claims.version !== 1 || typeof claims.reservationId !== "string") return null;
    if (!Number.isSafeInteger(claims.issuedAt) || !Number.isSafeInteger(claims.expiresAt)) return null;
    if (claims.issuedAt > now + 60_000 || claims.expiresAt <= now) return null;
    return claims;
  } catch {
    return null;
  }
}

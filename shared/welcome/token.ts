export type GuestWelcomeClaims = {
  version: 2;
  reservationId: string;
  issuedAt: number;
  expiresAt: number;
};

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

async function encryptionKey(secret: string, usages: KeyUsage[]) {
  if (secret.length < 32) throw new Error("Guest link secret must be at least 32 characters.");
  const digest = await crypto.subtle.digest("SHA-256", encoder.encode(secret));
  return crypto.subtle.importKey("raw", digest, { name: "AES-GCM" }, false, usages);
}

export async function createGuestWelcomeToken(
  reservationId: string,
  secret: string,
  expiresAt: number,
  now = Date.now(),
): Promise<string> {
  if (!reservationId || reservationId.length > 160) throw new Error("Reservation ID is invalid.");
  if (!Number.isSafeInteger(expiresAt) || expiresAt <= now) throw new Error("Guest link expiry is invalid.");
  const claims: GuestWelcomeClaims = { version: 2, reservationId, issuedAt: now, expiresAt };
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await encryptionKey(secret, ["encrypt"]);
  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv, additionalData: encoder.encode("hospitality-guest-welcome-v2") },
    key,
    encoder.encode(JSON.stringify(claims)),
  );
  return ["v2", base64UrlEncode(iv), base64UrlEncode(new Uint8Array(ciphertext))].join(".");
}

export async function verifyGuestWelcomeToken(
  token: string,
  secret: string,
  now = Date.now(),
): Promise<GuestWelcomeClaims | null> {
  const [version, ivValue, ciphertextValue, extra] = token.split(".");
  if (version !== "v2" || !ivValue || !ciphertextValue || extra) return null;
  try {
    const key = await encryptionKey(secret, ["decrypt"]);
    const payload = await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: base64UrlDecode(ivValue).buffer as ArrayBuffer,
        additionalData: encoder.encode("hospitality-guest-welcome-v2"),
      },
      key,
      base64UrlDecode(ciphertextValue).buffer as ArrayBuffer,
    );
    const claims = JSON.parse(decoder.decode(payload)) as GuestWelcomeClaims;
    if (claims.version !== 2 || typeof claims.reservationId !== "string") return null;
    if (!Number.isSafeInteger(claims.issuedAt) || !Number.isSafeInteger(claims.expiresAt)) return null;
    if (claims.issuedAt > now + 60_000 || claims.expiresAt <= now) return null;
    return claims;
  } catch {
    return null;
  }
}

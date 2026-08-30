import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";

function keyFromSecret(secret: string) {
  if (secret.length < 32) throw new Error("AI encryption secret must be at least 32 characters.");
  return createHash("sha256").update(secret).digest();
}

export function fingerprintApiKey(apiKey: string): string {
  return createHash("sha256").update(apiKey).digest("hex").slice(0, 12);
}

export function encryptApiKey(apiKey: string, secret: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", keyFromSecret(secret), iv);
  cipher.setAAD(Buffer.from("hospitality-ai-byok-v1"));
  const ciphertext = Buffer.concat([cipher.update(apiKey, "utf8"), cipher.final()]);
  return ["v1", iv.toString("base64url"), cipher.getAuthTag().toString("base64url"), ciphertext.toString("base64url")].join(".");
}

export function decryptApiKey(payload: string, secret: string): string {
  const [version, iv, tag, ciphertext, extra] = payload.split(".");
  if (version !== "v1" || !iv || !tag || !ciphertext || extra) throw new Error("Stored API key is invalid.");
  try {
    const decipher = createDecipheriv("aes-256-gcm", keyFromSecret(secret), Buffer.from(iv, "base64url"));
    decipher.setAAD(Buffer.from("hospitality-ai-byok-v1"));
    decipher.setAuthTag(Buffer.from(tag, "base64url"));
    return Buffer.concat([decipher.update(Buffer.from(ciphertext, "base64url")), decipher.final()]).toString("utf8");
  } catch {
    throw new Error("Stored API key cannot be decrypted.");
  }
}

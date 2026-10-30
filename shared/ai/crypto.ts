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
  return Uint8Array.from(atob(padded), (char) => char.charCodeAt(0));
}

async function encryptionKey(secret: string, usages: KeyUsage[]) {
  if (secret.length < 32) throw new Error("AI encryption secret must be at least 32 characters.");
  const digest = await crypto.subtle.digest("SHA-256", encoder.encode(secret));
  return crypto.subtle.importKey("raw", digest, { name: "AES-GCM" }, false, usages);
}

export async function fingerprintApiKey(apiKey: string): Promise<string> {
  const digest = new Uint8Array(await crypto.subtle.digest("SHA-256", encoder.encode(apiKey)));
  return Array.from(digest.slice(0, 6), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function encryptApiKey(apiKey: string, secret: string): Promise<string> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await encryptionKey(secret, ["encrypt"]);
  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv, additionalData: encoder.encode("hospitality-ai-byok-v2") }, key, encoder.encode(apiKey),
  );
  return ["v2", base64UrlEncode(iv), base64UrlEncode(new Uint8Array(ciphertext))].join(".");
}

export async function decryptApiKey(payload: string, secret: string): Promise<string> {
  const [version, iv, ciphertext, extra] = payload.split(".");
  if (version !== "v2" || !iv || !ciphertext || extra) throw new Error("Stored API key is invalid.");
  try {
    const key = await encryptionKey(secret, ["decrypt"]);
    const plain = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: base64UrlDecode(iv).buffer as ArrayBuffer, additionalData: encoder.encode("hospitality-ai-byok-v2") },
      key, base64UrlDecode(ciphertext).buffer as ArrayBuffer,
    );
    return decoder.decode(plain);
  } catch {
    throw new Error("Stored API key cannot be decrypted.");
  }
}

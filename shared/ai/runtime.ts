import "server-only";
import { getAiSecret } from "@/shared/convex";
import { decryptApiKey } from "./crypto";
import type { AiProvider } from "./types";

export function getAiEncryptionSecret(): string {
  const value = process.env.HOSPITALITY_AI_ENCRYPTION_KEY?.trim();
  if (!value || value.length < 32) throw new Error("HOSPITALITY_AI_ENCRYPTION_KEY is not configured correctly.");
  return value;
}

export async function loadAiRuntimeSettings(): Promise<{
  provider: AiProvider;
  model: string;
  apiKey: string;
}> {
  const stored = await getAiSecret();
  if (!stored.exists || !stored.enabled || !stored.provider || !stored.model || !stored.encryptedApiKey) {
    throw new Error("BYOK AI is not configured and enabled.");
  }
  return {
    provider: stored.provider,
    model: stored.model,
    apiKey: decryptApiKey(stored.encryptedApiKey, getAiEncryptionSecret()),
  };
}

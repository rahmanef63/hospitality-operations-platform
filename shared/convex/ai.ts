import "server-only";
import type { AiProvider, AiSettingsSummary, AiStoredSecret } from "@/shared/ai/types";
import { adminFetch } from "./core";

export function getAiSettings(): Promise<AiSettingsSummary> {
  return adminFetch<AiSettingsSummary>("/admin/ai-overview", {});
}

export function getAiSecret(): Promise<AiStoredSecret> {
  return adminFetch<AiStoredSecret>("/admin/ai-secret", {});
}

export function upsertAiSettings(input: {
  provider: AiProvider;
  model: string;
  enabled: boolean;
  encryptedApiKey?: string;
  keyFingerprint?: string;
  clearKey: boolean;
}) {
  return adminFetch<{ configured: boolean; updatedAt: number }>("/admin/ai-upsert", input);
}

export function recordAiEvent(input: {
  action: "save" | "test" | "translate";
  provider?: AiProvider;
  targetCount?: number;
  actorEmailHash: string;
}) {
  return adminFetch<{ ok: true }>("/admin/ai-event", input);
}

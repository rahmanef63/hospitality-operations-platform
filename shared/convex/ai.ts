import "server-only";
import type { AiProvider, AiSettingsSummary, WelcomeTranslation } from "@/shared/ai/types";
import type { WelcomeContent, WelcomeLocale } from "@/shared/welcome/types";
import { adminFetch } from "./core";

export function getAiSettings(): Promise<AiSettingsSummary> {
  return adminFetch<AiSettingsSummary>("/admin/ai-overview", {});
}

export function upsertAiSettings(input: {
  provider: AiProvider; model: string; enabled: boolean; apiKey?: string; clearKey: boolean;
}) {
  return adminFetch<{ configured: boolean; updatedAt: number }>("/admin/ai/settings", input);
}

export function testAiSettings() {
  return adminFetch<{ ok: true; provider: AiProvider }>("/admin/ai/test", {});
}

export function translateWithAi(input: {
  sourceLocale: WelcomeLocale; source: WelcomeContent; targetLocales: WelcomeLocale[];
}) {
  return adminFetch<{ provider: AiProvider; translations: WelcomeTranslation[] }>("/admin/ai/translate", input);
}

export function recordAiEvent(input: {
  action: "save" | "test" | "translate"; provider?: AiProvider; targetCount?: number; actorEmailHash: string;
}) {
  return adminFetch<{ ok: true }>("/admin/ai-event", input);
}

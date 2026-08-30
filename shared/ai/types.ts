import type { WelcomeContent, WelcomeLocale } from "@/shared/welcome";

export const AI_PROVIDERS = ["openai", "openrouter", "anthropic", "gemini"] as const;
export type AiProvider = (typeof AI_PROVIDERS)[number];

export type AiSettingsSummary = {
  exists: boolean;
  configured: boolean;
  enabled: boolean;
  provider?: AiProvider;
  model?: string;
  keyFingerprint?: string;
  updatedAt?: number;
};

export type AiStoredSecret = AiSettingsSummary & {
  encryptedApiKey?: string;
};

export type WelcomeTranslation = {
  locale: WelcomeLocale;
  content: WelcomeContent;
};

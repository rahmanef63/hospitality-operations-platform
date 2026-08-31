import type { ActionCtx } from "./_generated/server";
import { internal } from "./_generated/api";
import { isAiProvider, validateAiModel, validateApiKey } from "../shared/ai/config";
import { decryptApiKey, encryptApiKey, fingerprintApiKey } from "../shared/ai/crypto";
import { translateWelcomeContent } from "../shared/ai/translate";
import type { AiProvider } from "../shared/ai/types";
import type { WelcomeContent, WelcomeLocale } from "../shared/welcome/types";
import { adminAction } from "./httpSecurity";

function encryptionSecret() {
  const value = process.env.HOSPITALITY_AI_ENCRYPTION_KEY?.trim();
  if (!value || value.length < 32) throw new Error("HOSPITALITY_AI_ENCRYPTION_KEY is not configured correctly.");
  return value;
}

async function runtimeSettings(ctx: ActionCtx) {
  const stored = await ctx.runQuery(internal.aiSettings.getSecret, {});
  if (!stored.exists || !stored.enabled || !stored.provider || !stored.model || !stored.encryptedApiKey) {
    throw new Error("BYOK AI is not configured and enabled.");
  }
  return {
    provider: stored.provider as AiProvider,
    model: stored.model,
    apiKey: await decryptApiKey(stored.encryptedApiKey, encryptionSecret()),
  };
}

function locales(value: unknown): WelcomeLocale[] {
  if (!Array.isArray(value)) throw new Error("Target locales are invalid.");
  return value.map(String) as WelcomeLocale[];
}

function content(value: unknown): WelcomeContent {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Welcome content is invalid.");
  const row = value as Record<string, unknown>;
  return { headline: String(row.headline ?? ""), body: String(row.body ?? ""), signature: String(row.signature ?? "") };
}

export const aiSettingsUpsert = adminAction(async (ctx, body) => {
  if (!isAiProvider(body.provider)) throw new Error("AI provider is invalid.");
  const model = validateAiModel(body.model);
  const clearKey = body.clearKey === true;
  const rawKey = typeof body.apiKey === "string" && body.apiKey.trim() ? validateApiKey(body.apiKey) : undefined;
  const encryptedApiKey = rawKey ? await encryptApiKey(rawKey, encryptionSecret()) : undefined;
  const keyFingerprint = rawKey ? await fingerprintApiKey(rawKey) : undefined;
  return ctx.runMutation(internal.aiSettings.upsert, {
    provider: body.provider, model, enabled: body.enabled === true, encryptedApiKey, keyFingerprint, clearKey,
  });
});

export const aiSettingsTest = adminAction(async (ctx) => {
  const settings = await runtimeSettings(ctx);
  const source: WelcomeContent = { headline: "Welcome, {{guest}}", body: "We hope your stay feels calm and comfortable.", signature: "Property" };
  await translateWelcomeContent({ ...settings, sourceLocale: "en", source, targetLocales: ["id"] });
  return { ok: true, provider: settings.provider };
});

export const aiTranslate = adminAction(async (ctx, body) => {
  const settings = await runtimeSettings(ctx);
  const sourceLocale = String(body.sourceLocale ?? "") as WelcomeLocale;
  const translations = await translateWelcomeContent({
    ...settings, sourceLocale, source: content(body.source), targetLocales: locales(body.targetLocales),
  });
  return { provider: settings.provider, translations };
});

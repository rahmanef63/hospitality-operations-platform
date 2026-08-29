import "server-only";
import { WELCOME_GUEST_TOKEN, isWelcomeLocale, validateWelcomeContent, type WelcomeContent, type WelcomeLocale } from "@/shared/welcome";
import { translationPrompt } from "./prompt";
import { requestStructuredTranslation } from "./providers/request";
import type { AiProvider, WelcomeTranslation } from "./types";

function parseTranslations(payload: unknown, targetLocales: WelcomeLocale[], source: WelcomeContent): WelcomeTranslation[] {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) throw new Error("AI translation payload is invalid.");
  const rows = (payload as { translations?: unknown }).translations;
  if (!Array.isArray(rows) || rows.length !== targetLocales.length) throw new Error("AI returned an incomplete translation set.");
  const expected = new Set(targetLocales);
  const seen = new Set<WelcomeLocale>();
  const preserveGuest = source.headline.includes(WELCOME_GUEST_TOKEN);
  const translations = rows.map((row) => {
    if (!row || typeof row !== "object" || Array.isArray(row)) throw new Error("AI translation row is invalid.");
    const value = row as Record<string, unknown>;
    if (!isWelcomeLocale(value.locale) || !expected.has(value.locale) || seen.has(value.locale)) throw new Error("AI returned an unexpected locale.");
    const parsed = validateWelcomeContent({
      headline: String(value.headline ?? ""),
      body: String(value.body ?? ""),
      signature: String(value.signature ?? ""),
    });
    if (!parsed.ok) throw new Error(parsed.error);
    if (preserveGuest && !parsed.value.headline.includes(WELCOME_GUEST_TOKEN)) throw new Error(`Translation ${value.locale} did not preserve ${WELCOME_GUEST_TOKEN}.`);
    seen.add(value.locale);
    return { locale: value.locale, content: parsed.value };
  });
  if (seen.size !== expected.size) throw new Error("AI returned duplicate or missing locales.");
  return translations;
}

export async function translateWelcomeContent(input: {
  provider: AiProvider;
  model: string;
  apiKey: string;
  sourceLocale: WelcomeLocale;
  source: WelcomeContent;
  targetLocales: WelcomeLocale[];
}): Promise<WelcomeTranslation[]> {
  const targets = [...new Set(input.targetLocales)].filter((locale) => locale !== input.sourceLocale);
  if (!targets.length || targets.length > 19) throw new Error("Choose between 1 and 19 target languages.");
  const prompt = translationPrompt({ sourceLocale: input.sourceLocale, source: input.source, targetLocales: targets });
  const payload = await requestStructuredTranslation({
    provider: input.provider,
    model: input.model,
    apiKey: input.apiKey,
    ...prompt,
  });
  return parseTranslations(payload, targets, input.source);
}

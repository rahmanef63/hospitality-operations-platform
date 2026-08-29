import { DEFAULT_WELCOME_CONTENT, defaultWelcomeContent } from "./defaults";
import { WELCOME_LOCALE_META } from "./locales";
import { WELCOME_LOCALES, type RenderedWelcome, type WelcomeContent, type WelcomeLocale } from "./types";

export const WELCOME_PROPERTY_SLUG = "ruma-kamyna";
export const WELCOME_GUEST_TOKEN = "{{guest}}";

export const WELCOME_LIMITS = {
  guestName: 80,
  headline: 120,
  body: 900,
  signature: 180,
} as const;

export { DEFAULT_WELCOME_CONTENT, defaultWelcomeContent };

export function isWelcomeLocale(value: unknown): value is WelcomeLocale {
  return typeof value === "string" && (WELCOME_LOCALES as readonly string[]).includes(value);
}

export function parseWelcomeLocale(value: unknown, fallback: WelcomeLocale = "id"): WelcomeLocale {
  return isWelcomeLocale(value) ? value : fallback;
}

export function normalizeGuestName(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const normalized = value
    .normalize("NFKC")
    .replace(/<[^>]*>/g, "")
    .replace(/[^\p{L}\p{M}\p{N} .'‘’\-]/gu, "")
    .replace(/\s+/g, " ")
    .trim();
  return normalized ? normalized.slice(0, WELCOME_LIMITS.guestName) : undefined;
}

export function validateWelcomeContent(input: WelcomeContent):
  | { ok: true; value: WelcomeContent }
  | { ok: false; error: string } {
  const value = {
    headline: input.headline.trim(),
    body: input.body.trim(),
    signature: input.signature.trim(),
  };
  if (!value.headline || !value.body || !value.signature) return { ok: false, error: "All welcome fields are required." };
  if (value.headline.length > WELCOME_LIMITS.headline) return { ok: false, error: `Headline must be ${WELCOME_LIMITS.headline} characters or fewer.` };
  if (value.body.length > WELCOME_LIMITS.body) return { ok: false, error: `Message must be ${WELCOME_LIMITS.body} characters or fewer.` };
  if (value.signature.length > WELCOME_LIMITS.signature) return { ok: false, error: `Signature must be ${WELCOME_LIMITS.signature} characters or fewer.` };
  return { ok: true, value };
}

export function renderWelcomeContent(content: WelcomeContent, locale: WelcomeLocale, guestName?: string, propertyName = "Ruma Kamyna"): RenderedWelcome {
  const normalizedName = normalizeGuestName(guestName);
  const headline = content.headline.includes(WELCOME_GUEST_TOKEN)
    ? normalizedName
      ? content.headline.replaceAll(WELCOME_GUEST_TOKEN, normalizedName)
      : WELCOME_LOCALE_META[locale].genericHeadline.replaceAll("Ruma Kamyna", propertyName)
    : content.headline;
  return { ...content, headline, guestName: normalizedName };
}

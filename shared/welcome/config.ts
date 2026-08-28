import type { RenderedWelcome, WelcomeContent, WelcomeLocale } from "./types";

export const WELCOME_PROPERTY_SLUG = "ruma-kamyna";
export const WELCOME_GUEST_TOKEN = "{{guest}}";

export const WELCOME_LIMITS = {
  guestName: 80,
  headline: 120,
  body: 900,
  signature: 180,
} as const;

export const DEFAULT_WELCOME_CONTENT: Record<WelcomeLocale, WelcomeContent> = {
  id: {
    headline: `Selamat datang, ${WELCOME_GUEST_TOKEN}.`,
    body: "Semoga waktu Anda di sini berjalan sedikit lebih pelan. Beristirahatlah, nikmati ruangnya, dan hubungi kami kapan pun Anda membutuhkan bantuan.",
    signature: "Ruma Kamyna · return to stillness.",
  },
  en: {
    headline: `Welcome, ${WELCOME_GUEST_TOKEN}.`,
    body: "May your time here move a little more slowly. Settle in, enjoy the space, and reach us whenever you need a hand.",
    signature: "Ruma Kamyna · return to stillness.",
  },
};

export function isWelcomeLocale(value: unknown): value is WelcomeLocale {
  return value === "id" || value === "en";
}

export function parseWelcomeLocale(value: unknown): WelcomeLocale {
  return isWelcomeLocale(value) ? value : "id";
}

export function normalizeGuestName(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const normalized = value
    .normalize("NFKC")
    .replace(/<[^>]*>/g, "")
    .replace(/[^\p{L}\p{M}\p{N} .'‘’\-]/gu, "")
    .replace(/\s+/g, " ")
    .trim();
  if (!normalized) return undefined;
  return normalized.slice(0, WELCOME_LIMITS.guestName);
}

export function validateWelcomeContent(input: WelcomeContent):
  | { ok: true; value: WelcomeContent }
  | { ok: false; error: string } {
  const value = {
    headline: input.headline.trim(),
    body: input.body.trim(),
    signature: input.signature.trim(),
  };
  if (!value.headline || !value.body || !value.signature) {
    return { ok: false, error: "All welcome fields are required." };
  }
  if (value.headline.length > WELCOME_LIMITS.headline) {
    return { ok: false, error: `Headline must be ${WELCOME_LIMITS.headline} characters or fewer.` };
  }
  if (value.body.length > WELCOME_LIMITS.body) {
    return { ok: false, error: `Message must be ${WELCOME_LIMITS.body} characters or fewer.` };
  }
  if (value.signature.length > WELCOME_LIMITS.signature) {
    return { ok: false, error: `Signature must be ${WELCOME_LIMITS.signature} characters or fewer.` };
  }
  return { ok: true, value };
}

export function renderWelcomeContent(
  content: WelcomeContent,
  locale: WelcomeLocale,
  guestName?: string,
): RenderedWelcome {
  const normalizedName = normalizeGuestName(guestName);
  const genericHeadline = locale === "id"
    ? "Selamat datang di Ruma Kamyna."
    : "Welcome to Ruma Kamyna.";
  const headline = content.headline.includes(WELCOME_GUEST_TOKEN)
    ? normalizedName
      ? content.headline.replaceAll(WELCOME_GUEST_TOKEN, normalizedName)
      : genericHeadline
    : content.headline;
  return { ...content, headline, guestName: normalizedName };
}

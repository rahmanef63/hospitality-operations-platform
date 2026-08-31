import "server-only";
import { resolveReservationWelcomeToken } from "@/shared/convex";
import { normalizeGuestName, parseWelcomeLocale } from "./config";
import type { ReservationWelcomeContext, WelcomeLocale } from "./types";

export type ResolvedGuestWelcome = {
  valid: boolean;
  locale: WelcomeLocale;
  guestName?: string;
  propertySlug?: string;
  context?: ReservationWelcomeContext;
  token?: string;
};

function safePropertySlug(value: unknown) {
  if (typeof value !== "string") return undefined;
  const slug = value.trim().toLowerCase();
  return /^[a-z0-9][a-z0-9-]{1,62}[a-z0-9]$/.test(slug) ? slug : undefined;
}

export async function resolveGuestWelcomeRequest(input: {
  token?: unknown;
  locale?: unknown;
  name?: unknown;
  property?: unknown;
}): Promise<ResolvedGuestWelcome> {
  const token = typeof input.token === "string" ? input.token.trim() : "";
  if (!token) {
    return {
      valid: true,
      locale: parseWelcomeLocale(input.locale),
      guestName: normalizeGuestName(input.name),
      propertySlug: safePropertySlug(input.property),
    };
  }
  const context = await resolveReservationWelcomeToken(token);
  if (!context) return { valid: false, locale: "id" };
  return {
    valid: true,
    locale: parseWelcomeLocale(input.locale, context.locale),
    guestName: context.guestName,
    propertySlug: context.propertySlug,
    context,
    token,
  };
}

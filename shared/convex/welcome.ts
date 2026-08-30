import "server-only";
import { api } from "@/convex/_generated/api";
import {
  DEFAULT_WELCOME_CONTENT,
  WELCOME_LOCALES,
  WELCOME_PROPERTY_SLUG,
  type WelcomeAdminOverview,
  type WelcomeConfigState,
  type WelcomeContent,
  type ReservationWelcomeContext,
  type WelcomeLocale,
} from "@/shared/welcome";
import { adminFetch, getConvexClient } from "./core";

function defaultConfig(locale: WelcomeLocale): WelcomeConfigState {
  return { locale, draft: DEFAULT_WELCOME_CONTENT[locale], version: 0 };
}

export async function getPublishedWelcome(locale: WelcomeLocale, propertySlug: string = WELCOME_PROPERTY_SLUG) {
  return getConvexClient().query(api.welcome.getPublished, {
    propertySlug,
    locale,
  });
}

export async function getWelcomeAdminOverview(propertySlug: string = WELCOME_PROPERTY_SLUG): Promise<WelcomeAdminOverview> {
  const response = await adminFetch<{
    configs: WelcomeConfigState[];
    events: WelcomeAdminOverview["events"];
  }>("/admin/welcome-overview", { propertySlug });
  const configs = Object.fromEntries(
    WELCOME_LOCALES.map((locale) => [locale, defaultConfig(locale)]),
  ) as Record<WelcomeLocale, WelcomeConfigState>;
  for (const config of response.configs) configs[config.locale] = config;
  return { configs, events: response.events };
}

export async function upsertWelcome(input: {
  propertySlug?: string;
  locale: WelcomeLocale;
  content: WelcomeContent;
  publish: boolean;
  actorEmailHash: string;
  auditAction?: "translate";
}) {
  return adminFetch<{ version: number; publishedAt?: number }>("/admin/welcome-upsert", {
    propertySlug: input.propertySlug ?? WELCOME_PROPERTY_SLUG,
    locale: input.locale,
    headline: input.content.headline,
    body: input.content.body,
    signature: input.content.signature,
    publish: input.publish,
    auditAction: input.auditAction,
    actorEmailHash: input.actorEmailHash,
  });
}

export async function recordAdminLoginAttempt(input: { fingerprint: string; success: boolean }) {
  return adminFetch<{ allowed: boolean; locked: boolean; retryAfterSeconds: number }>(
    "/admin/login-attempt",
    input,
  );
}

export async function ensureWelcomeDefaults(actorEmailHash: string) {
  return adminFetch<{ created: number }>("/admin/ensure-welcome-defaults", { actorEmailHash });
}

export async function getReservationWelcomeContext(reservationId: string): Promise<ReservationWelcomeContext | null> {
  return adminFetch<ReservationWelcomeContext | null>("/admin/welcome-reservation-context", { reservationId });
}

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
import { adminFetch, getConvexClient, getConvexSiteUrl } from "./core";

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

export async function ensureWelcomeDefaults(actorEmailHash: string) {
  return adminFetch<{ created: number }>("/admin/ensure-welcome-defaults", { actorEmailHash });
}

export async function createReservationWelcomeTokens(items: Array<{ reservationId: string; expiresAt: number }>) {
  return adminFetch<Array<{ reservationId: string; token: string }>>("/admin/welcome-tokens", { items });
}

export async function resolveReservationWelcomeToken(token: string): Promise<ReservationWelcomeContext | null> {
  const response = await fetch(`${getConvexSiteUrl()}/welcome/token/resolve`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
    cache: "no-store",
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) return null;
  const payload = await response.json() as { ok?: boolean; data?: ReservationWelcomeContext };
  return payload.ok && payload.data ? payload.data : null;
}

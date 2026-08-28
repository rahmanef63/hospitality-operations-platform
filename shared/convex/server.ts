import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { getAdminRuntimeConfig } from "@/shared/admin";
import {
  DEFAULT_WELCOME_CONTENT,
  WELCOME_LOCALES,
  WELCOME_PROPERTY_SLUG,
  type WelcomeAdminOverview,
  type WelcomeConfigState,
  type WelcomeContent,
  type WelcomeLocale,
} from "@/shared/welcome";

let cachedClient: ConvexHttpClient | undefined;
let cachedUrl: string | undefined;

function requireConvexUrl(): string {
  const value = process.env.NEXT_PUBLIC_CONVEX_URL?.trim();
  if (!value) throw new Error("NEXT_PUBLIC_CONVEX_URL is not configured.");
  const url = new URL(value);
  if (process.env.NODE_ENV === "production" && url.protocol !== "https:") {
    throw new Error("NEXT_PUBLIC_CONVEX_URL must use HTTPS in production.");
  }
  return url.toString().replace(/\/$/, "");
}

function getClient(): ConvexHttpClient {
  const url = requireConvexUrl();
  if (!cachedClient || cachedUrl !== url) {
    cachedClient = new ConvexHttpClient(url);
    cachedUrl = url;
  }
  return cachedClient;
}

function getConvexSiteUrl(): string {
  const url = new URL(requireConvexUrl());
  if (!url.hostname.endsWith(".convex.cloud")) throw new Error("Convex Cloud URL is invalid.");
  url.hostname = url.hostname.replace(/\.convex\.cloud$/, ".convex.site");
  return url.origin;
}

async function adminFetch<T>(path: string, body: unknown): Promise<T> {
  const { convexAdminSecret } = getAdminRuntimeConfig();
  const response = await fetch(`${getConvexSiteUrl()}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${convexAdminSecret}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
    signal: AbortSignal.timeout(8_000),
  });
  const payload = await response.json() as { ok: boolean; data?: T; error?: string };
  if (!response.ok || !payload.ok || payload.data === undefined) {
    throw new Error(payload.error ?? "Convex admin operation failed.");
  }
  return payload.data;
}

function defaultConfig(locale: WelcomeLocale): WelcomeConfigState {
  return { locale, draft: DEFAULT_WELCOME_CONTENT[locale], version: 0 };
}

export async function getPublishedWelcome(locale: WelcomeLocale) {
  return getClient().query(api.welcome.getPublished, {
    propertySlug: WELCOME_PROPERTY_SLUG,
    locale,
  });
}

export async function getWelcomeAdminOverview(): Promise<WelcomeAdminOverview> {
  const response = await adminFetch<{
    configs: WelcomeConfigState[];
    events: WelcomeAdminOverview["events"];
  }>("/admin/welcome-overview", { propertySlug: WELCOME_PROPERTY_SLUG });
  const configs = Object.fromEntries(
    WELCOME_LOCALES.map((locale) => [locale, defaultConfig(locale)]),
  ) as Record<WelcomeLocale, WelcomeConfigState>;
  for (const config of response.configs) configs[config.locale] = config;
  return { configs, events: response.events };
}

export async function upsertWelcome(input: {
  locale: WelcomeLocale;
  content: WelcomeContent;
  publish: boolean;
  actorEmailHash: string;
}) {
  return adminFetch<{ version: number; publishedAt?: number }>("/admin/welcome-upsert", {
    propertySlug: WELCOME_PROPERTY_SLUG,
    locale: input.locale,
    headline: input.content.headline,
    body: input.content.body,
    signature: input.content.signature,
    publish: input.publish,
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

import type { NextRequest } from "next/server";
import { getPublishedWelcome } from "@/shared/convex";
import {
  DEFAULT_WELCOME_CONTENT,
  WELCOME_PROPERTY_SLUG,
  normalizeGuestName,
  parseWelcomeLocale,
  renderWelcomeContent,
} from "@/shared/welcome";


async function buildResponse(localeValue: unknown, nameValue: unknown) {
  const locale = parseWelcomeLocale(localeValue);
  const guestName = normalizeGuestName(nameValue);
  let source: "convex" | "fallback" = "convex";
  let version = 0;
  let publishedAt: number | undefined;
  let content = DEFAULT_WELCOME_CONTENT[locale];
  try {
    const published = await getPublishedWelcome(locale);
    if (published) {
      content = published.content;
      version = published.version;
      publishedAt = published.publishedAt;
    } else {
      source = "fallback";
    }
  } catch {
    source = "fallback";
  }
  return {
    ok: true,
    property: { slug: WELCOME_PROPERTY_SLUG, name: "Ruma Kamyna" },
    locale,
    welcome: renderWelcomeContent(content, locale, guestName),
    version,
    source,
    publishedAt: publishedAt ? new Date(publishedAt).toISOString() : null,
    generatedAt: new Date().toISOString(),
  };
}

function json(payload: unknown, status = 200) {
  return Response.json(payload, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  return json(await buildResponse(params.get("locale"), params.get("name")));
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: "Request body must be valid JSON." }, 400);
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return json({ ok: false, error: "Request body must be an object." }, 400);
  }
  const input = body as { locale?: unknown; name?: unknown };
  return json(await buildResponse(input.locale, input.name));
}

import type { NextRequest } from "next/server";
import { getPublishedWelcome } from "@/shared/convex";
import { getPropertyBySlug } from "@/shared/content";
import { defaultWelcomeContent, renderWelcomeContent } from "@/shared/welcome";
import { resolveGuestWelcomeRequest } from "@/shared/welcome/resolve";

async function buildResponse(input: { locale?: unknown; name?: unknown; token?: unknown; property?: unknown }) {
  const resolved = await resolveGuestWelcomeRequest(input);
  if (!resolved.valid) return { status: 404, payload: { ok: false, error: "Welcome link is invalid or expired." } };
  const propertySlug = resolved.propertySlug ?? "ruma-kamyna";
  const property = await getPropertyBySlug(propertySlug);
  const propertyName = resolved.context?.propertyName ?? property?.name ?? "Ruma Kamyna";
  let source: "convex" | "fallback" = "convex";
  let version = 0;
  let publishedAt: number | undefined;
  let content = defaultWelcomeContent(resolved.locale, propertyName);
  try {
    const published = await getPublishedWelcome(resolved.locale, propertySlug);
    if (published) {
      content = published.content;
      version = published.version;
      publishedAt = published.publishedAt;
    } else source = "fallback";
  } catch { source = "fallback"; }
  return {
    status: 200,
    payload: {
      ok: true,
      property: { slug: propertySlug, name: propertyName },
      locale: resolved.locale,
      welcome: renderWelcomeContent(content, resolved.locale, resolved.guestName, propertyName),
      stay: resolved.context ?? null,
      version,
      source,
      publishedAt: publishedAt ? new Date(publishedAt).toISOString() : null,
      generatedAt: new Date().toISOString(),
    },
  };
}

function json(payload: unknown, status = 200) {
  return Response.json(payload, { status, headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" } });
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const result = await buildResponse({ locale: params.get("locale"), name: params.get("name"), token: params.get("token"), property: params.get("property") });
  return json(result.payload, result.status);
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try { body = await request.json(); } catch { return json({ ok: false, error: "Request body must be valid JSON." }, 400); }
  if (!body || typeof body !== "object" || Array.isArray(body)) return json({ ok: false, error: "Request body must be an object." }, 400);
  const result = await buildResponse(body as { locale?: unknown; name?: unknown; token?: unknown; property?: unknown });
  return json(result.payload, result.status);
}

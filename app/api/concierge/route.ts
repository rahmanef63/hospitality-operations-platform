import { type NextRequest, NextResponse } from "next/server";
import { answerConcierge, normalizeConciergeMessage } from "@/shared/concierge";
import {
  RUMA_KAMYNA_CONTACT,
  RUMA_KAMYNA_LOCATION,
  RUMA_KAMYNA_MAPS_PROFILE_URL,
} from "@/shared/config/ruma-kamyna";
import { getPublicPropertyFacts } from "@/shared/convex";

const MAX_BODY_BYTES = 8_192;

function json(payload: unknown, status = 200) {
  return NextResponse.json(payload, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      "X-Robots-Tag": "noindex, nofollow, noarchive",
    },
  });
}

export async function POST(request: NextRequest) {
  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    return json({ ok: false, error: "Request body is too large." }, 413);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: "Invalid JSON body." }, 400);
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return json({ ok: false, error: "Request body must be an object." }, 400);
  }

  const message = normalizeConciergeMessage((body as Record<string, unknown>).message);
  if (!message) return json({ ok: false, error: "Message is required." }, 400);

  const facts = await getPublicPropertyFacts("ruma-kamyna");
  if (!facts) return json({ ok: false, error: "Property information is unavailable." }, 503);

  const reply = answerConcierge(message, {
    facts,
    address: RUMA_KAMYNA_LOCATION.displayAddress,
    email: RUMA_KAMYNA_CONTACT.email,
    whatsappHref: RUMA_KAMYNA_CONTACT.whatsappHref,
    mapHref: RUMA_KAMYNA_MAPS_PROFILE_URL,
  });

  return json({ ok: true, reply, source: facts.source });
}

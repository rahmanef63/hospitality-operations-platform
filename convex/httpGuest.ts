import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import type { Id } from "./_generated/dataModel";
import { createGuestWelcomeToken, verifyGuestWelcomeToken } from "../shared/welcome/token";
import { adminAction, json, readJson } from "./httpSecurity";

function guestSecret() {
  const value = process.env.HOSPITALITY_GUEST_LINK_SECRET?.trim();
  if (!value || value.length < 32) throw new Error("HOSPITALITY_GUEST_LINK_SECRET is not configured correctly.");
  return value;
}

export const adminWelcomeTokens = adminAction(async (_ctx, body) => {
  if (!Array.isArray(body.items) || body.items.length > 200) throw new Error("Guest token batch is invalid.");
  const items = body.items.map((item) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) throw new Error("Guest token item is invalid.");
    const row = item as Record<string, unknown>;
    const reservationId = String(row.reservationId ?? "");
    const expiresAt = Number(row.expiresAt);
    if (!reservationId || reservationId.length > 160 || !Number.isSafeInteger(expiresAt)) throw new Error("Guest token item is invalid.");
    return { reservationId, expiresAt };
  });
  return Promise.all(items.map(async (item) => ({
    reservationId: item.reservationId,
    token: await createGuestWelcomeToken(item.reservationId, guestSecret(), item.expiresAt),
  })));
});

export const welcomeTokenResolve = httpAction(async (ctx, request) => {
  if (request.method !== "POST") return json({ ok: false, error: "Method not allowed" }, 405);
  try {
    const body = await readJson(request);
    const token = String(body.token ?? "").trim().slice(0, 2_000);
    const claims = token ? await verifyGuestWelcomeToken(token, guestSecret()) : null;
    if (!claims) return json({ ok: false, error: "Invalid or expired token" }, 404);
    const context = await ctx.runQuery(internal.welcomeReservations.getContext, {
      reservationId: claims.reservationId as Id<"reservations">,
    });
    return context ? json({ ok: true, data: context }) : json({ ok: false, error: "Reservation unavailable" }, 404);
  } catch {
    return json({ ok: false, error: "Invalid or expired token" }, 404);
  }
});

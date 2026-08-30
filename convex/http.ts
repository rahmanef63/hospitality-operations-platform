import { httpRouter } from "convex/server";
import { httpAction, type ActionCtx } from "./_generated/server";
import { internal } from "./_generated/api";
import type { Id } from "./_generated/dataModel";
import { authorizeAdminRequest } from "./lib/admin";
import { handlePmsAdmin } from "./pms/dispatch";
import { welcomeLocaleValue } from "./welcomeLocale";

const http = httpRouter();
const MAX_BODY_BYTES = 65_536;

function json(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "Cache-Control": "no-store",
      "Content-Type": "application/json; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

async function readJson(request: Request): Promise<Record<string, unknown>> {
  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    throw new Error("Request body is too large.");
  }
  const body: unknown = await request.json();
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw new Error("Request body must be an object.");
  }
  return body as Record<string, unknown>;
}

const localeValue = welcomeLocaleValue;

function adminAction(handler: (ctx: ActionCtx, body: Record<string, unknown>) => Promise<unknown>) {
  return httpAction(async (ctx, request) => {
    if (!authorizeAdminRequest(request)) return json({ ok: false, error: "Unauthorized" }, 401);
    if (request.method !== "POST") return json({ ok: false, error: "Method not allowed" }, 405);
    try {
      const body = await readJson(request);
      return json({ ok: true, data: await handler(ctx, body) });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Invalid request";
      return json({ ok: false, error: message }, 400);
    }
  });
}

http.route({
  path: "/admin/welcome-overview",
  method: "POST",
  handler: adminAction((ctx, body) => ctx.runQuery(internal.welcome.getAdminOverview, {
    propertySlug: String(body.propertySlug ?? ""),
  })),
});

http.route({
  path: "/admin/welcome-upsert",
  method: "POST",
  handler: adminAction((ctx, body) => ctx.runMutation(internal.welcome.upsert, {
    propertySlug: String(body.propertySlug ?? ""),
    locale: localeValue(body.locale),
    headline: String(body.headline ?? ""),
    body: String(body.body ?? ""),
    signature: String(body.signature ?? ""),
    publish: body.publish === true,
    auditAction: body.auditAction === "translate" ? "translate" : undefined,
    actorEmailHash: String(body.actorEmailHash ?? ""),
  })),
});

http.route({
  path: "/admin/welcome-reservation-context",
  method: "POST",
  handler: adminAction((ctx, body) => ctx.runQuery(internal.welcomeReservations.getContext, {
    reservationId: String(body.reservationId ?? "") as Id<"reservations">,
  })),
});

http.route({
  path: "/admin/announcement-overview",
  method: "POST",
  handler: adminAction((ctx, body) => ctx.runQuery(internal.announcements.getAdminOverview, {
    propertySlug: String(body.propertySlug ?? ""),
  })),
});

http.route({
  path: "/admin/announcement-settings-upsert",
  method: "POST",
  handler: adminAction((ctx, body) => ctx.runMutation(internal.announcements.upsertSettings, {
    propertySlug: String(body.propertySlug ?? ""),
    prayerEnabled: body.prayerEnabled === true,
    prayerMethod: String(body.prayerMethod ?? "singapore") as "singapore",
    madhab: String(body.madhab ?? "shafi") as "shafi",
    announcementVolume: Number(body.announcementVolume),
    musicEnabled: body.musicEnabled === true,
    musicVolume: Number(body.musicVolume),
    musicTrackKey: String(body.musicTrackKey ?? "still-morning") as "still-morning",
    actorEmailHash: String(body.actorEmailHash ?? ""),
  })),
});

http.route({
  path: "/admin/announcement-experience-upsert",
  method: "POST",
  handler: adminAction((ctx, body) => ctx.runMutation(internal.announcements.upsertExperience, {
    propertySlug: String(body.propertySlug ?? ""),
    welcomeShowBrand: body.welcomeShowBrand === true,
    welcomeShowLanguage: body.welcomeShowLanguage === true,
    welcomeShowAnnouncement: body.welcomeShowAnnouncement === true,
    welcomeShowBody: body.welcomeShowBody === true,
    welcomeShowStay: body.welcomeShowStay === true,
    welcomeShowContact: body.welcomeShowContact === true,
    welcomeShowSignature: body.welcomeShowSignature === true,
    welcomeShowPrivateNote: body.welcomeShowPrivateNote === true,
    presentationShowBrand: body.presentationShowBrand === true,
    presentationShowLanguage: body.presentationShowLanguage === true,
    presentationShowAnnouncement: body.presentationShowAnnouncement === true,
    presentationShowCounter: body.presentationShowCounter === true,
    presentationShowInstall: body.presentationShowInstall === true,
    presentationSlides: Array.isArray(body.presentationSlides) ? body.presentationSlides as Array<{
      key: "arrival" | "stay" | "stillness" | "contact";
      enabled: boolean;
      sortOrder: number;
      durationSeconds: number;
      mediaKey: "livingCourtyard" | "bedroomRetreat" | "poolCourtyard" | "welcomeDetails" | "livingDining" | "spaBath" | "diningTable" | "materialPalette";
    }> : [],
    actorEmailHash: String(body.actorEmailHash ?? ""),
  })),
});

http.route({
  path: "/admin/announcement-rule-upsert",
  method: "POST",
  handler: adminAction((ctx, body) => ctx.runMutation(internal.announcements.upsertRule, {
    ruleId: typeof body.ruleId === "string" && body.ruleId ? body.ruleId as Id<"announcementRules"> : undefined,
    propertySlug: String(body.propertySlug ?? ""),
    name: String(body.name ?? ""),
    locale: localeValue(body.locale),
    kind: String(body.kind ?? "time_window") as "time_window",
    message: String(body.message ?? ""),
    enabled: body.enabled === true,
    speak: body.speak === true,
    startTime: typeof body.startTime === "string" && body.startTime ? body.startTime : undefined,
    endTime: typeof body.endTime === "string" && body.endTime ? body.endTime : undefined,
    fixedTime: typeof body.fixedTime === "string" && body.fixedTime ? body.fixedTime : undefined,
    prayer: typeof body.prayer === "string" && body.prayer ? body.prayer as "fajr" : undefined,
    offsetMinutes: Number(body.offsetMinutes),
    displayMinutes: Number(body.displayMinutes),
    priority: Number(body.priority),
    actorEmailHash: String(body.actorEmailHash ?? ""),
  })),
});

http.route({
  path: "/admin/announcement-rule-archive",
  method: "POST",
  handler: adminAction((ctx, body) => ctx.runMutation(internal.announcements.archiveRule, {
    ruleId: String(body.ruleId ?? "") as Id<"announcementRules">,
    propertySlug: String(body.propertySlug ?? ""),
    actorEmailHash: String(body.actorEmailHash ?? ""),
  })),
});

http.route({
  path: "/admin/ensure-announcement-defaults",
  method: "POST",
  handler: adminAction((ctx, body) => ctx.runMutation(internal.announcements.ensureDefaults, {
    propertySlug: String(body.propertySlug ?? ""),
    actorEmailHash: String(body.actorEmailHash ?? ""),
  })),
});

http.route({
  path: "/admin/cms-overview", method: "POST",
  handler: adminAction((ctx) => ctx.runQuery(internal.cms.getAdminOverview, {})),
});
http.route({
  path: "/admin/cms-ensure", method: "POST",
  handler: adminAction((ctx, body) => ctx.runMutation(internal.cms.ensure, { json: String(body.json ?? ""), actorEmailHash: String(body.actorEmailHash ?? "") })),
});
http.route({
  path: "/admin/cms-save", method: "POST",
  handler: adminAction((ctx, body) => ctx.runMutation(internal.cms.saveDraft, { json: String(body.json ?? ""), actorEmailHash: String(body.actorEmailHash ?? "") })),
});
http.route({
  path: "/admin/cms-publish", method: "POST",
  handler: adminAction((ctx, body) => ctx.runMutation(internal.cms.publish, { actorEmailHash: String(body.actorEmailHash ?? "") })),
});

http.route({
  path: "/admin/ai-overview",
  method: "POST",
  handler: adminAction((ctx) => ctx.runQuery(internal.aiSettings.getOverview, {})),
});

http.route({
  path: "/admin/ai-secret",
  method: "POST",
  handler: adminAction((ctx) => ctx.runQuery(internal.aiSettings.getSecret, {})),
});

http.route({
  path: "/admin/ai-upsert",
  method: "POST",
  handler: adminAction((ctx, body) => ctx.runMutation(internal.aiSettings.upsert, {
    provider: String(body.provider ?? "") as "openai" | "openrouter" | "anthropic" | "gemini",
    model: String(body.model ?? ""),
    enabled: body.enabled === true,
    encryptedApiKey: typeof body.encryptedApiKey === "string" ? body.encryptedApiKey : undefined,
    keyFingerprint: typeof body.keyFingerprint === "string" ? body.keyFingerprint : undefined,
    clearKey: body.clearKey === true,
  })),
});

http.route({
  path: "/admin/ai-event",
  method: "POST",
  handler: adminAction((ctx, body) => ctx.runMutation(internal.aiSettings.recordEvent, {
    action: String(body.action ?? "") as "save" | "test" | "translate",
    provider: typeof body.provider === "string" ? body.provider as "openai" | "openrouter" | "anthropic" | "gemini" : undefined,
    targetCount: typeof body.targetCount === "number" ? body.targetCount : undefined,
    actorEmailHash: String(body.actorEmailHash ?? ""),
  })),
});

http.route({
  path: "/admin/login-attempt",
  method: "POST",
  handler: adminAction((ctx, body) => ctx.runMutation(internal.adminSecurity.recordAttempt, {
    fingerprint: String(body.fingerprint ?? ""),
    success: body.success === true,
  })),
});

http.route({
  path: "/admin/ensure-welcome-defaults",
  method: "POST",
  handler: adminAction((ctx, body) => ctx.runMutation(internal.welcome.ensureDefaults, {
    actorEmailHash: String(body.actorEmailHash ?? ""),
  })),
});

http.route({
  path: "/admin/pms",
  method: "POST",
  handler: adminAction(handlePmsAdmin),
});

export default http;

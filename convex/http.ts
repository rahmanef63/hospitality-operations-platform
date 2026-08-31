import { httpRouter } from "convex/server";
import { internal } from "./_generated/api";
import type { Id } from "./_generated/dataModel";
import { adminAction, adminSessionLogin, adminSessionVerify } from "./httpSecurity";
import { adminWelcomeTokens, welcomeTokenResolve } from "./httpGuest";
import { aiSettingsTest, aiSettingsUpsert, aiTranslate } from "./httpAi";
import { platformAdminQueue, platformAdminStatus, platformWorkerAck, platformWorkerSync } from "./httpPlatform";
import { handlePmsAdmin } from "./pms/dispatch";
import { welcomeLocaleValue } from "./welcomeLocale";

const http = httpRouter();

http.route({ path: "/admin/session/login", method: "POST", handler: adminSessionLogin });
http.route({ path: "/admin/session/verify", method: "POST", handler: adminSessionVerify });
http.route({ path: "/admin/welcome-tokens", method: "POST", handler: adminWelcomeTokens });
http.route({ path: "/welcome/token/resolve", method: "POST", handler: welcomeTokenResolve });
http.route({ path: "/admin/ai/settings", method: "POST", handler: aiSettingsUpsert });
http.route({ path: "/admin/ai/test", method: "POST", handler: aiSettingsTest });
http.route({ path: "/admin/ai/translate", method: "POST", handler: aiTranslate });
http.route({ path: "/admin/platform/status", method: "POST", handler: platformAdminStatus });
http.route({ path: "/admin/platform/queue", method: "POST", handler: platformAdminQueue });
http.route({ path: "/platform/worker/sync", method: "POST", handler: platformWorkerSync });
http.route({ path: "/platform/worker/ack", method: "POST", handler: platformWorkerAck });
const localeValue = welcomeLocaleValue;

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

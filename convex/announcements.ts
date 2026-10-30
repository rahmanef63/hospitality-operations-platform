import { v } from "convex/values";
import {
  defaultAnnouncementSettings,
  defaultRulesForProperty,
  validateAnnouncementRule,
  validateAnnouncementSettings,
  validateGuestVisibilitySettings,
} from "../shared/announcements";
import { internalMutation, internalQuery, query, type MutationCtx, type QueryCtx } from "./_generated/server";
import {
  announcementKindValidator,
  lofiTrackKeyValidator,
  madhabValidator,
  prayerMethodValidator,
  prayerNameValidator,
  presentationSlideValidator,
} from "./announcementValidators";
import { welcomeLocaleValidator } from "./welcomeLocale";

async function findSettings(ctx: QueryCtx | MutationCtx, propertySlug: string) {
  return ctx.db.query("announcementSettings").withIndex("by_property", (q) => q.eq("propertySlug", propertySlug)).unique();
}
async function listRules(ctx: QueryCtx | MutationCtx, propertySlug: string) {
  return ctx.db.query("announcementRules")
    .withIndex("by_property_archived", (q) => q.eq("propertySlug", propertySlug).eq("archived", false)).collect();
}

function settingsState(propertySlug: string, settings: Awaited<ReturnType<typeof findSettings>>) {
  const defaults = defaultAnnouncementSettings(propertySlug);
  if (!settings) return defaults;
  return {
    ...defaults,
    propertySlug: settings.propertySlug,
    prayerEnabled: settings.prayerEnabled,
    prayerMethod: settings.prayerMethod,
    madhab: settings.madhab,
    announcementVolume: settings.announcementVolume,
    musicEnabled: settings.musicEnabled,
    musicVolume: settings.musicVolume,
    musicTrackKey: settings.musicTrackKey ?? defaults.musicTrackKey,
    welcomeShowBrand: settings.welcomeShowBrand ?? defaults.welcomeShowBrand,
    welcomeShowLanguage: settings.welcomeShowLanguage ?? defaults.welcomeShowLanguage,
    welcomeShowAnnouncement: settings.welcomeShowAnnouncement ?? defaults.welcomeShowAnnouncement,
    welcomeShowBody: settings.welcomeShowBody ?? defaults.welcomeShowBody,
    welcomeShowStay: settings.welcomeShowStay ?? defaults.welcomeShowStay,
    welcomeShowContact: settings.welcomeShowContact ?? defaults.welcomeShowContact,
    welcomeShowSignature: settings.welcomeShowSignature ?? defaults.welcomeShowSignature,
    welcomeShowPrivateNote: settings.welcomeShowPrivateNote ?? defaults.welcomeShowPrivateNote,
    presentationShowBrand: settings.presentationShowBrand ?? defaults.presentationShowBrand,
    presentationShowLanguage: settings.presentationShowLanguage ?? defaults.presentationShowLanguage,
    presentationShowAnnouncement: settings.presentationShowAnnouncement ?? defaults.presentationShowAnnouncement,
    presentationShowCounter: settings.presentationShowCounter ?? defaults.presentationShowCounter,
    presentationShowInstall: settings.presentationShowInstall ?? defaults.presentationShowInstall,
    presentationSlides: settings.presentationSlides ?? defaults.presentationSlides,
    createdAt: settings.createdAt,
    updatedAt: settings.updatedAt,
  };
}

function ruleState(rule: Awaited<ReturnType<typeof listRules>>[number]) {
  return {
    id: String(rule._id), propertySlug: rule.propertySlug, name: rule.name, locale: rule.locale,
    kind: rule.kind, message: rule.message, enabled: rule.enabled, speak: rule.speak,
    startTime: rule.startTime, endTime: rule.endTime, fixedTime: rule.fixedTime, prayer: rule.prayer,
    offsetMinutes: rule.offsetMinutes, displayMinutes: rule.displayMinutes, priority: rule.priority,
    createdAt: rule.createdAt, updatedAt: rule.updatedAt,
  };
}

async function audit(ctx: MutationCtx, input: {
  propertySlug: string; resource: "settings" | "experience" | "rule"; resourceId: string;
  action: "create" | "update" | "archive" | "seed"; summary: string; actorEmailHash: string;
}) {
  await ctx.db.insert("announcementAuditEvents", { ...input, createdAt: Date.now() });
}

export const getPublic = query({
  args: { propertySlug: v.string(), locale: welcomeLocaleValidator },
  handler: async (ctx, args) => {
    const [settings, rules] = await Promise.all([findSettings(ctx, args.propertySlug), listRules(ctx, args.propertySlug)]);
    return {
      configured: Boolean(settings || rules.length),
      settings: settingsState(args.propertySlug, settings),
      rules: rules.filter((rule) => rule.enabled && rule.locale === args.locale).map(ruleState),
    };
  },
});

export const getAdminOverview = internalQuery({
  args: { propertySlug: v.string() },
  handler: async (ctx, args) => {
    const [settings, rules, events] = await Promise.all([
      findSettings(ctx, args.propertySlug), listRules(ctx, args.propertySlug),
      ctx.db.query("announcementAuditEvents").withIndex("by_property_created", (q) => q.eq("propertySlug", args.propertySlug)).order("desc").take(30),
    ]);
    return {
      settings: settingsState(args.propertySlug, settings),
      rules: rules.map(ruleState).sort((left, right) => right.priority - left.priority || left.name.localeCompare(right.name)),
      events: events.map((event) => ({
        id: String(event._id), resource: event.resource, resourceId: event.resourceId,
        action: event.action, summary: event.summary, actorEmailHash: event.actorEmailHash, createdAt: event.createdAt,
      })),
    };
  },
});

export const upsertSettings = internalMutation({
  args: {
    propertySlug: v.string(), prayerEnabled: v.boolean(), prayerMethod: prayerMethodValidator,
    madhab: madhabValidator, announcementVolume: v.number(), musicEnabled: v.boolean(),
    musicVolume: v.number(), musicTrackKey: lofiTrackKeyValidator, actorEmailHash: v.string(),
  },
  handler: async (ctx, args) => {
    const parsed = validateAnnouncementSettings(args, args.propertySlug);
    const now = Date.now();
    const existing = await findSettings(ctx, args.propertySlug);
    const fields = { ...parsed, updatedAt: now };
    if (existing) await ctx.db.patch(existing._id, fields);
    else await ctx.db.insert("announcementSettings", { ...defaultAnnouncementSettings(args.propertySlug), ...fields, createdAt: now });
    await audit(ctx, {
      propertySlug: args.propertySlug, resource: "settings", resourceId: args.propertySlug,
      action: existing ? "update" : "create", summary: "Updated announcement voice, prayer, and lo-fi music settings",
      actorEmailHash: args.actorEmailHash,
    });
    return settingsState(args.propertySlug, await findSettings(ctx, args.propertySlug));
  },
});

export const upsertExperience = internalMutation({
  args: {
    propertySlug: v.string(), welcomeShowBrand: v.boolean(), welcomeShowLanguage: v.boolean(),
    welcomeShowAnnouncement: v.boolean(), welcomeShowBody: v.boolean(), welcomeShowStay: v.boolean(),
    welcomeShowContact: v.boolean(), welcomeShowSignature: v.boolean(), welcomeShowPrivateNote: v.boolean(),
    presentationShowBrand: v.boolean(), presentationShowLanguage: v.boolean(),
    presentationShowAnnouncement: v.boolean(), presentationShowCounter: v.boolean(),
    presentationShowInstall: v.boolean(), presentationSlides: v.array(presentationSlideValidator),
    actorEmailHash: v.string(),
  },
  handler: async (ctx, args) => {
    const parsed = validateGuestVisibilitySettings(args);
    const existing = await findSettings(ctx, args.propertySlug);
    const now = Date.now();
    if (existing) await ctx.db.patch(existing._id, { ...parsed, updatedAt: now });
    else await ctx.db.insert("announcementSettings", {
      ...defaultAnnouncementSettings(args.propertySlug), ...parsed, createdAt: now, updatedAt: now,
    });
    await audit(ctx, {
      propertySlug: args.propertySlug, resource: "experience", resourceId: args.propertySlug,
      action: existing ? "update" : "create", summary: "Updated guest-visible welcome and presentation composition",
      actorEmailHash: args.actorEmailHash,
    });
    return settingsState(args.propertySlug, await findSettings(ctx, args.propertySlug));
  },
});

export const upsertRule = internalMutation({
  args: {
    ruleId: v.optional(v.id("announcementRules")), propertySlug: v.string(), name: v.string(),
    locale: welcomeLocaleValidator, kind: announcementKindValidator, message: v.string(),
    enabled: v.boolean(), speak: v.boolean(), startTime: v.optional(v.string()), endTime: v.optional(v.string()),
    fixedTime: v.optional(v.string()), prayer: v.optional(prayerNameValidator), offsetMinutes: v.number(),
    displayMinutes: v.number(), priority: v.number(), actorEmailHash: v.string(),
  },
  handler: async (ctx, args) => {
    const parsed = validateAnnouncementRule(args, args.propertySlug);
    const existing = args.ruleId ? await ctx.db.get(args.ruleId) : null;
    if (existing && (existing.archived || existing.propertySlug !== args.propertySlug)) throw new Error("Announcement rule tidak ditemukan.");
    const now = Date.now();
    const fields = { ...parsed, updatedAt: now, archived: false };
    const id = existing ? existing._id : await ctx.db.insert("announcementRules", { ...fields, createdAt: now });
    if (existing) await ctx.db.patch(existing._id, fields);
    await audit(ctx, {
      propertySlug: args.propertySlug, resource: "rule", resourceId: String(id),
      action: existing ? "update" : "create", summary: `${existing ? "Updated" : "Created"} announcement rule ${parsed.name}`,
      actorEmailHash: args.actorEmailHash,
    });
    const saved = await ctx.db.get(id);
    if (!saved) throw new Error("Announcement rule tidak dapat disimpan.");
    return ruleState(saved);
  },
});

export const archiveRule = internalMutation({
  args: { ruleId: v.id("announcementRules"), propertySlug: v.string(), actorEmailHash: v.string() },
  handler: async (ctx, args) => {
    const rule = await ctx.db.get(args.ruleId);
    if (!rule || rule.archived || rule.propertySlug !== args.propertySlug) throw new Error("Announcement rule tidak ditemukan.");
    await ctx.db.patch(rule._id, { archived: true, enabled: false, updatedAt: Date.now() });
    await audit(ctx, {
      propertySlug: args.propertySlug, resource: "rule", resourceId: String(rule._id), action: "archive",
      summary: `Archived announcement rule ${rule.name}`, actorEmailHash: args.actorEmailHash,
    });
    return { archived: true };
  },
});

export const ensureDefaults = internalMutation({
  args: { propertySlug: v.string(), actorEmailHash: v.string() },
  handler: async (ctx, args) => {
    const now = Date.now();
    let settingsCreated = false;
    const settings = await findSettings(ctx, args.propertySlug);
    if (!settings) {
      await ctx.db.insert("announcementSettings", { ...defaultAnnouncementSettings(args.propertySlug), createdAt: now, updatedAt: now });
      settingsCreated = true;
    } else {
      const defaults = defaultAnnouncementSettings(args.propertySlug);
      const missing = Object.fromEntries(Object.entries(defaults).filter(([key]) => settings[key as keyof typeof settings] === undefined));
      if (Object.keys(missing).length) await ctx.db.patch(settings._id, { ...missing, updatedAt: now });
    }
    const existing = await listRules(ctx, args.propertySlug);
    let rulesCreated = 0;
    for (const rule of defaultRulesForProperty(args.propertySlug)) {
      if (existing.some((item) => item.locale === rule.locale && item.name === rule.name && item.kind === rule.kind)) continue;
      const { id: _id, ...fields } = rule;
      void _id;
      await ctx.db.insert("announcementRules", { ...fields, createdAt: now, updatedAt: now, archived: false });
      rulesCreated += 1;
    }
    if (settingsCreated || rulesCreated) await audit(ctx, {
      propertySlug: args.propertySlug, resource: "settings", resourceId: args.propertySlug, action: "seed",
      summary: `Initialized ${rulesCreated} reviewed greeting rules`, actorEmailHash: args.actorEmailHash,
    });
    return { settingsCreated, rulesCreated };
  },
});

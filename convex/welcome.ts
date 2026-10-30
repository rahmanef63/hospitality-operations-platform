import { v } from "convex/values";
import { DEFAULT_WELCOME_CONTENT, WELCOME_PROPERTY_SLUG, validateWelcomeContent } from "../shared/welcome/config";
import { WELCOME_LOCALES, type WelcomeLocale } from "../shared/welcome/types";
import { internalMutation, internalQuery, query, type MutationCtx, type QueryCtx } from "./_generated/server";
import { welcomeLocaleValidator } from "./welcomeLocale";

async function findConfig(ctx: QueryCtx | MutationCtx, propertySlug: string, locale: WelcomeLocale) {
  return ctx.db.query("welcomeConfigs")
    .withIndex("by_property_locale", (q) => q.eq("propertySlug", propertySlug).eq("locale", locale))
    .unique();
}

function configState(config: NonNullable<Awaited<ReturnType<typeof findConfig>>>) {
  return {
    locale: config.locale,
    draft: { headline: config.draftHeadline, body: config.draftBody, signature: config.draftSignature },
    published: config.publishedHeadline && config.publishedBody && config.publishedSignature
      ? { headline: config.publishedHeadline, body: config.publishedBody, signature: config.publishedSignature }
      : undefined,
    version: config.version,
    updatedAt: config.updatedAt,
    publishedAt: config.publishedAt,
  };
}

export const getPublished = query({
  args: { propertySlug: v.string(), locale: welcomeLocaleValidator },
  handler: async (ctx, args) => {
    const config = await findConfig(ctx, args.propertySlug, args.locale);
    if (!config?.publishedHeadline || !config.publishedBody || !config.publishedSignature) return null;
    return {
      content: { headline: config.publishedHeadline, body: config.publishedBody, signature: config.publishedSignature },
      version: config.version,
      publishedAt: config.publishedAt,
    };
  },
});

export const getAdminOverview = internalQuery({
  args: { propertySlug: v.string() },
  handler: async (ctx, args) => {
    const configs = (await Promise.all(WELCOME_LOCALES.map((locale) => findConfig(ctx, args.propertySlug, locale))))
      .filter((config): config is NonNullable<typeof config> => config !== null)
      .map(configState);
    const events = await ctx.db.query("adminAuditEvents")
      .withIndex("by_property_created", (q) => q.eq("propertySlug", args.propertySlug))
      .order("desc").take(30);
    return {
      configs,
      events: events.map(({ action, actorEmailHash, createdAt, locale, version }) => ({
        action, actorEmailHash, createdAt, locale, version,
      })),
    };
  },
});

export const upsert = internalMutation({
  args: {
    propertySlug: v.string(), locale: welcomeLocaleValidator,
    headline: v.string(), body: v.string(), signature: v.string(), publish: v.boolean(),
    auditAction: v.optional(v.union(v.literal("save"), v.literal("publish"), v.literal("translate"))),
    actorEmailHash: v.string(),
  },
  handler: async (ctx, args) => {
    const parsed = validateWelcomeContent({ headline: args.headline, body: args.body, signature: args.signature });
    if (!parsed.ok) throw new Error(parsed.error);
    const now = Date.now();
    const existing = await findConfig(ctx, args.propertySlug, args.locale);
    const version = (existing?.version ?? 0) + 1;
    const fields = {
      propertySlug: args.propertySlug,
      locale: args.locale,
      draftHeadline: parsed.value.headline,
      draftBody: parsed.value.body,
      draftSignature: parsed.value.signature,
      version,
      updatedAt: now,
      ...(args.publish ? {
        publishedHeadline: parsed.value.headline,
        publishedBody: parsed.value.body,
        publishedSignature: parsed.value.signature,
        publishedAt: now,
      } : {}),
    };
    if (existing) await ctx.db.patch(existing._id, fields);
    else await ctx.db.insert("welcomeConfigs", fields);
    await ctx.db.insert("adminAuditEvents", {
      propertySlug: args.propertySlug,
      locale: args.locale,
      action: args.auditAction ?? (args.publish ? "publish" : "save"),
      actorEmailHash: args.actorEmailHash,
      version,
      createdAt: now,
    });
    return { version, publishedAt: args.publish ? now : existing?.publishedAt };
  },
});

export const ensureDefaults = internalMutation({
  args: { actorEmailHash: v.string() },
  handler: async (ctx, args) => {
    let created = 0;
    for (const locale of WELCOME_LOCALES) {
      if (await findConfig(ctx, WELCOME_PROPERTY_SLUG, locale)) continue;
      const content = DEFAULT_WELCOME_CONTENT[locale];
      const now = Date.now();
      await ctx.db.insert("welcomeConfigs", {
        propertySlug: WELCOME_PROPERTY_SLUG,
        locale,
        draftHeadline: content.headline,
        draftBody: content.body,
        draftSignature: content.signature,
        publishedHeadline: content.headline,
        publishedBody: content.body,
        publishedSignature: content.signature,
        version: 1,
        updatedAt: now,
        publishedAt: now,
      });
      await ctx.db.insert("adminAuditEvents", {
        propertySlug: WELCOME_PROPERTY_SLUG,
        locale,
        action: "seed",
        actorEmailHash: args.actorEmailHash,
        version: 1,
        createdAt: now,
      });
      created += 1;
    }
    return { created };
  },
});

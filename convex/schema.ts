import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const locale = v.union(v.literal("id"), v.literal("en"));

export default defineSchema({
  welcomeConfigs: defineTable({
    propertySlug: v.string(),
    locale,
    draftHeadline: v.string(),
    draftBody: v.string(),
    draftSignature: v.string(),
    publishedHeadline: v.optional(v.string()),
    publishedBody: v.optional(v.string()),
    publishedSignature: v.optional(v.string()),
    version: v.number(),
    updatedAt: v.number(),
    publishedAt: v.optional(v.number()),
  }).index("by_property_locale", ["propertySlug", "locale"]),
  adminLoginAttempts: defineTable({
    fingerprint: v.string(),
    failures: v.number(),
    windowStartedAt: v.number(),
    lockedUntil: v.optional(v.number()),
    updatedAt: v.number(),
  }).index("by_fingerprint", ["fingerprint"]),
  adminAuditEvents: defineTable({
    propertySlug: v.string(),
    locale,
    action: v.union(v.literal("seed"), v.literal("save"), v.literal("publish")),
    actorEmailHash: v.string(),
    version: v.number(),
    createdAt: v.number(),
  }).index("by_property_created", ["propertySlug", "createdAt"]),
});

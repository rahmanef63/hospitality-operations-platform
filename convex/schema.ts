import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import {
  amenityCategoryValidator,
  auditActionValidator,
  blockReasonValidator,
  propertyStatusValidator,
  propertyTypeValidator,
  publicationStatusValidator,
  reservationSourceValidator,
  reservationStatusValidator,
  taskCategoryValidator,
  taskPriorityValidator,
  taskStatusValidator,
  transactionKindValidator,
  transactionMethodValidator,
  transactionStatusValidator,
  unitStatusValidator,
  unitTypeValidator,
} from "./pms/validators";
import { welcomeLocaleValidator } from "./welcomeLocale";
import { aiProviderValidator } from "./aiValidators";

const locale = welcomeLocaleValidator;
const timestamps = { createdAt: v.number(), updatedAt: v.number(), archived: v.boolean() };

export default defineSchema({
  welcomeConfigs: defineTable({
    propertySlug: v.string(), locale,
    draftHeadline: v.string(), draftBody: v.string(), draftSignature: v.string(),
    publishedHeadline: v.optional(v.string()), publishedBody: v.optional(v.string()),
    publishedSignature: v.optional(v.string()), version: v.number(),
    updatedAt: v.number(), publishedAt: v.optional(v.number()),
  }).index("by_property_locale", ["propertySlug", "locale"]),
  aiProviderSettings: defineTable({
    scope: v.string(), provider: aiProviderValidator, model: v.string(), enabled: v.boolean(),
    encryptedApiKey: v.optional(v.string()), keyFingerprint: v.optional(v.string()),
    createdAt: v.number(), updatedAt: v.number(),
  }).index("by_scope", ["scope"]),
  aiAuditEvents: defineTable({
    action: v.union(v.literal("save"), v.literal("test"), v.literal("translate")),
    provider: v.optional(aiProviderValidator), targetCount: v.optional(v.number()),
    actorEmailHash: v.string(), createdAt: v.number(),
  }).index("by_created", ["createdAt"]),

  adminLoginAttempts: defineTable({
    fingerprint: v.string(), failures: v.number(), windowStartedAt: v.number(),
    lockedUntil: v.optional(v.number()), updatedAt: v.number(),
  }).index("by_fingerprint", ["fingerprint"]),
  adminAuditEvents: defineTable({
    propertySlug: v.string(), locale,
    action: v.union(v.literal("seed"), v.literal("save"), v.literal("publish"), v.literal("translate")),
    actorEmailHash: v.string(), version: v.number(), createdAt: v.number(),
  }).index("by_property_created", ["propertySlug", "createdAt"]),

  properties: defineTable({
    slug: v.string(), name: v.string(), propertyType: propertyTypeValidator,
    status: propertyStatusValidator, publicationStatus: publicationStatusValidator,
    locationLabel: v.optional(v.string()), addressLine: v.optional(v.string()),
    locality: v.optional(v.string()), region: v.optional(v.string()), postalCode: v.optional(v.string()),
    countryCode: v.string(), timezone: v.string(), currency: v.string(),
    bedroomCount: v.optional(v.number()), bathroomCount: v.optional(v.number()),
    maxGuests: v.optional(v.number()), baseNightlyRate: v.optional(v.number()),
    publicSummary: v.optional(v.string()), publicPath: v.optional(v.string()),
    internalNotes: v.optional(v.string()), ...timestamps,
  }).index("by_slug", ["slug"]).index("by_archived", ["archived"]),

  units: defineTable({
    propertyId: v.id("properties"), code: v.string(), name: v.string(), unitType: unitTypeValidator,
    status: unitStatusValidator, bookable: v.boolean(), bedroomCount: v.optional(v.number()),
    bathroomCount: v.optional(v.number()), maxGuests: v.optional(v.number()),
    baseNightlyRate: v.optional(v.number()), notes: v.optional(v.string()), ...timestamps,
  }).index("by_property", ["propertyId"]).index("by_property_code", ["propertyId", "code"])
    .index("by_archived", ["archived"]),

  amenities: defineTable({
    propertyId: v.id("properties"), key: v.string(), name: v.string(), category: amenityCategoryValidator,
    description: v.optional(v.string()), featured: v.boolean(), publicVisible: v.boolean(),
    active: v.boolean(), ...timestamps,
  }).index("by_property", ["propertyId"]).index("by_property_key", ["propertyId", "key"])
    .index("by_archived", ["archived"]),

  guests: defineTable({
    fullName: v.string(), email: v.optional(v.string()), phone: v.optional(v.string()),
    nationality: v.optional(v.string()), preferredLocale: v.optional(locale),
    notes: v.optional(v.string()), ...timestamps,
  }).index("by_archived", ["archived"]).index("by_email", ["email"]),

  reservations: defineTable({
    reference: v.string(), externalReference: v.optional(v.string()), propertyId: v.id("properties"),
    unitId: v.optional(v.id("units")), guestId: v.id("guests"), status: reservationStatusValidator,
    source: reservationSourceValidator, checkIn: v.string(), checkOut: v.string(), nights: v.number(),
    adults: v.optional(v.number()), children: v.optional(v.number()), nightlyRate: v.optional(v.number()),
    accommodationAmount: v.optional(v.number()), extraFees: v.optional(v.number()),
    discountAmount: v.optional(v.number()), totalAmount: v.optional(v.number()),
    currency: v.string(), welcomeLocale: v.optional(locale), notes: v.optional(v.string()),
    cancelledAt: v.optional(v.number()), ...timestamps,
  }).index("by_reference", ["reference"]).index("by_property_checkin", ["propertyId", "checkIn"])
    .index("by_unit_checkin", ["unitId", "checkIn"]).index("by_guest_checkin", ["guestId", "checkIn"])
    .index("by_archived_checkin", ["archived", "checkIn"]),

  availabilityBlocks: defineTable({
    propertyId: v.id("properties"), unitId: v.optional(v.id("units")), title: v.string(),
    reason: blockReasonValidator, startDate: v.string(), endDate: v.string(),
    notes: v.optional(v.string()), ...timestamps,
  }).index("by_property_start", ["propertyId", "startDate"])
    .index("by_unit_start", ["unitId", "startDate"]).index("by_archived_start", ["archived", "startDate"]),

  transactions: defineTable({
    propertyId: v.id("properties"), reservationId: v.optional(v.id("reservations")),
    kind: transactionKindValidator, category: v.string(), amount: v.number(), currency: v.string(),
    method: transactionMethodValidator, status: transactionStatusValidator, occurredOn: v.string(),
    reference: v.optional(v.string()), notes: v.optional(v.string()), ...timestamps,
  }).index("by_property_date", ["propertyId", "occurredOn"])
    .index("by_reservation_date", ["reservationId", "occurredOn"])
    .index("by_archived_date", ["archived", "occurredOn"]),

  tasks: defineTable({
    propertyId: v.id("properties"), unitId: v.optional(v.id("units")),
    reservationId: v.optional(v.id("reservations")), title: v.string(), category: taskCategoryValidator,
    priority: taskPriorityValidator, status: taskStatusValidator, dueOn: v.optional(v.string()),
    assignee: v.optional(v.string()), notes: v.optional(v.string()), completedAt: v.optional(v.number()),
    ...timestamps,
  }).index("by_property_status", ["propertyId", "status"])
    .index("by_archived_due", ["archived", "dueOn"]),

  pmsAuditEvents: defineTable({
    propertyId: v.optional(v.id("properties")), resource: v.string(), resourceId: v.string(),
    action: auditActionValidator, summary: v.string(), actorEmailHash: v.string(), createdAt: v.number(),
  }).index("by_created", ["createdAt"]).index("by_property_created", ["propertyId", "createdAt"]),
});

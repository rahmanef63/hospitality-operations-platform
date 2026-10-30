import { v } from "convex/values";
import { internalMutation, internalQuery } from "../_generated/server";
import {
  amenityCategoryValidator,
  propertyStatusValidator,
  propertyTypeValidator,
  publicationStatusValidator,
  unitStatusValidator,
  unitTypeValidator,
} from "./validators";
import {
  cleanCode,
  cleanCountryCode,
  cleanCurrency,
  cleanSlug,
  cleanText,
  optionalInteger,
  optionalText,
  recordPmsAudit,
  requireProperty,
} from "./lib";

export const list = internalQuery({
  args: {},
  handler: async (ctx) => {
    const [properties, units, amenities] = await Promise.all([
      ctx.db.query("properties").withIndex("by_archived", (q) => q.eq("archived", false)).take(100),
      ctx.db.query("units").withIndex("by_archived", (q) => q.eq("archived", false)).take(500),
      ctx.db.query("amenities").withIndex("by_archived", (q) => q.eq("archived", false)).take(500),
    ]);
    const propertyNames = new Map(properties.map((property) => [property._id, property.name]));
    return {
      properties: properties.map(({ _id, ...property }) => ({ id: _id, ...property })),
      units: units.map(({ _id, ...unit }) => ({
        id: _id,
        propertyName: propertyNames.get(unit.propertyId) ?? "Archived property",
        ...unit,
      })),
      amenities: amenities.map(({ _id, ...amenity }) => ({
        id: _id,
        propertyName: propertyNames.get(amenity.propertyId) ?? "Archived property",
        ...amenity,
      })),
    };
  },
});

export const upsertProperty = internalMutation({
  args: {
    id: v.optional(v.id("properties")), slug: v.string(), name: v.string(), propertyType: propertyTypeValidator,
    status: propertyStatusValidator, publicationStatus: publicationStatusValidator,
    locationLabel: v.optional(v.string()), addressLine: v.optional(v.string()), locality: v.optional(v.string()),
    region: v.optional(v.string()), postalCode: v.optional(v.string()), countryCode: v.string(),
    timezone: v.string(), currency: v.string(), bedroomCount: v.optional(v.number()),
    bathroomCount: v.optional(v.number()), maxGuests: v.optional(v.number()),
    baseNightlyRate: v.optional(v.number()), publicSummary: v.optional(v.string()),
    publicPath: v.optional(v.string()), internalNotes: v.optional(v.string()), actorEmailHash: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const slug = cleanSlug(args.slug, "Property slug");
    const name = cleanText(args.name, "Property name", 2, 100);
    const duplicate = await ctx.db.query("properties").withIndex("by_slug", (q) => q.eq("slug", slug)).unique();
    if (duplicate && duplicate._id !== args.id && !duplicate.archived) throw new Error("Property slug is already in use.");
    const fields = {
      slug, name, propertyType: args.propertyType, status: args.status, publicationStatus: args.publicationStatus,
      locationLabel: optionalText(args.locationLabel, 160), addressLine: optionalText(args.addressLine, 240),
      locality: optionalText(args.locality, 100), region: optionalText(args.region, 100),
      postalCode: optionalText(args.postalCode, 24), countryCode: cleanCountryCode(args.countryCode),
      timezone: cleanText(args.timezone, "Timezone", 3, 64), currency: cleanCurrency(args.currency),
      bedroomCount: optionalInteger(args.bedroomCount, "Bedroom count", 100),
      bathroomCount: optionalInteger(args.bathroomCount, "Bathroom count", 100),
      maxGuests: optionalInteger(args.maxGuests, "Maximum guests", 1_000),
      baseNightlyRate: optionalInteger(args.baseNightlyRate, "Base nightly rate"),
      publicSummary: optionalText(args.publicSummary, 500), publicPath: optionalText(args.publicPath, 160),
      internalNotes: optionalText(args.internalNotes, 2_000), updatedAt: now, archived: false,
    };
    let id = args.id;
    const action = id ? "update" as const : "create" as const;
    if (id) {
      const existing = await ctx.db.get(id);
      if (!existing || existing.archived) throw new Error("Property was not found.");
      await ctx.db.patch(id, fields);
    } else {
      id = await ctx.db.insert("properties", { ...fields, createdAt: now });
    }
    await recordPmsAudit(ctx, {
      propertyId: id, resource: "property", resourceId: id, action,
      summary: `${action === "create" ? "Created" : "Updated"} ${name}`,
      actorEmailHash: args.actorEmailHash,
    });
    return { id };
  },
});

export const archiveProperty = internalMutation({
  args: { id: v.id("properties"), actorEmailHash: v.string() },
  handler: async (ctx, args) => {
    const property = await requireProperty(ctx, args.id);
    await ctx.db.patch(args.id, { archived: true, status: "inactive", publicationStatus: "draft", updatedAt: Date.now() });
    await recordPmsAudit(ctx, {
      propertyId: args.id, resource: "property", resourceId: args.id, action: "archive",
      summary: `Archived ${property.name}`, actorEmailHash: args.actorEmailHash,
    });
    return { id: args.id };
  },
});

export const upsertUnit = internalMutation({
  args: {
    id: v.optional(v.id("units")), propertyId: v.id("properties"), code: v.string(), name: v.string(),
    unitType: unitTypeValidator, status: unitStatusValidator, bookable: v.boolean(),
    bedroomCount: v.optional(v.number()), bathroomCount: v.optional(v.number()),
    maxGuests: v.optional(v.number()), baseNightlyRate: v.optional(v.number()),
    notes: v.optional(v.string()), actorEmailHash: v.string(),
  },
  handler: async (ctx, args) => {
    const property = await requireProperty(ctx, args.propertyId);
    const code = cleanCode(args.code);
    const name = cleanText(args.name, "Unit name", 1, 100);
    const duplicate = await ctx.db.query("units")
      .withIndex("by_property_code", (q) => q.eq("propertyId", args.propertyId).eq("code", code)).unique();
    if (duplicate && duplicate._id !== args.id && !duplicate.archived) throw new Error("Unit code already exists for this property.");
    const now = Date.now();
    const fields = {
      propertyId: args.propertyId, code, name, unitType: args.unitType, status: args.status, bookable: args.bookable,
      bedroomCount: optionalInteger(args.bedroomCount, "Bedroom count", 100),
      bathroomCount: optionalInteger(args.bathroomCount, "Bathroom count", 100),
      maxGuests: optionalInteger(args.maxGuests, "Maximum guests", 1_000),
      baseNightlyRate: optionalInteger(args.baseNightlyRate, "Base nightly rate"),
      notes: optionalText(args.notes, 2_000), updatedAt: now, archived: false,
    };
    let id = args.id;
    const action = id ? "update" as const : "create" as const;
    if (id) {
      const existing = await ctx.db.get(id);
      if (!existing || existing.archived) throw new Error("Unit was not found.");
      await ctx.db.patch(id, fields);
    } else id = await ctx.db.insert("units", { ...fields, createdAt: now });
    await recordPmsAudit(ctx, {
      propertyId: args.propertyId, resource: "unit", resourceId: id, action,
      summary: `${action === "create" ? "Created" : "Updated"} ${name} at ${property.name}`,
      actorEmailHash: args.actorEmailHash,
    });
    return { id };
  },
});

export const archiveUnit = internalMutation({
  args: { id: v.id("units"), actorEmailHash: v.string() },
  handler: async (ctx, args) => {
    const unit = await ctx.db.get(args.id);
    if (!unit || unit.archived) throw new Error("Unit was not found.");
    await ctx.db.patch(args.id, { archived: true, status: "inactive", bookable: false, updatedAt: Date.now() });
    await recordPmsAudit(ctx, {
      propertyId: unit.propertyId, resource: "unit", resourceId: args.id, action: "archive",
      summary: `Archived ${unit.name}`, actorEmailHash: args.actorEmailHash,
    });
    return { id: args.id };
  },
});

export const upsertAmenity = internalMutation({
  args: {
    id: v.optional(v.id("amenities")), propertyId: v.id("properties"), key: v.string(), name: v.string(),
    category: amenityCategoryValidator, description: v.optional(v.string()), featured: v.boolean(),
    publicVisible: v.boolean(), active: v.boolean(), actorEmailHash: v.string(),
  },
  handler: async (ctx, args) => {
    await requireProperty(ctx, args.propertyId);
    const key = cleanSlug(args.key, "Amenity key");
    const name = cleanText(args.name, "Amenity name", 2, 100);
    const duplicate = await ctx.db.query("amenities")
      .withIndex("by_property_key", (q) => q.eq("propertyId", args.propertyId).eq("key", key)).unique();
    if (duplicate && duplicate._id !== args.id && !duplicate.archived) throw new Error("Amenity key already exists.");
    const now = Date.now();
    const fields = {
      propertyId: args.propertyId, key, name, category: args.category,
      description: optionalText(args.description, 500), featured: args.featured,
      publicVisible: args.publicVisible, active: args.active, updatedAt: now, archived: false,
    };
    let id = args.id;
    const action = id ? "update" as const : "create" as const;
    if (id) {
      const existing = await ctx.db.get(id);
      if (!existing || existing.archived) throw new Error("Amenity was not found.");
      await ctx.db.patch(id, fields);
    } else id = await ctx.db.insert("amenities", { ...fields, createdAt: now });
    await recordPmsAudit(ctx, {
      propertyId: args.propertyId, resource: "amenity", resourceId: id, action,
      summary: `${action === "create" ? "Created" : "Updated"} ${name}`,
      actorEmailHash: args.actorEmailHash,
    });
    return { id };
  },
});

export const archiveAmenity = internalMutation({
  args: { id: v.id("amenities"), actorEmailHash: v.string() },
  handler: async (ctx, args) => {
    const amenity = await ctx.db.get(args.id);
    if (!amenity || amenity.archived) throw new Error("Amenity was not found.");
    await ctx.db.patch(args.id, { archived: true, active: false, publicVisible: false, updatedAt: Date.now() });
    await recordPmsAudit(ctx, {
      propertyId: amenity.propertyId, resource: "amenity", resourceId: args.id, action: "archive",
      summary: `Archived ${amenity.name}`, actorEmailHash: args.actorEmailHash,
    });
    return { id: args.id };
  },
});

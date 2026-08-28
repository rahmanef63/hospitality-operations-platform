import { v } from "convex/values";
import { query } from "../_generated/server";

export const getProperty = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const property = await ctx.db
      .query("properties")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
    if (!property || property.archived || property.status !== "active" || property.publicationStatus !== "published") {
      return null;
    }
    const [amenityDocs, unitDocs] = await Promise.all([
      ctx.db.query("amenities").withIndex("by_property", (q) => q.eq("propertyId", property._id)).collect(),
      ctx.db.query("units").withIndex("by_property", (q) => q.eq("propertyId", property._id)).collect(),
    ]);
    return {
      id: property._id,
      slug: property.slug,
      name: property.name,
      propertyType: property.propertyType,
      locationLabel: property.locationLabel,
      addressLine: property.addressLine,
      locality: property.locality,
      region: property.region,
      postalCode: property.postalCode,
      countryCode: property.countryCode,
      bedroomCount: property.bedroomCount,
      bathroomCount: property.bathroomCount,
      maxGuests: property.maxGuests,
      publicSummary: property.publicSummary,
      publicPath: property.publicPath,
      amenities: amenityDocs
        .filter((item) => !item.archived && item.active && item.publicVisible)
        .sort((left, right) => Number(right.featured) - Number(left.featured) || left.name.localeCompare(right.name))
        .map((item) => ({
          key: item.key,
          name: item.name,
          category: item.category,
          description: item.description,
          featured: item.featured,
        })),
      units: unitDocs
        .filter((item) => !item.archived && item.status === "active" && item.bookable)
        .sort((left, right) => left.code.localeCompare(right.code))
        .map((item) => ({
          id: item._id,
          code: item.code,
          name: item.name,
          unitType: item.unitType,
          bedroomCount: item.bedroomCount,
          bathroomCount: item.bathroomCount,
          maxGuests: item.maxGuests,
        })),
      updatedAt: property.updatedAt,
    };
  },
});

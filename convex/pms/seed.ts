import { v } from "convex/values";
import { RUMA_KAMYNA_AMENITY_SEEDS, RUMA_KAMYNA_PROPERTY_SEED } from "../../shared/pms/config";
import { internalMutation } from "../_generated/server";
import { recordPmsAudit } from "./lib";

export const rumaKamyna = internalMutation({
  args: { actorEmailHash: v.string() },
  handler: async (ctx, args) => {
    const now = Date.now();
    const existing = await ctx.db.query("properties")
      .withIndex("by_slug", (q) => q.eq("slug", RUMA_KAMYNA_PROPERTY_SEED.slug)).unique();
    const fields = {
      ...RUMA_KAMYNA_PROPERTY_SEED,
      updatedAt: now,
      archived: false,
    };
    let propertyId = existing?._id;
    let propertyCreated = false;
    if (existing) await ctx.db.patch(existing._id, fields);
    else {
      propertyId = await ctx.db.insert("properties", { ...fields, createdAt: now });
      propertyCreated = true;
    }
    if (!propertyId) throw new Error("Ruma Kamyna could not be initialized.");

    let amenitiesCreated = 0;
    let amenitiesUpdated = 0;
    for (const amenitySeed of RUMA_KAMYNA_AMENITY_SEEDS) {
      const amenity = await ctx.db.query("amenities")
        .withIndex("by_property_key", (q) => q.eq("propertyId", propertyId).eq("key", amenitySeed.key)).unique();
      const amenityFields = {
        propertyId,
        ...amenitySeed,
        publicVisible: true,
        active: true,
        archived: false,
        updatedAt: now,
      };
      if (amenity) {
        await ctx.db.patch(amenity._id, amenityFields);
        amenitiesUpdated += 1;
      } else {
        await ctx.db.insert("amenities", { ...amenityFields, createdAt: now });
        amenitiesCreated += 1;
      }
    }
    await recordPmsAudit(ctx, {
      propertyId,
      resource: "property",
      resourceId: propertyId,
      action: "seed",
      summary: "Initialized verified Ruma Kamyna property facts",
      actorEmailHash: args.actorEmailHash,
    });
    return { propertyId, propertyCreated, amenitiesCreated, amenitiesUpdated };
  },
});

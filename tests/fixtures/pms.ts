import type { TestConvex } from "convex-test";
import { internal } from "@/convex/_generated/api";
import schema from "@/convex/schema";
export const TEST_ACTOR_HASH = "integration-actor-hash-000000000000000000000000";
export async function createTestProperty(t: TestConvex<typeof schema>) {
  const created = await t.mutation(internal.pms.catalog.upsertProperty, {
    slug: "test-property", name: "Test Property", propertyType: "villa", status: "active", publicationStatus: "published",
    locationLabel: "Test District", locality: "Test City", region: "Test Region", postalCode: "10000",
    countryCode: "ID", timezone: "Asia/Jakarta", currency: "IDR", bedroomCount: 3,
    publicSummary: "A verified test property used only by automated tests.", publicPath: "/stays/test-property", actorEmailHash: TEST_ACTOR_HASH,
  });
  const amenities = [
    { key: "pool", name: "Pool", category: "leisure" as const },
    { key: "gym", name: "Gym", category: "wellness" as const },
    { key: "spa", name: "Spa", category: "wellness" as const },
    { key: "garden-view", name: "Garden view", category: "view" as const },
  ];
  for (const amenity of amenities) await t.mutation(internal.pms.catalog.upsertAmenity, {
    propertyId: created.id, ...amenity, featured: true, publicVisible: true, active: true, actorEmailHash: TEST_ACTOR_HASH,
  });
  const catalog = await t.query(internal.pms.catalog.list, {});
  return { catalog, property: catalog.properties.find((item) => item.id === created.id)! };
}

import type { PublicPropertyFacts } from "@/shared/pms";
export const TEST_PUBLIC_PROPERTY_FACTS: PublicPropertyFacts = {
  slug: "test-property", name: "Test Property", propertyType: "villa", locationLabel: "Test District",
  locality: "Test City", region: "Test Region", postalCode: "10000", countryCode: "ID", bedroomCount: 3,
  publicSummary: "A verified test property.", publicPath: "/stays/test-property",
  amenities: [
    { key: "pool", name: "Pool", category: "leisure", featured: true },
    { key: "gym", name: "Gym", category: "wellness", featured: true },
    { key: "spa", name: "Spa", category: "wellness", featured: true },
    { key: "garden-view", name: "Garden view", category: "view", featured: true },
  ], units: [], updatedAt: 0, source: "verified-fallback",
};

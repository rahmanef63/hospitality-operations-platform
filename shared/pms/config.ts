import type { PublicPropertyFacts } from "./public";

export const RUMA_KAMYNA_PROPERTY_SEED = {
  slug: "ruma-kamyna",
  name: "Ruma Kamyna",
  propertyType: "villa" as const,
  status: "active" as const,
  publicationStatus: "published" as const,
  locationLabel: "Megamendung, Puncak Bogor",
  locality: "Megamendung",
  region: "Jawa Barat",
  postalCode: "16770",
  countryCode: "ID",
  timezone: "Asia/Jakarta",
  currency: "IDR",
  bedroomCount: 3,
  publicSummary: "A private three-bedroom villa in Megamendung, Puncak Bogor, shaped for quiet stays and slower days.",
  publicPath: "/stays/ruma-kamyna",
} as const;

export const RUMA_KAMYNA_AMENITY_SEEDS = [
  { key: "swimming-pool", name: "Kolam renang", category: "leisure" as const, featured: true },
  { key: "gym", name: "Gym", category: "wellness" as const, featured: true },
  { key: "jacuzzi", name: "Jacuzzi", category: "wellness" as const, featured: true },
  { key: "mountain-view", name: "Pemandangan gunung", category: "view" as const, featured: true },
] as const;

export const RUMA_KAMYNA_PUBLIC_FALLBACK: PublicPropertyFacts = {
  slug: RUMA_KAMYNA_PROPERTY_SEED.slug,
  name: RUMA_KAMYNA_PROPERTY_SEED.name,
  propertyType: RUMA_KAMYNA_PROPERTY_SEED.propertyType,
  locationLabel: RUMA_KAMYNA_PROPERTY_SEED.locationLabel,
  locality: RUMA_KAMYNA_PROPERTY_SEED.locality,
  region: RUMA_KAMYNA_PROPERTY_SEED.region,
  postalCode: RUMA_KAMYNA_PROPERTY_SEED.postalCode,
  countryCode: RUMA_KAMYNA_PROPERTY_SEED.countryCode,
  bedroomCount: RUMA_KAMYNA_PROPERTY_SEED.bedroomCount,
  publicSummary: RUMA_KAMYNA_PROPERTY_SEED.publicSummary,
  publicPath: RUMA_KAMYNA_PROPERTY_SEED.publicPath,
  amenities: RUMA_KAMYNA_AMENITY_SEEDS.map((amenity) => ({
    ...amenity,
    description: undefined,
  })),
  units: [],
  updatedAt: 0,
  source: "verified-fallback",
};

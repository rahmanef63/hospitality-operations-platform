import { tenantInitialAmenitySeeds, tenantInitialPropertySeed, tenantPublicPropertyFallback } from "@/tenant";
export const INITIAL_PROPERTY_SEED = tenantInitialPropertySeed;
export const INITIAL_AMENITY_SEEDS = tenantInitialAmenitySeeds;
export const PUBLIC_PROPERTY_FALLBACK = tenantPublicPropertyFallback;
export const HAS_INITIAL_PROPERTY_SEED = INITIAL_PROPERTY_SEED !== null;

export type PublicAmenity = {
  key: string;
  name: string;
  category: string;
  description?: string;
  featured: boolean;
};

export type PublicUnit = {
  id: string;
  code: string;
  name: string;
  unitType: string;
  bedroomCount?: number;
  bathroomCount?: number;
  maxGuests?: number;
};

export type PublicPropertyFacts = {
  id?: string;
  slug: string;
  name: string;
  propertyType: string;
  locationLabel?: string;
  addressLine?: string;
  locality?: string;
  region?: string;
  postalCode?: string;
  countryCode: string;
  bedroomCount?: number;
  bathroomCount?: number;
  maxGuests?: number;
  publicSummary?: string;
  publicPath?: string;
  amenities: PublicAmenity[];
  units: PublicUnit[];
  updatedAt?: number;
  source: "convex" | "verified-fallback";
};

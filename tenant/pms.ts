import type { AmenityCategory, PropertyStatus, PropertyType, PublicationStatus } from "@/shared/pms/constants";
import type { PublicPropertyFacts } from "@/shared/pms/public";
export type TenantInitialPropertySeed={slug:string;name:string;propertyType:PropertyType;status:PropertyStatus;publicationStatus:PublicationStatus;locationLabel?:string;locality?:string;region?:string;postalCode?:string;countryCode:string;timezone:string;currency:string;bedroomCount?:number;publicSummary?:string;publicPath?:string};
export type TenantInitialAmenitySeed={key:string;name:string;category:AmenityCategory;featured:boolean};
export const tenantInitialPropertySeed:TenantInitialPropertySeed|null=null;
export const tenantInitialAmenitySeeds:readonly TenantInitialAmenitySeed[]=[];
export const tenantPublicPropertyFallback:PublicPropertyFacts|null=null;

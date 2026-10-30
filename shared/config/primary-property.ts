import { CONTACT_EMAIL } from "./site";
function optionalText(value: string | undefined) { const normalized=value?.trim(); return normalized || undefined; }
function whatsappNumber(value: string | undefined) { const digits=value?.replace(/\D/g,""); return digits&&digits.length>=8&&digits.length<=15?digits:undefined; }
function mapsEmbedUrl(value: string | undefined) { if(!value)return undefined; try { const url=new URL(value); const hosts=new Set(["google.com","www.google.com","maps.google.com"]); if(url.protocol!=="https:"||!hosts.has(url.hostname))return undefined; const standard=url.pathname.startsWith("/maps/embed"); const legacy=url.hostname==="maps.google.com"&&url.pathname==="/maps"&&url.searchParams.get("output")==="embed"; return standard||legacy?url.toString():undefined; } catch { return undefined; } }
function coordinate(value:string|undefined,min:number,max:number){if(!value?.trim())return undefined;const parsed=Number(value);return Number.isFinite(parsed)&&parsed>=min&&parsed<=max?parsed:undefined;}
const streetAddress=optionalText(process.env.PRIMARY_PROPERTY_STREET_ADDRESS);
const verifiedWhatsAppNumber=whatsappNumber(process.env.PRIMARY_PROPERTY_WHATSAPP_NUMBER);
const verifiedMapEmbedUrl=mapsEmbedUrl(process.env.PRIMARY_PROPERTY_GOOGLE_MAPS_EMBED_URL);
const latitude=coordinate(process.env.PRIMARY_PROPERTY_LATITUDE,-90,90);
const longitude=coordinate(process.env.PRIMARY_PROPERTY_LONGITUDE,-180,180);
const geo=latitude!==undefined&&longitude!==undefined?{latitude,longitude}:undefined;
export const PRIMARY_PROPERTY_MAPS_PROFILE_URL=optionalText(process.env.PRIMARY_PROPERTY_MAPS_PROFILE_URL);
export const PRIMARY_PROPERTY_LOCATION={addressLocality:optionalText(process.env.PRIMARY_PROPERTY_LOCALITY)??"",destination:optionalText(process.env.PRIMARY_PROPERTY_DESTINATION)??"",administrativeArea:optionalText(process.env.PRIMARY_PROPERTY_ADMINISTRATIVE_AREA)??"",addressRegion:optionalText(process.env.PRIMARY_PROPERTY_REGION)??"",postalCode:optionalText(process.env.PRIMARY_PROPERTY_POSTAL_CODE)??"",addressCountry:optionalText(process.env.PRIMARY_PROPERTY_COUNTRY_CODE)??"",countryName:optionalText(process.env.PRIMARY_PROPERTY_COUNTRY_NAME)??"",streetAddress,displayAddress:optionalText(process.env.PRIMARY_PROPERTY_DISPLAY_ADDRESS)??streetAddress??"",mapEmbedUrl:verifiedMapEmbedUrl,geo} as const;
export const PRIMARY_PROPERTY_CONTACT={email:CONTACT_EMAIL,whatsappNumber:verifiedWhatsAppNumber,whatsappHref:verifiedWhatsAppNumber?`https://wa.me/${verifiedWhatsAppNumber}`:undefined} as const;

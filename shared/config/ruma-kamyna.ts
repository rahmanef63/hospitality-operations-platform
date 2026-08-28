import { CONTACT_EMAIL } from "./site";

function optionalText(value: string | undefined): string | undefined {
  const normalized = value?.trim();
  return normalized ? normalized : undefined;
}

function whatsappNumber(value: string | undefined): string | undefined {
  const digits = value?.replace(/\D/g, "");
  return digits && digits.length >= 8 && digits.length <= 15 ? digits : undefined;
}

function mapsEmbedUrl(value: string | undefined): string | undefined {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    const allowedHosts = new Set(["google.com", "www.google.com", "maps.google.com"]);
    if (url.protocol !== "https:" || !allowedHosts.has(url.hostname)) return undefined;
    const standardEmbed = url.pathname.startsWith("/maps/embed");
    const legacyEmbed = url.hostname === "maps.google.com"
      && url.pathname === "/maps"
      && url.searchParams.get("output") === "embed";
    if (!standardEmbed && !legacyEmbed) return undefined;
    return url.toString();
  } catch {
    return undefined;
  }
}

function coordinate(value: string | undefined, min: number, max: number): number | undefined {
  if (!value?.trim()) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= min && parsed <= max ? parsed : undefined;
}

const streetAddress = optionalText(process.env.RUMA_KAMYNA_STREET_ADDRESS);
const verifiedWhatsAppNumber = whatsappNumber(process.env.RUMA_KAMYNA_WHATSAPP_NUMBER);
const verifiedMapEmbedUrl = mapsEmbedUrl(process.env.RUMA_KAMYNA_GOOGLE_MAPS_EMBED_URL);
const latitude = coordinate(process.env.RUMA_KAMYNA_LATITUDE, -90, 90);
const longitude = coordinate(process.env.RUMA_KAMYNA_LONGITUDE, -180, 180);
const geo = latitude !== undefined && longitude !== undefined ? { latitude, longitude } : undefined;

export const RUMA_KAMYNA_MAPS_PROFILE_URL =
  "https://www.google.com/maps/place/RUMA+KAMYNA/data=!4m2!3m1!1s0x0:0x970747a93434dce9";

export const RUMA_KAMYNA_LOCATION = {
  addressLocality: "Megamendung",
  destination: "Puncak",
  administrativeArea: "Kabupaten Bogor",
  addressRegion: "Jawa Barat",
  postalCode: "16770",
  addressCountry: "ID",
  countryName: "Indonesia",
  streetAddress,
  displayAddress: [
    streetAddress,
    "Kecamatan Megamendung",
    "Kabupaten Bogor",
    "Jawa Barat 16770",
    "Indonesia",
  ].filter(Boolean).join(", "),
  mapEmbedUrl: verifiedMapEmbedUrl,
  geo,
} as const;

export const RUMA_KAMYNA_CONTACT = {
  email: CONTACT_EMAIL,
  whatsappNumber: verifiedWhatsAppNumber,
  whatsappHref: verifiedWhatsAppNumber ? `https://wa.me/${verifiedWhatsAppNumber}` : undefined,
} as const;

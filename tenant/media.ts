import type { MediaAsset } from "@/shared/media/types";
const conceptCaption = "Example visual. Replace this asset in the tenant repository or CMS before launch.";
export const tenantMedia = {
  livingCourtyard: { variants: [
    { src: "/tenant/media/responsive/living-courtyard-640.webp", width: 640 },
    { src: "/tenant/media/responsive/living-courtyard-960.webp", width: 960 },
    { src: "/tenant/media/responsive/living-courtyard-1280.webp", width: 1280 },
  ], src: "/tenant/media/living-courtyard.webp", alt: "Example hospitality living space", width: 1600, height: 900, caption: conceptCaption },
  poolCourtyard: { variants: [
    { src: "/tenant/media/responsive/pool-courtyard-640.webp", width: 640 },
    { src: "/tenant/media/responsive/pool-courtyard-960.webp", width: 960 },
    { src: "/tenant/media/responsive/pool-courtyard-1280.webp", width: 1280 },
  ], src: "/tenant/media/pool-courtyard.webp", alt: "Example private-stay courtyard", width: 1600, height: 900, caption: conceptCaption },
  livingDining: { src: "/tenant/media/living-dining.webp", alt: "Example living and dining area", width: 1448, height: 1086, caption: conceptCaption },
  bedroomRetreat: { src: "/tenant/media/bedroom-retreat.webp", alt: "Example guest bedroom", width: 1448, height: 1086, caption: conceptCaption },
  spaBath: { src: "/tenant/media/spa-bath.webp", alt: "Example guest wellness space", width: 1448, height: 1086, caption: conceptCaption },
  welcomeDetails: { src: "/tenant/media/welcome-details.webp", alt: "Example guest welcome details", width: 1448, height: 1086, caption: conceptCaption },
  diningTable: { src: "/tenant/media/dining-table.webp", alt: "Example hospitality dining table", width: 1448, height: 1086, caption: conceptCaption },
  materialPalette: { src: "/tenant/media/material-palette.webp", alt: "Example hospitality material palette", width: 1448, height: 1086, caption: "Example material direction." },
  botanicalShadow: { src: "/tenant/media/botanical-shadow.webp", alt: "Example light and material study", width: 1600, height: 900, caption: "Example atmosphere study." },
  brandSerenity: { variants: [
    { src: "/tenant/media/responsive/brand-serenity-640.webp", width: 640 },
    { src: "/tenant/media/responsive/brand-serenity-960.webp", width: 960 },
    { src: "/tenant/media/responsive/brand-serenity-1280.webp", width: 1280 },
  ], src: "/tenant/media/brand-serenity.webp", alt: "Example hospitality brand setting", width: 1600, height: 840, caption: conceptCaption },
} as const satisfies Record<string, MediaAsset>;
export const tenantSocialImages = {
  site: "/tenant/media/site-social.jpg",
  property: "/tenant/media/property-social.jpg",
  brandAssets: "/tenant/media/brand-assets-social.jpg",
} as const;

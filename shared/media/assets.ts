import type { MediaAsset } from "./types";

const conceptCaption = "Visual concept. Final property details may evolve.";

export const media = {
  livingCourtyard: {
    variants: [
      { src: "/media/kamyna/responsive/living-courtyard-640.webp", width: 640 },
      { src: "/media/kamyna/responsive/living-courtyard-960.webp", width: 960 },
      { src: "/media/kamyna/responsive/living-courtyard-1280.webp", width: 1280 },
    ],
    src: "/media/kamyna/living-courtyard.webp",
    alt: "Sunlit living room opening onto a private courtyard and calm plunge pool",
    width: 1600,
    height: 900,
    caption: conceptCaption,
  },
  poolCourtyard: {
    variants: [
      { src: "/media/kamyna/responsive/pool-courtyard-640.webp", width: 640 },
      { src: "/media/kamyna/responsive/pool-courtyard-960.webp", width: 960 },
      { src: "/media/kamyna/responsive/pool-courtyard-1280.webp", width: 1280 },
    ],
    src: "/media/kamyna/pool-courtyard.webp",
    alt: "Quiet courtyard with a plunge pool, olive trees, timber doors, and stone walls",
    width: 1600,
    height: 900,
    caption: conceptCaption,
  },
  livingDining: {
    src: "/media/kamyna/living-dining.webp",
    alt: "Warm living and dining room arranged with natural timber, linen, and handmade ceramics",
    width: 1448,
    height: 1086,
    caption: conceptCaption,
  },
  bedroomRetreat: {
    src: "/media/kamyna/bedroom-retreat.webp",
    alt: "Calm bedroom opening toward a private pool through full-height timber doors",
    width: 1448,
    height: 1086,
    caption: conceptCaption,
  },
  spaBath: {
    src: "/media/kamyna/spa-bath.webp",
    alt: "Stone soaking bath with linen, ceramics, warm light, and a garden view",
    width: 1448,
    height: 1086,
    caption: conceptCaption,
  },
  welcomeDetails: {
    src: "/media/kamyna/welcome-details.webp",
    alt: "Thoughtful welcome details with folded linen, tea, a room key, and botanical stems",
    width: 1448,
    height: 1086,
    caption: conceptCaption,
  },
  diningTable: {
    src: "/media/kamyna/dining-table.webp",
    alt: "Long timber dining table set with quiet neutral ceramics and a linen runner",
    width: 1448,
    height: 1086,
    caption: conceptCaption,
  },
  materialPalette: {
    src: "/media/kamyna/material-palette.webp",
    alt: "Material palette of limestone, warm timber, natural linen, clay, and botanical branches",
    width: 1448,
    height: 1086,
    caption: "Material and atmosphere direction.",
  },
  botanicalShadow: {
    src: "/media/kamyna/botanical-shadow.webp",
    alt: "Soft botanical shadows moving across a textured warm plaster wall",
    width: 1600,
    height: 900,
    caption: "A study in light, texture, and stillness.",
  },
  brandSerenity: {
    variants: [
      { src: "/media/kamyna/responsive/brand-serenity-640.webp", width: 640 },
      { src: "/media/kamyna/responsive/brand-serenity-960.webp", width: 960 },
      { src: "/media/kamyna/responsive/brand-serenity-1280.webp", width: 1280 },
    ],
    src: "/media/kamyna/brand-serenity.webp",
    alt: "Kamyna Living identity composed on a tactile wall with ceramics, linen, and botanical shadows",
    width: 1600,
    height: 840,
    caption: "Kamyna Living visual world.",
  },
} as const satisfies Record<string, MediaAsset>;

export const socialImages = {
  kamynaLiving: "/media/kamyna/kamyna-living-social.jpg",
  rumaKamyna: "/media/kamyna/ruma-kamyna-social.jpg",
  brandAssets: "/media/kamyna/brand-assets-social.jpg",
} as const;

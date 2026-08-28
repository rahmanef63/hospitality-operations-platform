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
    alt: "Sunlit living room at Ruma Kamyna in Megamendung, Puncak Bogor, opening to a private courtyard pool",
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
    alt: "Private courtyard pool at Ruma Kamyna, a villa in Megamendung, Puncak Bogor, with stone walls and timber doors",
    width: 1600,
    height: 900,
    caption: conceptCaption,
  },
  livingDining: {
    src: "/media/kamyna/living-dining.webp",
    alt: "Warm living and dining space at Ruma Kamyna in Megamendung, Puncak Bogor, with timber and linen finishes",
    width: 1448,
    height: 1086,
    caption: conceptCaption,
  },
  bedroomRetreat: {
    src: "/media/kamyna/bedroom-retreat.webp",
    alt: "Calm bedroom concept for Ruma Kamyna in Megamendung, Puncak Bogor, opening toward a private pool",
    width: 1448,
    height: 1086,
    caption: conceptCaption,
  },
  spaBath: {
    src: "/media/kamyna/spa-bath.webp",
    alt: "Stone soaking bath concept at Ruma Kamyna in Megamendung, Puncak Bogor, with warm light and a garden view",
    width: 1448,
    height: 1086,
    caption: conceptCaption,
  },
  welcomeDetails: {
    src: "/media/kamyna/welcome-details.webp",
    alt: "Welcome details for Ruma Kamyna in Megamendung, Puncak Bogor, with linen, tea, a key, and botanical stems",
    width: 1448,
    height: 1086,
    caption: conceptCaption,
  },
  diningTable: {
    src: "/media/kamyna/dining-table.webp",
    alt: "Long dining table concept at Ruma Kamyna in Megamendung, Puncak Bogor, set with neutral ceramics and linen",
    width: 1448,
    height: 1086,
    caption: conceptCaption,
  },
  materialPalette: {
    src: "/media/kamyna/material-palette.webp",
    alt: "Material palette for Ruma Kamyna in Megamendung, Puncak Bogor, with limestone, timber, linen, and clay",
    width: 1448,
    height: 1086,
    caption: "Material and atmosphere direction.",
  },
  botanicalShadow: {
    src: "/media/kamyna/botanical-shadow.webp",
    alt: "Botanical shadows across the warm plaster palette of Ruma Kamyna in Megamendung, Puncak Bogor",
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
    alt: "Kamyna Living identity setting for Ruma Kamyna in Megamendung, Puncak Bogor, with ceramics and linen",
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

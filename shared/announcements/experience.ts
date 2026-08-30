import type { PresentationMediaKey, PresentationSlideSetting } from "./types";

export const PRESENTATION_MEDIA_OPTIONS: ReadonlyArray<{
  key: PresentationMediaKey;
  label: string;
  src: string;
}> = [
  { key: "livingCourtyard", label: "Living courtyard", src: "/media/hospitality/living-courtyard.webp" },
  { key: "bedroomRetreat", label: "Bedroom retreat", src: "/media/hospitality/bedroom-retreat.webp" },
  { key: "poolCourtyard", label: "Pool courtyard", src: "/media/hospitality/pool-courtyard.webp" },
  { key: "welcomeDetails", label: "Welcome details", src: "/media/hospitality/welcome-details.webp" },
  { key: "livingDining", label: "Living and dining", src: "/media/hospitality/living-dining.webp" },
  { key: "spaBath", label: "Spa bath", src: "/media/hospitality/spa-bath.webp" },
  { key: "diningTable", label: "Dining table", src: "/media/hospitality/dining-table.webp" },
  { key: "materialPalette", label: "Material palette", src: "/media/hospitality/material-palette.webp" },
];

export const PRESENTATION_SLIDE_LABELS = {
  arrival: "Welcome message",
  stay: "Guest and stay",
  stillness: "Brand stillness",
  contact: "Contact the host",
} as const;

export function defaultPresentationSlides(): PresentationSlideSetting[] {
  return [
    { key: "arrival", enabled: true, sortOrder: 10, durationSeconds: 10, mediaKey: "livingCourtyard" },
    { key: "stay", enabled: true, sortOrder: 20, durationSeconds: 10, mediaKey: "bedroomRetreat" },
    { key: "stillness", enabled: true, sortOrder: 30, durationSeconds: 10, mediaKey: "poolCourtyard" },
    { key: "contact", enabled: true, sortOrder: 40, durationSeconds: 10, mediaKey: "welcomeDetails" },
  ];
}

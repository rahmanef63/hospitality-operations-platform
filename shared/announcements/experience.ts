import type { PresentationMediaKey, PresentationSlideSetting } from "./types";

export const PRESENTATION_MEDIA_OPTIONS: ReadonlyArray<{
  key: PresentationMediaKey;
  label: string;
  src: string;
}> = [
  { key: "livingCourtyard", label: "Living courtyard", src: "/media/kamyna/living-courtyard.webp" },
  { key: "bedroomRetreat", label: "Bedroom retreat", src: "/media/kamyna/bedroom-retreat.webp" },
  { key: "poolCourtyard", label: "Pool courtyard", src: "/media/kamyna/pool-courtyard.webp" },
  { key: "welcomeDetails", label: "Welcome details", src: "/media/kamyna/welcome-details.webp" },
  { key: "livingDining", label: "Living and dining", src: "/media/kamyna/living-dining.webp" },
  { key: "spaBath", label: "Spa bath", src: "/media/kamyna/spa-bath.webp" },
  { key: "diningTable", label: "Dining table", src: "/media/kamyna/dining-table.webp" },
  { key: "materialPalette", label: "Material palette", src: "/media/kamyna/material-palette.webp" },
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

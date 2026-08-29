export const PWA_ICONS = [
  { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
  { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
  { src: "/icons/icon-512-maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" as const },
  { src: "/icons/icon-1024.png", sizes: "1024x1024", type: "image/png" },
  { src: "/icons/icon-1024-maskable.png", sizes: "1024x1024", type: "image/png", purpose: "maskable" as const },
] as const;

export const PWA_SCREENSHOTS = [
  {
    src: "/pwa/screenshots/kamyna-wide.png",
    sizes: "1280x720",
    type: "image/png",
    form_factor: "wide" as const,
    label: "Kamyna guest welcome on a TV display",
  },
  {
    src: "/pwa/screenshots/kamyna-narrow.png",
    sizes: "750x1334",
    type: "image/png",
    form_factor: "narrow" as const,
    label: "Kamyna Living on mobile",
  },
] as const;

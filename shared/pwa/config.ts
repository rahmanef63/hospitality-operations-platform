export const PWA_BUILD_VERSION = process.env.NEXT_PUBLIC_BUILD_VERSION ?? "development";
export const PWA_CACHE_PREFIX = "kamyna-pwa";
export const PWA_OFFLINE_URL = "/offline";

export const PWA_PRECACHE_URLS = [
  PWA_OFFLINE_URL,
  "/manifest.webmanifest",
  "/tv-manifest.webmanifest",
  "/favicon.svg",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/icon-512-maskable.png",
  "/icons/icon-1024.png",
  "/icons/icon-1024-maskable.png",
  "/brand/botanical-mark.svg",
  "/brand/ruma-kamyna-lockup.svg",
  "/media/kamyna/responsive/living-courtyard-1280.webp",
  "/media/kamyna/living-courtyard.webp",
  "/media/kamyna/responsive/pool-courtyard-1280.webp",
  "/media/kamyna/pool-courtyard.webp",
  "/media/kamyna/bedroom-retreat.webp",
  "/media/kamyna/welcome-details.webp",
] as const;

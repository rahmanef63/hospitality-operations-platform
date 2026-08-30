import { tenantSite } from "@/tenant/site";
export const PWA_BUILD_VERSION = process.env.NEXT_PUBLIC_BUILD_VERSION ?? "development";
export const PWA_CACHE_PREFIX = `${tenantSite.namespace}-pwa`;
export const PWA_OFFLINE_URL = "/offline";
export const PWA_PRESENTATION_URL = "/presentation?tv=1";
export const PWA_PRECACHE_URLS = [
  PWA_OFFLINE_URL, PWA_PRESENTATION_URL, "/manifest.webmanifest", "/presentation.webmanifest", "/tenant/brand/favicon.svg",
  "/tenant/icons/icon-192.png", "/tenant/icons/icon-512.png", "/tenant/icons/icon-512-maskable.png", "/tenant/icons/icon-1024.png", "/tenant/icons/icon-1024-maskable.png",
  "/tenant/brand/master-wordmark.svg", "/tenant/brand/property-lockup.svg",
  "/tenant/media/responsive/living-courtyard-1280.webp", "/tenant/media/living-courtyard.webp",
  "/tenant/media/responsive/pool-courtyard-1280.webp", "/tenant/media/pool-courtyard.webp",
  "/tenant/media/bedroom-retreat.webp", "/tenant/media/welcome-details.webp",
  "/audio/still-morning.mp3", "/audio/mountain-air.mp3", "/audio/night-courtyard.mp3", "/audio/LICENSE.txt",
] as const;

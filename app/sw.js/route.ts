import {
  PWA_BUILD_VERSION,
  PWA_CACHE_PREFIX,
  PWA_OFFLINE_URL,
  PWA_PRECACHE_URLS,
} from "@/shared/pwa/config";


function serviceWorkerSource() {
  const config = JSON.stringify({
    version: PWA_BUILD_VERSION,
    cachePrefix: PWA_CACHE_PREFIX,
    offlineUrl: PWA_OFFLINE_URL,
    precacheUrls: PWA_PRECACHE_URLS,
  });

  return `"use strict";
const CONFIG = ${config};
const STATIC_CACHE = CONFIG.cachePrefix + "-static-" + CONFIG.version;
const RUNTIME_CACHE = CONFIG.cachePrefix + "-runtime-" + CONFIG.version;
const CURRENT_CACHES = new Set([STATIC_CACHE, RUNTIME_CACHE]);

async function precache() {
  const cache = await caches.open(STATIC_CACHE);
  const offline = await fetch(CONFIG.offlineUrl, { cache: "reload" });
  if (!offline.ok) throw new Error("Offline fallback could not be cached.");
  await cache.put(CONFIG.offlineUrl, offline);
  await Promise.all(CONFIG.precacheUrls.filter((url) => url !== CONFIG.offlineUrl).map(async (url) => {
    try {
      const response = await fetch(url, { cache: "reload" });
      if (response.ok) await cache.put(url, response);
    } catch {}
  }));
}

async function cleanObsoleteCaches() {
  const keys = await caches.keys();
  await Promise.all(keys
    .filter((key) => key.startsWith(CONFIG.cachePrefix + "-") && !CURRENT_CACHES.has(key))
    .map((key) => caches.delete(key)));
}

async function notifyActivation() {
  const windows = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
  for (const client of windows) client.postMessage({ type: "KAMYNA_SW_ACTIVATED", version: CONFIG.version });
}

self.addEventListener("install", (event) => {
  event.waitUntil(precache());
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    await cleanObsoleteCaches();
    await self.clients.claim();
    await notifyActivation();
  })());
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "KAMYNA_SKIP_WAITING") self.skipWaiting();
  if (event.data?.type === "KAMYNA_GET_VERSION" && event.ports?.[0]) {
    event.ports[0].postMessage({ version: CONFIG.version });
  }
});

function isPrivateRequest(url) {
  return url.pathname.startsWith("/admin")
    || url.pathname.startsWith("/api")
    || (url.pathname === "/welcome" && url.searchParams.has("token"));
}

function isCacheableAsset(pathname) {
  return pathname.startsWith("/_next/static/")
    || pathname.startsWith("/icons/")
    || pathname.startsWith("/brand/")
    || pathname.startsWith("/media/")
    || pathname.startsWith("/pwa/")
    || pathname === "/favicon.svg"
    || pathname === "/favicon.ico"
    || pathname === "/apple-touch-icon.png"
    || pathname === "/manifest.webmanifest";
}

async function networkFirstNavigation(request) {
  try {
    return await fetch(request);
  } catch {
    return (await caches.match(CONFIG.offlineUrl)) || Response.error();
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  const cached = await cache.match(request);
  const network = fetch(request).then(async (response) => {
    if (response.ok && response.type === "basic") await cache.put(request, response.clone());
    return response;
  }).catch(() => cached || Response.error());
  return cached || network;
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin || url.pathname === "/sw.js" || isPrivateRequest(url)) return;
  if (request.mode === "navigate") {
    event.respondWith(networkFirstNavigation(request));
    return;
  }
  if (isCacheableAsset(url.pathname)) event.respondWith(staleWhileRevalidate(request));
});
`;
}

export function GET() {
  return new Response(serviceWorkerSource(), {
    headers: {
      "Cache-Control": "no-cache, no-store, must-revalidate",
      "Content-Type": "application/javascript; charset=utf-8",
      "Service-Worker-Allowed": "/",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

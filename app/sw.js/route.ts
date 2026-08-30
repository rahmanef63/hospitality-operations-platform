import {
  PWA_BUILD_VERSION,
  PWA_CACHE_PREFIX,
  PWA_OFFLINE_URL,
  PWA_PRECACHE_URLS,
  PWA_PRESENTATION_URL,
} from "@/shared/pwa/config";


function serviceWorkerSource() {
  const config = JSON.stringify({
    version: PWA_BUILD_VERSION,
    cachePrefix: PWA_CACHE_PREFIX,
    offlineUrl: PWA_OFFLINE_URL,
    presentationUrl: PWA_PRESENTATION_URL,
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
    || (["/welcome", "/presentation"].includes(url.pathname) && url.searchParams.has("token"));
}

function isCacheableAsset(pathname) {
  return pathname.startsWith("/_next/static/")
    || pathname.startsWith("/icons/")
    || pathname.startsWith("/brand/")
    || pathname.startsWith("/media/")
    || pathname.startsWith("/pwa/")
    || pathname.startsWith("/audio/")
    || pathname === "/favicon.svg"
    || pathname === "/favicon.ico"
    || pathname === "/apple-touch-icon.png"
    || pathname === "/manifest.webmanifest"
    || pathname === "/presentation.webmanifest";
}

async function networkFirstNavigation(request) {
  try {
    return await fetch(request, { cache: "no-store" });
  } catch {
    const url = new URL(request.url);
    if (url.pathname === "/presentation" && !url.searchParams.has("token")) {
      const presentation = await caches.match(CONFIG.presentationUrl);
      if (presentation) return presentation;
    }
    return (await caches.match(CONFIG.offlineUrl)) || Response.error();
  }
}

async function audioRangeResponse(request) {
  const range = request.headers.get("range");
  if (!range) return fetch(request);
  let response = await caches.match(request.url);
  if (!response) {
    response = await fetch(new Request(request.url, { cache: "reload" }));
    if (response.ok && response.status === 200) {
      const cache = await caches.open(RUNTIME_CACHE);
      await cache.put(request.url, response.clone());
    }
  }
  if (!response || !response.ok) return response || Response.error();
  const match = /^bytes=([0-9]+)-([0-9]*)$/.exec(range);
  if (!match) return new Response(null, { status: 416 });
  const buffer = await response.arrayBuffer();
  const start = Number(match[1]);
  const requestedEnd = match[2] ? Number(match[2]) : buffer.byteLength - 1;
  const end = Math.min(requestedEnd, buffer.byteLength - 1);
  if (!Number.isFinite(start) || start < 0 || start > end) {
    return new Response(null, {
      status: 416,
      headers: { "Content-Range": "bytes */" + buffer.byteLength },
    });
  }
  const headers = new Headers(response.headers);
  headers.set("Accept-Ranges", "bytes");
  headers.set("Content-Length", String(end - start + 1));
  headers.set("Content-Range", "bytes " + start + "-" + end + "/" + buffer.byteLength);
  return new Response(buffer.slice(start, end + 1), { status: 206, statusText: "Partial Content", headers });
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
  if (url.pathname.startsWith("/audio/") && request.headers.has("range")) {
    event.respondWith(audioRangeResponse(request));
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

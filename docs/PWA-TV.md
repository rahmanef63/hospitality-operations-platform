# Kamyna Presentation and PWA

## Dedicated TV endpoint

The TV experience lives only at `/presentation`. The standard `/welcome` guest page remains unchanged. Admin actions convert the existing encrypted welcome URL into a `/presentation?token=...&tv=1` URL, so guest name, language, property, unit, and stay dates still resolve from the same server-authoritative reservation.

The presentation provides:

- four full-bleed slides using reviewed Kamyna concept media;
- visible concept disclosure on every media slide;
- previous, slideshow/pause, next, install, and fullscreen controls;
- Arrow, Page Up/Down, Home/End, Enter, Space, media-key, and `F` remote/keyboard controls;
- 10-second autoplay on `/presentation` unless `tv=0` is supplied;
- automatic pause while hidden and Screen Wake Lock while active when supported;
- a landscape request after a successful fullscreen gesture;
- reduced-motion fallback and 16:9 overscan-safe spacing for 720p/1080p displays.

Fullscreen remains user-gesture gated in ordinary browser tabs. Installed compatible PWAs may honor fullscreen display mode; unsupported platforms fall back to standalone.

## Two install identities

Kamyna publishes two manifests:

- `/manifest.webmanifest` keeps the existing root/mobile app at `/`, standalone and portrait-oriented;
- `/presentation.webmanifest` is linked only from `/presentation`, starts at `/presentation?tv=1`, and requests landscape fullscreen with standalone/minimal fallbacks.

Both include 192, 512, and 1024 pixel icons with maskable variants. The root app includes wide/narrow screenshots and a shortcut to `/presentation`; the TV manifest uses a dedicated presentation screenshot. Installation support is controlled by the browser and TV operating system. When `beforeinstallprompt` is available, the presentation Install button invokes it; otherwise the UI shows Add to Home screen guidance.

## Service worker and privacy boundary

`/sw.js` has root scope and precaches public shell assets, a generic `/presentation?tv=1` shell, and `/offline`. It runtime-caches only same-origin static assets, icons, public media, and PWA screenshots.

The worker bypasses `/admin/*`, `/api/*`, and any `/welcome` or `/presentation` URL containing a private `token`. A loaded private presentation can continue showing already-loaded slides if connectivity drops, but guest-specific HTML is never written to Cache Storage.

## New-version restart

Each build embeds one build ID in the app and worker. The client checks for updates on load, focus, visibility return, and every 15 minutes. When a new worker waits, a persistent **Restart sekarang** toast appears.

Restart performs this bounded sequence:

1. send `KAMYNA_SKIP_WAITING`;
2. activate the new worker;
3. delete only obsolete cache names beginning with `kamyna-pwa-`;
4. claim active windows and notify them after cleanup;
5. reload once under the new controller.

It never clears cookies, local storage, unrelated caches, or server-only secrets.

## Verification

Run `npm run verify` and `npm run smoke`, then check `/presentation` at 1920×1080, 1280×720, and 390×844. Verify keyboard/remote navigation, fullscreen feature detection, service-worker registration, manifest parsing, offline fallback, and an update cycle across two build versions.

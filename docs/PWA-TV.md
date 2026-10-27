# Hospitality Presentation and PWA

## Dedicated TV endpoint

The TV experience lives only at `/presentation`. The standard `/welcome` guest page remains unchanged. Admin actions convert the existing encrypted welcome URL into a `/presentation?token=...&tv=1` URL, so guest name, language, property, unit, and stay dates still resolve from the same server-authoritative reservation.

The presentation provides:

- four full-bleed slides using reviewed Hospitality concept media;
- visible concept disclosure on every media slide;
- previous, slideshow/pause, next, install, and fullscreen controls;
- Arrow, Page Up/Down, Home/End, Enter, Space, media-key, and `F` remote/keyboard controls;
- 10-second autoplay on `/presentation` unless `tv=0` is supplied;
- automatic pause while hidden and Screen Wake Lock while active when supported;
- a landscape request after a successful fullscreen gesture;
- reduced-motion fallback and 16:9 overscan-safe spacing for 720p/1080p displays.

Fullscreen remains user-gesture gated in ordinary browser tabs. Installed compatible PWAs may honor fullscreen display mode; unsupported platforms fall back to standalone.

## Two install identities

Hospitality publishes two manifests:

- `/manifest.webmanifest` keeps the existing root/mobile app at `/`, standalone and portrait-oriented;
- `/presentation.webmanifest` is linked only from `/presentation`, starts at `/presentation?tv=1`, and requests landscape fullscreen with standalone/minimal fallbacks.

Both include 192, 512, and 1024 pixel icons with maskable variants. The root app includes wide/narrow screenshots and a shortcut to `/presentation`; the TV manifest uses a dedicated presentation screenshot. Installation support is controlled by the browser and TV operating system. When `beforeinstallprompt` is available, the presentation Install button invokes it; otherwise the UI shows Add to Home screen guidance.

## Service worker and privacy boundary

`/sw.js` has root scope and precaches public shell assets, a generic `/presentation?tv=1` shell, and `/offline`. It runtime-caches only same-origin static assets, icons, public media, and PWA screenshots.

The worker bypasses `/admin/*`, `/api/*`, and any `/welcome` or `/presentation` URL containing a private `token`. A loaded private presentation can continue showing already-loaded slides if connectivity drops, but guest-specific HTML is never written to Cache Storage.

## New-version restart

Each build embeds one build ID in the app and worker. The client checks for updates on load, focus, visibility return, and every 15 minutes.

On public routes, a waiting worker is activated automatically. The update sequence is deliberately bounded:

1. send `HOSPITALITY_SKIP_WAITING`;
2. activate the new worker;
3. delete only obsolete Cache Storage entries whose name starts with `hospitality-pwa-`;
4. clear only Hospitality-owned public `localStorage`/`sessionStorage` keys and non-HttpOnly public cookies using the `hospitality:` / `hospitality-pwa-` / `hospitality-public-` prefixes;
5. claim active windows and reload once under the new controller.

`/admin/*` never auto-restarts. Admin receives a manual restart action so unsaved forms are not interrupted. The signed `__Host-hop-admin` HttpOnly cookie is never targeted or cleared. Unrelated cookies, storage, caches, and browser data are untouched.

## Verification

Run `bun run verify` and `bun run smoke`, then check `/presentation` at 1920×1080, 1280×720, and 390×844. Verify keyboard/remote navigation, fullscreen feature detection, service-worker registration, manifest parsing, offline fallback, and an update cycle across two build versions.

## Presentation audio

The `/presentation` controls include an icon-only lo-fi toggle and the keyboard shortcut `M`. Audio starts muted and plays only after a user gesture. The selected same-origin MP3 is chosen per property in admin, loops locally, supports PWA byte-range playback, and stops when the component is removed. All bundled tracks are original sample-free Hospitality recordings dedicated under CC0 1.0; see `docs/AUDIO-LICENSES.md`.

The regular `/welcome` route has a separate icon-only announcement mute control. This does not turn the presentation music on or off. Both routes remain usable when their respective browser audio APIs are unavailable.


## Configurable lo-fi and presentation composition

The selected presentation track, volume, slide visibility, order, duration, media, brand chrome, language selector, counter, and install button are property-scoped settings managed from `/admin/welcome`. The three bundled loops are original, sample-free recordings dedicated under CC0 1.0 and documented in `docs/AUDIO-LICENSES.md`. Playback always starts muted and requires a user gesture. The `M` key mirrors the icon-only music control. Audio files are same-origin PWA assets and are available to the generic offline presentation shell.

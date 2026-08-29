# Kamyna TV Presentation and PWA

## Guest TV mode

Every private welcome URL can be opened with `tv=1`. The admin Welcome module exposes a **TV mode** action for each eligible reservation, so the encrypted reservation token, guest language, property, unit, and stay dates remain connected to the same server-authoritative record.

TV mode provides:

- four full-bleed visual slides using reviewed Kamyna concept media;
- visible concept disclosure on every media slide;
- previous, slideshow/pause, next, install, and fullscreen controls;
- Arrow, Page Up/Down, Home/End, Enter, Space, media-key, and `F` keyboard/remote controls;
- 10-second autoplay after an explicit Slideshow action, or immediately when opened with `tv=1`;
- automatic pause while the page is hidden;
- Screen Wake Lock while playback is active when the browser supports it;
- landscape orientation request after a successful fullscreen gesture;
- no autoplay animation when `prefers-reduced-motion` is enabled;
- safe-area and 16:9 overscan-aware layout for 720p and 1080p displays.

Fullscreen remains user-gesture gated by browsers. Installed Android-class PWAs may honor the manifest's fullscreen display override; unsupported platforms fall back to standalone or minimal UI.

## Installability

Kamyna exposes two install identities: the root app for phone/desktop use and a dedicated `/tv-manifest.webmanifest` linked from the Welcome route. Installing from the Welcome page therefore launches `/welcome?tv=1` in landscape/fullscreen mode without persisting a private reservation token.

The manifests include:

- stable app `id` and root scope;
- fullscreen → standalone → minimal UI fallback chain;
- orientation `any` for phone, tablet, desktop, and TV layouts;
- 192, 512, and 1024 pixel launcher icons, including maskable variants;
- wide and narrow install screenshots;
- shortcuts to Ruma Kamyna and Guest Welcome TV mode;
- launch handling that prefers an existing app window;
- dark splash/background colors aligned with the welcome presentation.

The UI listens for `beforeinstallprompt`. When a compatible browser offers native installation, Kamyna displays an Install action. On browsers that do not expose that event, the TV toolbar provides manual Add to Home screen guidance. Install support is ultimately controlled by the browser and TV operating system.

## Service worker and offline boundary

`/sw.js` has root scope and a fetch handler. It precaches only public shell assets and an `/offline` fallback. Runtime caching is limited to same-origin hashed/static assets, icons, brand files, public media, and PWA screenshots.

The worker deliberately bypasses:

- `/admin/*`;
- `/api/*`;
- private `/welcome?token=...` navigations.

This prevents authenticated, financial, reservation, and guest-specific responses from entering Cache Storage. A loaded private welcome can continue displaying its already-loaded slides if connectivity drops, but a cold offline reload does not expose previously viewed guest data.

## New-version restart

Each build receives a unique build ID that is embedded into the client and service worker. The client checks for a worker update on load, focus, visibility return, and every 15 minutes. It also compares the active worker version with the client build so a stale tab still receives the restart prompt even when no waiting worker was visible at first render.

When a new worker reaches `waiting`, a persistent toast offers **Restart sekarang**. The action:

1. sends `KAMYNA_SKIP_WAITING` to the waiting worker;
2. activates the new worker;
3. deletes only obsolete cache names beginning with `kamyna-pwa-`;
4. claims active windows;
5. notifies the client after cleanup;
6. reloads once under the new controller.

The update process never calls `localStorage.clear`, never clears cookies, never removes unrelated origin caches, and never puts server-only secrets into build arguments.

## Verification

Run:

```bash
npm run verify
npm run smoke
```

Browser verification should cover:

- 1920×1080 and 1280×720 TV-like viewports;
- 390×844 mobile;
- slideshow timing and keyboard navigation;
- fullscreen feature detection;
- service-worker registration and cache names;
- manifest parsing, icons, screenshots, and shortcuts;
- update toast after a second build version activates;
- offline fallback with private-token responses excluded.

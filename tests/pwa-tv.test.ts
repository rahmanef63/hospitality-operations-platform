import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import manifest from "@/app/manifest";
import { GET as presentationManifestResponse } from "@/app/presentation.webmanifest/route";
import { GET as serviceWorker } from "@/app/sw.js/route";
import { LOFI_TRACKS } from "@/shared/announcements";

const root = process.cwd();
const read = (file: string) => readFileSync(path.join(root, file), "utf8");

describe("TV presentation and PWA lifecycle", () => {
  it("keeps the main app mobile-oriented while publishing richer install metadata", () => {
    const value = manifest();
    expect(value).toMatchObject({ id: "/", start_url: "/", display: "standalone", orientation: "portrait-primary" });
    expect(value.display_override).toEqual(["standalone", "minimal-ui"]);
    expect(value.icons).toHaveLength(5);
    expect(value.screenshots).toHaveLength(2);
    expect(value.shortcuts?.some((shortcut) => shortcut.url === "/presentation?tv=1")).toBe(true);
    for (const screenshot of value.screenshots) {
      expect(existsSync(path.join(root, "public", screenshot.src.replace(/^\//, "")))).toBe(true);
    }
  });

  it("publishes the TV experience only at /presentation with its own landscape manifest", async () => {
    const response = presentationManifestResponse();
    const value = await response.json();
    expect(response.headers.get("content-type")).toContain("application/manifest+json");
    expect(value).toMatchObject({ id: "/presentation", start_url: "/presentation?tv=1", display: "fullscreen", orientation: "landscape" });
    expect(read("app/presentation/page.tsx")).toContain('manifest: "/presentation.webmanifest"');
    expect(read("app/welcome/page.tsx")).not.toContain("PresentationPage");
    expect(read("slices/welcome/components/welcome-page.tsx")).not.toContain("WelcomePresentation");
  });

  it("serves a no-cache worker with bounded cleanup, private-route exclusions, and offline audio", async () => {
    const response = serviceWorker();
    const source = await response.text();
    expect(response.headers.get("cache-control")).toContain("no-store");
    expect(response.headers.get("service-worker-allowed")).toBe("/");
    expect(source).toContain("HOSPITALITY_SKIP_WAITING");
    expect(source).toContain('key.startsWith(CONFIG.cachePrefix + "-")');
    expect(source).toContain('url.pathname.startsWith("/admin")');
    expect(source).toContain('url.pathname.startsWith("/api")');
    expect(source).toContain('["/welcome", "/presentation"].includes(url.pathname)');
    expect(source).toContain('url.searchParams.has("token")');
    expect(source).toContain('pathname.startsWith("/audio/")');
    expect(source).toContain("audioRangeResponse");
    expect(source).toContain('request.headers.has("range")');
    expect(source).toContain('"Content-Range"');
    expect(source).toContain('fetch(request, { cache: "no-store" })');
    expect(source).toContain('/^bytes=([0-9]+)-([0-9]*)$/');
    expect(source).toContain('status: 206');
    expect(source).not.toContain("localStorage.clear");
    for (const track of LOFI_TRACKS) {
      expect(source).toContain(track.src);
      expect(existsSync(path.join(root, "public", track.src.replace(/^\//, "")))).toBe(true);
    }
  });

  it("auto-activates public updates with bounded cleanup while protecting admin sessions", () => {
    const manager = read("slices/site-shell/components/pwa-manager.tsx");
    expect(manager).toContain("beforeinstallprompt");
    expect(manager).toContain("updatefound");
    expect(manager).toContain("controllerchange");
    expect(manager).toContain("HOSPITALITY_SKIP_WAITING");
    expect(manager).toContain("HOSPITALITY_GET_VERSION");
    expect(manager).toContain("cleanupPublicClientState");
    expect(manager).toContain('window.location.pathname.startsWith("/admin")');
    expect(manager).toContain('window.setTimeout(() => void restartWithLatest(true), 900)');
    expect(manager).toContain('name.startsWith("hospitality-public-")');
    expect(manager).toContain('name.startsWith("hospitality-pwa-")');
    expect(manager).not.toContain("localStorage.clear()");
    expect(manager).not.toContain('document.cookie = "__Host-hop-admin');
    expect(manager).toContain('updateViaCache: "none"');
  });

  it("ships configurable /presentation slides, real CC0 lo-fi, fullscreen, remote keys, and wake lock", () => {
    const presentation = read("slices/welcome/components/welcome-presentation.tsx");
    const page = read("slices/welcome/components/presentation-page.tsx");
    const music = read("slices/welcome/hooks/use-lofi-music.ts");
    expect(presentation).toContain("requestFullscreen");
    expect(presentation).toContain("wakeLock");
    expect(presentation).toContain('event.key.toLowerCase() === "m"');
    expect(presentation).toContain("music.track.title");
    expect(presentation).not.toContain("Play ambient music");
    expect(music).toContain("new Audio(input.track.src)");
    expect(music).toContain("audio.loop = true");
    expect(page).toContain("presentationSlides");
    expect(page).toContain("durationSeconds");
    expect(read("public/audio/LICENSE.txt")).toContain("CC0 1.0 Universal");
    expect(read("slices/admin/components/announcement-settings-form.tsx")).toContain("LOFI_TRACKS");
    expect(read("slices/admin/components/guest-experience-settings-form.tsx")).toContain("Slide composition");
  });

  it("keeps /welcome full-viewport with admin-controlled sections and an icon-only announcement mute", () => {
    const welcome = read("slices/welcome/components/welcome-page.tsx");
    const styles = read("app/welcome.css");
    expect(welcome).toContain('min-h-[100svh] min-h-[100dvh] w-full');
    expect(welcome).not.toContain('max-w-[96rem]');
    expect(welcome).toContain("welcomeShowLanguage");
    expect(welcome).toContain("welcomeShowStay");
    expect(welcome).toContain("Unmute guest announcements");
    expect(welcome).toContain('aria-live="polite"');
    expect(styles).toContain("height: 100dvh");
  });
});

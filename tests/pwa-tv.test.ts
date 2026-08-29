import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import manifest from "@/app/manifest";
import { GET as presentationManifestResponse } from "@/app/presentation.webmanifest/route";
import { GET as serviceWorker } from "@/app/sw.js/route";

const root = process.cwd();
const read = (file: string) => readFileSync(path.join(root, file), "utf8");

describe("TV presentation and PWA lifecycle", () => {
  it("keeps the main app mobile-oriented while publishing richer install metadata", () => {
    const value = manifest();
    expect(value.id).toBe("/");
    expect(value.start_url).toBe("/");
    expect(value.display).toBe("standalone");
    expect(value.display_override).toEqual(["standalone", "minimal-ui"]);
    expect(value.orientation).toBe("portrait-primary");
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
    expect(value).toMatchObject({
      id: "/presentation",
      start_url: "/presentation?tv=1",
      display: "fullscreen",
      orientation: "landscape",
    });
    expect(read("app/presentation/page.tsx")).toContain('manifest: "/presentation.webmanifest"');
    expect(read("app/welcome/page.tsx")).not.toContain("PresentationPage");
    expect(read("slices/welcome/components/welcome-page.tsx")).not.toContain("WelcomePresentation");
  });

  it("serves a no-cache worker with bounded cleanup and private-route exclusions", async () => {
    const response = serviceWorker();
    const source = await response.text();
    expect(response.headers.get("cache-control")).toContain("no-store");
    expect(response.headers.get("service-worker-allowed")).toBe("/");
    expect(source).toContain("KAMYNA_SKIP_WAITING");
    expect(source).toContain("KAMYNA_SW_ACTIVATED");
    expect(source).toContain('key.startsWith(CONFIG.cachePrefix + "-")');
    expect(source).toContain('url.pathname.startsWith("/admin")');
    expect(source).toContain('url.pathname.startsWith("/api")');
    expect(source).toContain('["/welcome", "/presentation"].includes(url.pathname)');
    expect(source).toContain('url.searchParams.has("token")');
    expect(source).toContain("CONFIG.presentationUrl");
    expect(source).not.toContain("localStorage.clear");
  });

  it("prompts before activating a new build and cleaning obsolete Kamyna caches", () => {
    const manager = read("slices/site-shell/components/pwa-manager.tsx");
    expect(manager).toContain("beforeinstallprompt");
    expect(manager).toContain("updatefound");
    expect(manager).toContain("controllerchange");
    expect(manager).toContain("KAMYNA_SKIP_WAITING");
    expect(manager).toContain("KAMYNA_GET_VERSION");
    expect(manager).toContain("version !== PWA_BUILD_VERSION");
    expect(manager).toContain("Restart sekarang");
    expect(manager).toContain('updateViaCache: "none"');
    expect(read("app/layout.tsx")).toContain("<PwaManager />");
    expect(read("app/offline/page.tsx")).toContain("data-kamyna-offline");
  });

  it("ships /presentation with fullscreen, remote keys, wake lock, and reduced motion", () => {
    const presentation = read("slices/welcome/components/welcome-presentation.tsx");
    const styles = read("app/presentation.css");
    expect(presentation).toContain("requestFullscreen");
    expect(presentation).toContain("wakeLock");
    expect(presentation).toContain('"ArrowRight"');
    expect(presentation).toContain("MediaPlayPause");
    expect(presentation).toContain('event.key.toLowerCase() === "f"');
    expect(presentation).toContain("prefers-reduced-motion: reduce");
    expect(presentation).toContain("SLIDE_INTERVAL");
    expect(presentation).toContain('routePath="/presentation"');
    expect(styles).toContain(".welcome-tv-root:fullscreen");
    expect(styles).toContain("min-aspect-ratio: 16/10");
    expect(read("slices/admin/components/reservation-welcome-panel.tsx")).toContain('url.pathname = "/presentation"');
    expect(read("slices/admin/components/welcome-editor.tsx")).toContain("presentationUrl");
  });
});

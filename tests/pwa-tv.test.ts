import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import manifest from "@/app/manifest";
import { GET as serviceWorker } from "@/app/sw.js/route";
import { GET as tvManifestResponse } from "@/app/tv-manifest.webmanifest/route";

const root = process.cwd();
const read = (file: string) => readFileSync(path.join(root, file), "utf8");

describe("TV presentation and PWA lifecycle", () => {
  it("publishes a fullscreen-capable install manifest with rich launcher metadata", () => {
    const value = manifest();
    expect(value.id).toBe("/");
    expect(value.start_url).toBe("/");
    expect(value.display).toBe("standalone");
    expect(value.display_override).toEqual(["fullscreen", "standalone", "minimal-ui"]);
    expect(value.orientation).toBe("any");
    expect(value.icons).toHaveLength(5);
    expect(value.screenshots).toHaveLength(2);
    expect(value.shortcuts?.some((shortcut) => shortcut.url === "/welcome?tv=1")).toBe(true);
    for (const screenshot of value.screenshots) {
      expect(existsSync(path.join(root, "public", screenshot.src.replace(/^\//, "")))).toBe(true);
    }
  });


  it("publishes a dedicated landscape TV install identity from the welcome page", async () => {
    const response = tvManifestResponse();
    const value = await response.json();
    expect(response.headers.get("content-type")).toContain("application/manifest+json");
    expect(value).toMatchObject({
      id: "/welcome-tv",
      start_url: "/welcome?tv=1",
      display: "fullscreen",
      orientation: "landscape",
    });
    expect(read("app/welcome/page.tsx")).toContain('manifest: "/tv-manifest.webmanifest"');
  });

  it("serves a no-cache service worker with bounded app-owned cache cleanup", async () => {
    const response = serviceWorker();
    const source = await response.text();
    expect(response.headers.get("cache-control")).toContain("no-store");
    expect(response.headers.get("service-worker-allowed")).toBe("/");
    expect(source).toContain("KAMYNA_SKIP_WAITING");
    expect(source).toContain("KAMYNA_SW_ACTIVATED");
    expect(source).toContain('key.startsWith(CONFIG.cachePrefix + "-")');
    expect(source).toContain('url.pathname.startsWith("/admin")');
    expect(source).toContain('url.pathname.startsWith("/api")');
    expect(source).toContain('url.searchParams.has("token")');
    expect(source).not.toContain("localStorage.clear");
  });

  it("prompts for a restart instead of silently mixing old and new builds", () => {
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

  it("ships a remote-friendly slideshow with fullscreen, wake lock, and reduced-motion handling", () => {
    const presentation = read("slices/welcome/components/welcome-presentation.tsx");
    const styles = read("app/welcome-presentation.css");
    expect(presentation).toContain("requestFullscreen");
    expect(presentation).toContain("wakeLock");
    expect(presentation).toContain('"ArrowRight"');
    expect(presentation).toContain("MediaPlayPause");
    expect(presentation).toContain('event.key.toLowerCase() === "f"');
    expect(presentation).toContain("prefers-reduced-motion: reduce");
    expect(presentation).toContain("SLIDE_INTERVAL");
    expect(styles).toContain(".welcome-tv-root:fullscreen");
    expect(styles).toContain("min-aspect-ratio: 16/10");
    expect(read("slices/admin/components/reservation-welcome-panel.tsx")).toContain("TV mode");
    expect(read("slices/admin/components/welcome-editor.tsx")).toContain("TV mode");
  });
});

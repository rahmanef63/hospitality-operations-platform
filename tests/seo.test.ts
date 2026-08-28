import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it, vi } from "vitest";
import manifest from "@/app/manifest";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import {
  GOOGLE_SITE_VERIFICATION,
  SITE_URL,
} from "@/shared/config/site";
import { properties } from "@/shared/content/config/properties";
import { media, socialImages, type MediaAsset } from "@/shared/media";
import { buildGlobalSchema, buildHomeSchema, buildPropertySchema } from "@/shared/seo";

vi.mock("next/cache", () => ({ cacheLife: vi.fn(), cacheTag: vi.fn() }));

const publicRoot = path.resolve(process.cwd(), "public");
const absolutePath = (src: string) => path.join(publicRoot, src.replace(/^\//, ""));

describe("search and sharing surfaces", () => {
  it("keeps the exact Google site verification token", () => {
    expect(GOOGLE_SITE_VERIFICATION).toBe("E6-55-Sl0x-BwAAgBwYg8MTz4HBUVlc3ZlFkKmtFVBs");
  });

  it("publishes crawl and discovery routes from the canonical origin", async () => {
    const robotsFile = robots();
    expect(robotsFile.sitemap).toBe(`${SITE_URL}/sitemap.xml`);
    expect(robotsFile.host).toBe(SITE_URL);

    const entries = await sitemap();
    expect(entries.map((entry) => entry.url)).toEqual(expect.arrayContaining([
      SITE_URL,
      `${SITE_URL}/brand-assets`,
      `${SITE_URL}/stays/ruma-kamyna`,
    ]));
    expect(entries.every((entry) => entry.url.startsWith("https://"))).toBe(true);
  });

  it("ships complete PWA and social image metadata", () => {
    const webManifest = manifest();
    expect(webManifest.start_url).toBe("/");
    expect(webManifest.icons).toHaveLength(3);
    for (const src of Object.values(socialImages)) expect(existsSync(absolutePath(src))).toBe(true);
  });

  it("ships every editorial image with dimensions, alt text, and an existing file", () => {
    for (const asset of Object.values(media) as readonly MediaAsset[]) {
      expect(asset.width).toBeGreaterThan(0);
      expect(asset.height).toBeGreaterThan(0);
      expect(asset.alt.trim().length).toBeGreaterThan(20);
      expect(existsSync(absolutePath(asset.src))).toBe(true);
      for (const variant of asset.variants ?? []) {
        expect(variant.width).toBeLessThan(asset.width);
        expect(existsSync(absolutePath(variant.src))).toBe(true);
      }
    }
  });

  it("keeps structured data connected, truthful, and location-neutral", () => {
    const global = JSON.stringify(buildGlobalSchema());
    const home = JSON.stringify(buildHomeSchema(properties));
    const stay = JSON.stringify(buildPropertySchema(properties[0]!));
    expect(global).toContain("Organization");
    expect(global).toContain("WebSite");
    expect(home).toContain("CollectionPage");
    expect(stay).toContain("Accommodation");
    expect(stay).not.toContain("LodgingBusiness");
    expect(`${global}${home}${stay}`.toLowerCase()).not.toContain(["ba", "li"].join(""));
  });
});

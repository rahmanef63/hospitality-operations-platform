import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it, vi } from "vitest";
import manifest from "@/app/manifest";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import {
  GOOGLE_SITE_VERIFICATION,
  HOME_SEO_DESCRIPTION,
  HOME_SEO_TITLE,
  SITE_URL,
} from "@/shared/config/site";
import { areaGuides } from "@/shared/content/config/guides";
import { properties } from "@/shared/content/config/properties";
import { RUMA_KAMYNA_PUBLIC_FALLBACK } from "@/shared/pms";
import { media, socialImages, type MediaAsset } from "@/shared/media";
import {
  buildAreaGuideSchema,
  buildGlobalSchema,
  buildHomeSchema,
  buildPropertySchema,
} from "@/shared/seo";

vi.mock("next/cache", () => ({ cacheLife: vi.fn(), cacheTag: vi.fn() }));

const publicRoot = path.resolve(process.cwd(), "public");
const absolutePath = (src: string) => path.join(publicRoot, src.replace(/^\//, ""));
const graph = (schema: unknown) => (schema as { "@graph": Record<string, unknown>[] })["@graph"];
const nodeByType = (schema: unknown, type: string) => graph(schema).find((node) => node["@type"] === type);

describe("search and sharing surfaces", () => {
  it("keeps the exact Google site verification token", () => {
    expect(GOOGLE_SITE_VERIFICATION).toBe("E6-55-Sl0x-BwAAgBwYg8MTz4HBUVlc3ZlFkKmtFVBs");
  });

  it("uses location-aware homepage and property SEO copy", () => {
    const property = properties[0]!;
    expect(HOME_SEO_TITLE).toContain("Puncak, Bogor");
    expect(HOME_SEO_DESCRIPTION).toContain("Megamendung");
    expect(property.seo.title).toContain("Megamendung, Puncak Bogor");
    expect(property.seo.description).toContain("Jawa Barat");
  });

  it("publishes canonical discovery routes but excludes draft guides", async () => {
    const robotsFile = robots();
    expect(robotsFile.sitemap).toBe(`${SITE_URL}/sitemap.xml`);
    expect(robotsFile.host).toBe(SITE_URL);

    const entries = await sitemap();
    const urls = entries.map((entry) => entry.url);
    expect(urls).toEqual(expect.arrayContaining([
      SITE_URL,
      `${SITE_URL}/brand-assets`,
      `${SITE_URL}/stays/ruma-kamyna`,
    ]));
    for (const guide of areaGuides) expect(urls).not.toContain(`${SITE_URL}/guides/${guide.slug}`);
    expect(entries.every((entry) => entry.url.startsWith("https://"))).toBe(true);
  });

  it("ships complete PWA and social image metadata", () => {
    const webManifest = manifest();
    expect(webManifest.start_url).toBe("/");
    expect(webManifest.icons).toHaveLength(3);
    for (const src of Object.values(socialImages)) expect(existsSync(absolutePath(src))).toBe(true);
  });

  it("ships location-rich alt text and existing editorial image files", () => {
    for (const asset of Object.values(media) as readonly MediaAsset[]) {
      expect(asset.width).toBeGreaterThan(0);
      expect(asset.height).toBeGreaterThan(0);
      expect(asset.alt).toContain("Ruma Kamyna");
      expect(asset.alt).toContain("Megamendung");
      expect(asset.alt).toContain("Puncak Bogor");
      expect(existsSync(absolutePath(asset.src))).toBe(true);
      for (const variant of asset.variants ?? []) {
        expect(variant.width).toBeLessThan(asset.width);
        expect(existsSync(absolutePath(variant.src))).toBe(true);
      }
    }
  });

  it("connects the confirmed LodgingBusiness to the global organization", () => {
    const property = properties[0]!;
    const global = buildGlobalSchema();
    const home = buildHomeSchema(properties);
    const stay = buildPropertySchema(property, RUMA_KAMYNA_PUBLIC_FALLBACK);
    const lodging = nodeByType(stay, "LodgingBusiness")!;
    const address = lodging.address as Record<string, unknown>;

    const organization = nodeByType(global, "Organization")!;
    const officialGoogleMapsProfile =
      "https://www.google.com/maps/place/RUMA+KAMYNA/data=!4m2!3m1!1s0x0:0x970747a93434dce9";

    expect(organization).toBeTruthy();
    expect(organization.sameAs).toEqual([officialGoogleMapsProfile]);
    expect(nodeByType(global, "WebSite")).toBeTruthy();
    expect(nodeByType(home, "CollectionPage")).toBeTruthy();
    expect(lodging.name).toBe("Ruma Kamyna");
    expect(lodging.sameAs).toEqual([officialGoogleMapsProfile]);
    expect(lodging.parentOrganization).toEqual({ "@id": `${SITE_URL}/#organization` });
    expect(address).toEqual({
      "@type": "PostalAddress",
      addressLocality: "Megamendung",
      addressRegion: "Jawa Barat",
      postalCode: "16770",
      addressCountry: "ID",
    });
    expect(lodging).not.toHaveProperty("geo");
    expect(lodging).not.toHaveProperty("hasMap");
    expect(lodging).not.toHaveProperty("telephone");
    expect(lodging.numberOfRooms).toBe(3);
    expect((lodging.amenityFeature as Array<Record<string, unknown>>).map((item) => item.name)).toEqual([
      "Kolam renang", "Gym", "Jacuzzi", "Pemandangan gunung",
    ]);
    expect(JSON.stringify(stay)).not.toContain("Accommodation");
  });

  it("connects draft guides to the property without claiming local facts", () => {
    const property = properties[0]!;
    const schema = buildAreaGuideSchema(areaGuides[0]!, property);
    const page = nodeByType(schema, "WebPage")!;
    expect(page.about).toEqual({
      "@id": `${SITE_URL}/stays/ruma-kamyna/#lodging-business`,
    });
    expect(page.description).toContain("awaiting owner confirmation");
  });
});

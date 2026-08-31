import { describe, expect, it } from "vitest";
import { areaGuides, properties, siteContent } from "@/shared/content/config";
import { media } from "@/shared/media";

function flatten(value: unknown) { return JSON.stringify(value).toLowerCase(); }

describe("tenant-aware static content config", () => {
  it("ships unique property and guide records", () => {
    expect(new Set(properties.map((item) => item.slug)).size).toBe(properties.length);
    expect(new Set(areaGuides.map((item) => item.slug)).size).toBe(areaGuides.length);
    for (const guide of areaGuides) expect(properties.some((property) => property.slug === guide.relatedPropertySlug)).toBe(true);
  });
  it("keeps the site snapshot aligned with static property records", () => {
    expect(siteContent.home.hero.title.trim().length).toBeGreaterThan(3);
    expect(siteContent.home.hero.description.trim().length).toBeGreaterThan(10);
    expect(siteContent.properties.map((item) => item.slug)).toEqual(properties.map((item) => item.slug));
  });
  it("requires disclosed tenant media", () => {
    for (const asset of Object.values(media)) {
      expect(asset.caption.trim().length).toBeGreaterThan(3);
      expect(asset.alt.trim().length).toBeGreaterThan(5);
    }
  });
  it("returns no static config records for unknown slugs", () => {
    expect(properties.find((item) => item.slug === "unknown") ?? null).toBeNull();
    expect(areaGuides.find((item) => item.slug === "unknown") ?? null).toBeNull();
  });
  it("keeps guest-facing copy free from legacy AI-tell punctuation", () => {
    const serialized = JSON.stringify(siteContent);
    expect(flatten(siteContent)).not.toContain("home 01");
    expect(serialized).not.toContain("—");
  });
});

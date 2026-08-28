import { describe, expect, it } from "vitest";
import { areaGuides } from "@/shared/content/config/guides";
import { StaticContentRepository } from "@/shared/content/repositories/static-content-repository";
import { media } from "@/shared/media";

const repository = new StaticContentRepository();

function flatten(value: unknown): string {
  return JSON.stringify(value).toLowerCase();
}

describe("static content repository", () => {
  it("returns unique property and guide slugs", async () => {
    const properties = await repository.listProperties();
    const guides = await repository.listAreaGuides();
    const propertySlugs = properties.map((property) => property.slug);
    const guideSlugs = guides.map((guide) => guide.slug);
    expect(new Set(propertySlugs).size).toBe(propertySlugs.length);
    expect(new Set(guideSlugs).size).toBe(guideSlugs.length);
  });

  it("publishes only the confirmed Ruma Kamyna locality details", async () => {
    const property = await repository.getPropertyBySlug("ruma-kamyna");
    expect(property).toMatchObject({
      name: "Ruma Kamyna",
      location: {
        addressLocality: "Megamendung",
        destination: "Puncak",
        administrativeArea: "Kabupaten Bogor",
        addressRegion: "Jawa Barat",
        postalCode: "16770",
        addressCountry: "ID",
      },
    });
    expect(property?.location.displayAddress).toBe(
      "Kecamatan Megamendung, Kabupaten Bogor, Jawa Barat 16770, Indonesia",
    );
    expect(property?.location.streetAddress).toBeUndefined();
    expect(property?.location.geo).toBeUndefined();
    expect(property?.location.mapEmbedUrl).toBeUndefined();
    expect(property?.contact.whatsappHref).toBeUndefined();
  });

  it("uses Puncak and Bogor naturally in the homepage and property copy", async () => {
    const content = await repository.getSiteContent();
    const property = await repository.getPropertyBySlug("ruma-kamyna");
    expect(content.home.hero.description).toContain("Megamendung");
    expect(content.home.hero.primaryAction.label).toContain("Puncak, Bogor");
    expect(content.home.collection.description).toContain("Puncak Bogor");
    expect(property?.shortDescription).toContain("Megamendung");
    expect(property?.story[0]).toContain("Puncak");
  });

  it("keeps provisional property fields explicitly disclosed", async () => {
    const property = await repository.getPropertyBySlug("ruma-kamyna");
    expect(property?.visualNote).toBe("Visual concept. Final property details may evolve.");
    expect(media.livingCourtyard.caption).toBe("Visual concept. Final property details may evolve.");
    expect(media.poolCourtyard.caption).toBe("Visual concept. Final property details may evolve.");
  });

  it("keeps area guides noindex until local facts are verified", async () => {
    const guides = await repository.listAreaGuides();
    expect(guides).toHaveLength(3);
    expect(guides.every((guide) => guide.indexable === false)).toBe(true);
    expect(guides.every((guide) => guide.relatedPropertySlug === "ruma-kamyna")).toBe(true);
    expect(flatten(guides)).toContain("verified");
    expect(areaGuides.map((guide) => guide.slug)).toEqual([
      "getting-to-megamendung-from-jakarta",
      "things-to-do-near-puncak",
      "planning-a-slow-stay-in-megamendung",
    ]);
  });

  it("resolves known records and returns null for unknown slugs", async () => {
    await expect(repository.getPropertyBySlug("ruma-kamyna")).resolves.toMatchObject({ name: "Ruma Kamyna" });
    await expect(repository.getAreaGuideBySlug("things-to-do-near-puncak")).resolves.toMatchObject({
      title: "Things to do near Puncak",
    });
    await expect(repository.getPropertyBySlug("unknown")).resolves.toBeNull();
    await expect(repository.getAreaGuideBySlug("unknown")).resolves.toBeNull();
  });

  it("keeps guest-facing copy free from retired location and AI-tell punctuation", async () => {
    const content = await repository.getSiteContent();
    const deprecatedLabel = ["ba", "li"].join("");
    const serialized = JSON.stringify({ content, areaGuides });
    expect(serialized.toLowerCase()).not.toContain(deprecatedLabel);
    expect(serialized).not.toContain("—");
    expect(serialized).not.toContain("Home 01");
  });
});

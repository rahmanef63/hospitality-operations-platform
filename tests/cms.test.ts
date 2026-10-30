import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { defaultCmsDocument, validateCmsDocument } from "@/shared/cms";

const root = process.cwd();
const read = (file: string) => readFileSync(path.join(root, file), "utf8");

describe("published public CMS", () => {
  it("ships a valid atomic default snapshot covering public composition", () => {
    const document = validateCmsDocument(defaultCmsDocument());
    expect(document.schemaVersion).toBe(1);
    expect(document.site.publicUi.home.sections.order).toEqual([
      "hero", "introduction", "collection", "rituals", "philosophy", "contact",
    ]);
    const propertySlugs = new Set(document.site.properties.map((property) => property.slug));
    for (const slug of Object.keys(document.site.publicUi.properties)) expect(propertySlugs.has(slug)).toBe(true);
    expect(document.site.publicUi.brandAssets.assets.length).toBeGreaterThan(0);
    expect(typeof document.site.publicUi.shell.concierge.enabled).toBe("boolean");
  });

  it("rejects unsafe navigation hrefs and invalid public media", () => {
    const unsafe = defaultCmsDocument();
    unsafe.site.navigation[0]!.href = "javascript:alert(1)";
    expect(() => validateCmsDocument(unsafe)).toThrow(/href/i);

    const badMedia = defaultCmsDocument();
    badMedia.site.home.hero.image = { ...badMedia.site.home.hero.image, src: "https://example.com/remote.jpg" };
    expect(() => validateCmsDocument(badMedia)).toThrow(/media/i);
  });

  it("reads the published snapshot behind Next cache tags and invalidates only on publish", () => {
    const repository = read("shared/content/repository.ts");
    const core = read("app/admin/(dashboard)/cms/actions-core.ts");
    const draft = read("app/admin/(dashboard)/cms/action-utils.ts");
    expect(repository).toContain('cacheTag("cms:published"');
    expect(repository).toContain("getPublicCmsDocument");
    expect(core).toContain('["cms:published", "site-content", "properties", "area-guides"]');
    expect(core).toContain('updateTag(tag)');
    expect(draft).not.toContain('updateTag("cms:published")');
  });

  it("provides a primary CMS entry plus a secondary desktop sidebar and mobile dock", () => {
    const primary = read("slices/pms/components/pms-nav.tsx");
    const secondary = read("slices/cms/components/cms-nav.tsx");
    expect(primary).toContain('href: "/admin/cms"');
    expect(secondary).toContain("CmsDesktopNav");
    expect(secondary).toContain("CmsMobileDock");
    expect(secondary).toContain("Content system");
    expect(secondary).toContain('bottom-[calc(4.55rem+env(safe-area-inset-bottom))]');
  });

  it("keeps verified operational facts separate from editable editorial content", () => {
    expect(read("shared/convex/pms.ts")).toContain('cacheTag("public-property-facts"');
    expect(read("app/admin/(dashboard)/actions.ts")).toContain('updateTag("public-property-facts")');
    expect(read("app/admin/(dashboard)/cms/actions-property.ts")).not.toContain("bedroomCount");
    expect(read("app/admin/(dashboard)/cms/actions-property.ts")).not.toContain("baseNightlyRate");
  });
});

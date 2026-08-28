import { describe, expect, it } from "vitest";
import { StaticContentRepository } from "@/shared/content/repositories/static-content-repository";

const repository = new StaticContentRepository();

function flatten(value: unknown): string {
  return JSON.stringify(value).toLowerCase();
}

describe("static content repository", () => {
  it("returns unique property slugs", async () => {
    const properties = await repository.listProperties();
    const slugs = properties.map((property) => property.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("keeps core content free from a deprecated location label", async () => {
    const content = await repository.getSiteContent();
    const deprecatedLabel = ["ba", "li"].join("");
    expect(flatten(content)).not.toContain(deprecatedLabel);
  });

  it("resolves known properties and returns null for unknown slugs", async () => {
    await expect(repository.getPropertyBySlug("ruma-kamyna")).resolves.toMatchObject({ name: "Ruma Kamyna" });
    await expect(repository.getPropertyBySlug("unknown")).resolves.toBeNull();
  });
});

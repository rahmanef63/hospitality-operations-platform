import { convexTest } from "convex-test";
import { describe, expect, it } from "vitest";
import { api, internal } from "@/convex/_generated/api";
import schema from "@/convex/schema";

const modules = import.meta.glob("../convex/**/*.*s");

async function seededPms() {
  const t = convexTest(schema, modules);
  await t.mutation(internal.pms.seed.rumaKamyna, { actorEmailHash: "test-actor-hash-0001" });
  return t;
}

describe("public PMS projection", () => {
  it("returns only the owner-confirmed published Ruma Kamyna facts", async () => {
    const t = await seededPms();
    const property = await t.query(api.pms.public.getProperty, { slug: "ruma-kamyna" });
    expect(property).toMatchObject({
      name: "Ruma Kamyna",
      bedroomCount: 3,
      amenities: expect.arrayContaining([
        expect.objectContaining({ key: "swimming-pool" }),
        expect.objectContaining({ key: "gym" }),
        expect.objectContaining({ key: "jacuzzi" }),
        expect.objectContaining({ key: "mountain-view" }),
      ]),
    });
    expect(property?.amenities).toHaveLength(4);
    expect(property).not.toHaveProperty("internalNotes");
    expect(property).not.toHaveProperty("baseNightlyRate");
    expect(property).not.toHaveProperty("currency");
  });

  it("hides archived properties from the public query", async () => {
    const t = await seededPms();
    const catalog = await t.query(internal.pms.catalog.list, {});
    const property = catalog.properties.find((item) => item.slug === "ruma-kamyna");
    expect(property).toBeTruthy();
    await t.mutation(internal.pms.catalog.archiveProperty, {
      id: property!.id,
      actorEmailHash: "test-actor-hash-0001",
    });
    await expect(t.query(api.pms.public.getProperty, { slug: "ruma-kamyna" })).resolves.toBeNull();
  });

  it("wires the property route to the request-time published facts with a verified fallback", async () => {
    const { readFileSync } = await import("node:fs");
    const page = readFileSync("app/(marketing)/stays/[slug]/page.tsx", "utf8");
    const facts = readFileSync("slices/property/components/property-facts.tsx", "utf8");
    expect(page).not.toContain("await connection()");
    expect(readFileSync("shared/convex/pms.ts", "utf8")).toContain('cacheTag("public-property-facts"');
    expect(page).toContain("getPublicPropertyFacts");
    expect(page).toContain("getPublicPropertyFacts(slug)");
    expect(facts).toContain("facts.amenities.map");
    expect(facts).toContain("facts.bedroomCount");
  });
});

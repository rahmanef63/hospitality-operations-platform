import { convexTest } from "convex-test";
import { describe, expect, it } from "vitest";
import { api, internal } from "@/convex/_generated/api";
import schema from "@/convex/schema";
import { createTestProperty, TEST_ACTOR_HASH } from "./fixtures/pms";
const modules=import.meta.glob("../convex/**/*.*s");
async function seededPms(){const t=convexTest(schema,modules);await createTestProperty(t);return t;}
describe("public PMS projection",()=>{
 it("returns only active published public facts",async()=>{const t=await seededPms();const property=await t.query(api.pms.public.getProperty,{slug:"test-property"});expect(property).toMatchObject({name:"Test Property",bedroomCount:3,amenities:expect.arrayContaining([expect.objectContaining({key:"pool"}),expect.objectContaining({key:"gym"})])});expect(property?.amenities).toHaveLength(4);expect(property).not.toHaveProperty("internalNotes");expect(property).not.toHaveProperty("baseNightlyRate");expect(property).not.toHaveProperty("currency");});
 it("hides archived properties",async()=>{const t=await seededPms();const catalog=await t.query(internal.pms.catalog.list,{});const property=catalog.properties.find(item=>item.slug==="test-property")!;await t.mutation(internal.pms.catalog.archiveProperty,{id:property.id,actorEmailHash:TEST_ACTOR_HASH});await expect(t.query(api.pms.public.getProperty,{slug:"test-property"})).resolves.toBeNull();});
 it("wires public facts through a tagged server cache",async()=>{const {readFileSync}=await import("node:fs");const page=readFileSync("app/(marketing)/stays/[slug]/page.tsx","utf8");const facts=readFileSync("slices/property/components/property-facts.tsx","utf8");expect(readFileSync("shared/convex/pms.ts","utf8")).toContain('cacheTag("public-property-facts"');expect(page).toContain("getPublicPropertyFacts");expect(facts).toContain("facts.amenities.map");expect(facts).toContain("facts.bedroomCount");});
});

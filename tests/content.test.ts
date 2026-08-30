import { describe, expect, it } from "vitest";
import { StaticContentRepository } from "@/shared/content/repositories/static-content-repository";
import { media } from "@/shared/media";
const repository=new StaticContentRepository();
function flatten(value:unknown){return JSON.stringify(value).toLowerCase();}
describe("generic static content repository",()=>{
 it("ships unique records even when upstream starts without provider properties",async()=>{const properties=await repository.listProperties();const guides=await repository.listAreaGuides();expect(new Set(properties.map(x=>x.slug)).size).toBe(properties.length);expect(new Set(guides.map(x=>x.slug)).size).toBe(guides.length);expect(properties).toEqual([]);expect(guides).toEqual([]);});
 it("keeps upstream homepage provider-neutral",async()=>{const content=await repository.getSiteContent();expect(content.home.hero.title).toContain("one place");expect(content.home.hero.description.toLowerCase()).toContain("platform");expect(content.properties).toEqual([]);});
 it("keeps example media explicitly disclosed",()=>{expect(media.livingCourtyard.caption.toLowerCase()).toContain("example");expect(media.poolCourtyard.caption.toLowerCase()).toContain("example");});
 it("returns null for unknown provider records",async()=>{await expect(repository.getPropertyBySlug("unknown")).resolves.toBeNull();await expect(repository.getAreaGuideBySlug("unknown")).resolves.toBeNull();});
 it("keeps generic guest-facing copy free from AI-tell punctuation",async()=>{const content=await repository.getSiteContent();const serialized=JSON.stringify(content);expect(flatten(content)).not.toContain("home 01");expect(serialized).not.toContain("—");});
});

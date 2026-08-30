import { describe, expect, it } from "vitest";
import { StaticContentRepository } from "@/shared/content/repositories/static-content-repository";
import { media } from "@/shared/media";
const repository=new StaticContentRepository();
function flatten(value:unknown){return JSON.stringify(value).toLowerCase();}
describe("tenant-aware static content repository",()=>{
 it("ships unique property and guide records",async()=>{const properties=await repository.listProperties();const guides=await repository.listAreaGuides();expect(new Set(properties.map(x=>x.slug)).size).toBe(properties.length);expect(new Set(guides.map(x=>x.slug)).size).toBe(guides.length);for(const guide of guides)expect(properties.some(property=>property.slug===guide.relatedPropertySlug)).toBe(true);});
 it("keeps the site snapshot aligned with repository records",async()=>{const content=await repository.getSiteContent();const properties=await repository.listProperties();expect(content.home.hero.title.trim().length).toBeGreaterThan(3);expect(content.home.hero.description.trim().length).toBeGreaterThan(10);expect(content.properties.map(x=>x.slug)).toEqual(properties.map(x=>x.slug));});
 it("requires disclosed tenant media",()=>{for(const asset of Object.values(media)){expect(asset.caption.trim().length).toBeGreaterThan(3);expect(asset.alt.trim().length).toBeGreaterThan(5);}});
 it("returns null for unknown provider records",async()=>{await expect(repository.getPropertyBySlug("unknown")).resolves.toBeNull();await expect(repository.getAreaGuideBySlug("unknown")).resolves.toBeNull();});
 it("keeps guest-facing copy free from legacy AI-tell punctuation",async()=>{const content=await repository.getSiteContent();const serialized=JSON.stringify(content);expect(flatten(content)).not.toContain("home 01");expect(serialized).not.toContain("—");});
});

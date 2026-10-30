import { cacheLife, cacheTag } from "next/cache";
import { defaultCmsDocument } from "@/shared/cms";
import { getPublicCmsDocument } from "@/shared/convex/cms";
import type { AreaGuideContent, PropertyContent, SiteContent } from "./types";

async function publishedDocument() {
  try { return await getPublicCmsDocument() ?? defaultCmsDocument(); } catch { return defaultCmsDocument(); }
}

export async function getSiteContent(): Promise<SiteContent> {
  "use cache"; cacheLife("days"); cacheTag("cms:published", "site-content");
  return (await publishedDocument()).site;
}
export async function listProperties(): Promise<PropertyContent[]> {
  "use cache"; cacheLife("days"); cacheTag("cms:published", "properties");
  return (await publishedDocument()).site.properties;
}
export async function getPropertyBySlug(slug: string): Promise<PropertyContent | null> {
  "use cache"; cacheLife("days"); cacheTag("cms:published", "properties", `property:${slug}`);
  return (await publishedDocument()).site.properties.find((property) => property.slug === slug) ?? null;
}
export async function listAreaGuides(): Promise<AreaGuideContent[]> {
  "use cache"; cacheLife("days"); cacheTag("cms:published", "area-guides");
  return (await publishedDocument()).guides;
}
export async function getAreaGuideBySlug(slug: string): Promise<AreaGuideContent | null> {
  "use cache"; cacheLife("days"); cacheTag("cms:published", "area-guides", `area-guide:${slug}`);
  return (await publishedDocument()).guides.find((guide) => guide.slug === slug) ?? null;
}

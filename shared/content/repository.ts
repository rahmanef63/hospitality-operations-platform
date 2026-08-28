import { cacheLife, cacheTag } from "next/cache";
import { StaticContentRepository } from "./repositories/static-content-repository";
import type { PropertyContent, SiteContent } from "./types";

const repository = new StaticContentRepository();

export async function getSiteContent(): Promise<SiteContent> {
  "use cache";
  cacheLife("days");
  cacheTag("site-content");
  return repository.getSiteContent();
}

export async function listProperties(): Promise<PropertyContent[]> {
  "use cache";
  cacheLife("days");
  cacheTag("properties");
  return repository.listProperties();
}

export async function getPropertyBySlug(slug: string): Promise<PropertyContent | null> {
  "use cache";
  cacheLife("days");
  cacheTag("properties", `property:${slug}`);
  return repository.getPropertyBySlug(slug);
}

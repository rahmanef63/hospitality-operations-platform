import { areaGuides, properties, siteContent } from "../config";
import type { AreaGuideContent, ContentRepository, PropertyContent, SiteContent } from "../types";


export class StaticContentRepository implements ContentRepository {
  async getSiteContent(): Promise<SiteContent> {
    return siteContent;
  }

  async listProperties(): Promise<PropertyContent[]> {
    return properties;
  }

  async getPropertyBySlug(slug: string): Promise<PropertyContent | null> {
    return properties.find((property) => property.slug === slug) ?? null;
  }

  async listAreaGuides(): Promise<AreaGuideContent[]> {
    return areaGuides;
  }

  async getAreaGuideBySlug(slug: string): Promise<AreaGuideContent | null> {
    return areaGuides.find((guide) => guide.slug === slug) ?? null;
  }
}

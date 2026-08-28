import { areaGuides, footerLinks, homeContent, navigation, properties } from "../config";
import type { AreaGuideContent, ContentRepository, PropertyContent, SiteContent } from "../types";

const siteContent: SiteContent = {
  navigation,
  home: homeContent,
  properties,
  footer: {
    statement: "A growing collection of homes for slower living.",
    links: footerLinks,
    legal: "Kamyna Living. All rights reserved.",
  },
};

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

import { footerLinks, homeContent, navigation, properties } from "../config";
import type { ContentRepository, PropertyContent, SiteContent } from "../types";

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
}

export type NavigationItem = {
  label: string;
  href: string;
};

export type ActionLink = NavigationItem & {
  external?: boolean;
};

export type EditorialItem = {
  number: string;
  title: string;
  description: string;
};

export type PropertyPillar = {
  title: string;
  description: string;
};

export type DayRhythm = {
  moment: string;
  title: string;
  description: string;
};

export type PropertyContent = {
  slug: string;
  name: string;
  collectionLabel: string;
  tagline: string;
  status: string;
  shortDescription: string;
  heroStatement: string;
  story: string[];
  pillars: PropertyPillar[];
  rhythm: DayRhythm[];
  primaryAction: ActionLink;
};

export type HomeContent = {
  hero: {
    eyebrow: string;
    title: string;
    description: string;
    primaryAction: ActionLink;
    secondaryAction: ActionLink;
    note: string;
  };
  introduction: {
    eyebrow: string;
    title: string;
    paragraphs: string[];
  };
  collection: {
    eyebrow: string;
    title: string;
    description: string;
  };
  rituals: {
    eyebrow: string;
    title: string;
    items: EditorialItem[];
  };
  philosophy: {
    eyebrow: string;
    title: string;
    paragraphs: string[];
    quote: string;
  };
  contact: {
    eyebrow: string;
    title: string;
    description: string;
    action: ActionLink;
  };
};

export type SiteContent = {
  navigation: NavigationItem[];
  home: HomeContent;
  properties: PropertyContent[];
  footer: {
    statement: string;
    links: NavigationItem[];
    legal: string;
  };
};

export interface ContentRepository {
  getSiteContent(): Promise<SiteContent>;
  listProperties(): Promise<PropertyContent[]>;
  getPropertyBySlug(slug: string): Promise<PropertyContent | null>;
}

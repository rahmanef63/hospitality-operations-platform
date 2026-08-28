import type { MediaAsset } from "@/shared/media";

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
  image: MediaAsset;
};

export type PropertyPillar = {
  title: string;
  description: string;
  image: MediaAsset;
};

export type DayRhythm = {
  moment: string;
  title: string;
  description: string;
};

export type GalleryItem = {
  label: string;
  image: MediaAsset;
};

export type PropertyContent = {
  slug: string;
  name: string;
  collectionLabel: string;
  tagline: string;
  status: string;
  shortDescription: string;
  heroStatement: string;
  visualNote: string;
  heroImage: MediaAsset;
  socialImage: string;
  story: string[];
  storyImages: MediaAsset[];
  gallery: GalleryItem[];
  pillars: PropertyPillar[];
  rhythm: DayRhythm[];
  enquiryImage: MediaAsset;
  primaryAction: ActionLink;
};

export type HomeContent = {
  hero: {
    eyebrow: string;
    title: string;
    description: string;
    primaryAction: ActionLink;
    secondaryAction: ActionLink;
    image: MediaAsset;
  };
  introduction: {
    title: string;
    paragraphs: string[];
    image: MediaAsset;
  };
  collection: {
    title: string;
    description: string;
    images: MediaAsset[];
  };
  rituals: {
    title: string;
    items: EditorialItem[];
  };
  philosophy: {
    eyebrow: string;
    title: string;
    paragraphs: string[];
    quote: string;
    image: MediaAsset;
  };
  contact: {
    title: string;
    description: string;
    action: ActionLink;
    image: MediaAsset;
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

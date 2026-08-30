import type { MediaAsset } from "@/shared/media";

export type NavigationItem = {
  label: string;
  href: string;
};

export type ActionLink = NavigationItem & {
  external?: boolean;
};

export type EditorialItem = {
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

export type PropertyGeo = {
  latitude: number;
  longitude: number;
};

export type PropertyLocation = {
  addressLocality: string;
  destination: string;
  administrativeArea: string;
  addressRegion: string;
  postalCode: string;
  addressCountry: string;
  countryName: string;
  displayAddress: string;
  streetAddress?: string;
  mapEmbedUrl?: string;
  geo?: PropertyGeo;
};

export type PropertyContact = {
  email: string;
  whatsappNumber?: string;
  whatsappHref?: string;
};

export type PropertySeo = {
  title: string;
  description: string;
  keywords: string[];
};

export type PropertyContent = {
  slug: string;
  name: string;
  collectionLabel: string;
  tagline: string;
  status: string;
  timezone: string;
  shortDescription: string;
  heroStatement: string;
  visualNote: string;
  seo: PropertySeo;
  location: PropertyLocation;
  contact: PropertyContact;
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

export type AreaGuideSection = {
  title: string;
  paragraphs: string[];
};

export type AreaGuideContent = {
  slug: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  eyebrow: string;
  summary: string;
  introduction: string;
  statusLabel: string;
  sections: AreaGuideSection[];
  relatedPropertySlug: string;
  indexable: boolean;
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
    locationLabel: string;
    mapTitle: string;
    mapPendingText: string;
    whatsappLabel: string;
    whatsappPendingText: string;
  };
};

export type HomeSectionId = "hero" | "introduction" | "collection" | "rituals" | "philosophy" | "contact";
export type PropertySectionId = "hero" | "story" | "facts" | "gallery" | "pillars" | "rhythm" | "guides" | "enquiry";

export type SectionComposition<T extends string> = { order: T[]; hidden: T[] };

export type ConciergeUi = {
  enabled: boolean;
  desktopButtonLabel: string;
  mobileButtonLabel: string;
  eyebrow: string;
  title: string;
  openingMessage: string;
  suggestions: string[];
  unavailableMessage: string;
  inputPlaceholder: string;
  privacyNote: string;
};

export type HomePageUi = {
  seoTitle: string;
  seoDescription: string;
  sections: SectionComposition<HomeSectionId>;
  collectionLinkLabel: string;
};

export type PropertyPageUi = {
  sections: SectionComposition<PropertySectionId>;
  backLabel: string;
  storyTitle: string;
  factsEyebrow: string;
  factsTitle: string;
  bookableUnitsLabel: string;
  galleryTitle: string;
  galleryDescription: string;
  pillarsTitle: string;
  rhythmEyebrow: string;
  rhythmTitle: string;
  guidesEyebrow: string;
  guidesTitle: string;
  guidesDescription: string;
  guideReadLabel: string;
  enquiryTitle: string;
  enquiryDescription: string;
  whatsappLabel: string;
};

export type GuidePageUi = {
  backLabel: string;
  notesEyebrow: string;
  notesTitle: string;
  propertyCtaLabel: string;
};

export type BrandAssetCopy = { href: string; name: string; description: string; visible: boolean };
export type BrandAssetsUi = {
  seoTitle: string;
  seoDescription: string;
  visible: boolean;
  backLabel: string;
  heroEyebrow: string;
  heroTitle: string;
  heroDescription: string;
  heroMediaKey: string;
  identityEyebrow: string;
  identityTitle: string;
  assetEyebrow: string;
  downloadLabel: string;
  paletteVisible: boolean;
  paletteEyebrow: string;
  paletteTitle: string;
  usageVisible: boolean;
  usageEyebrow: string;
  usageTitle: string;
  usageRules: string[];
  assets: BrandAssetCopy[];
};

export type PublicUiConfig = {
  shell: { showHeader: boolean; showFooter: boolean; concierge: ConciergeUi };
  home: HomePageUi;
  properties: Record<string, PropertyPageUi>;
  guide: GuidePageUi;
  brandAssets: BrandAssetsUi;
};

export type SiteContent = {
  navigation: NavigationItem[];
  home: HomeContent;
  properties: PropertyContent[];
  publicUi: PublicUiConfig;
  footer: {
    statement: string;
    links: NavigationItem[];
    legal: string;
    tagline: string;
  };
};

export interface ContentRepository {
  getSiteContent(): Promise<SiteContent>;
  listProperties(): Promise<PropertyContent[]>;
  getPropertyBySlug(slug: string): Promise<PropertyContent | null>;
  listAreaGuides(): Promise<AreaGuideContent[]>;
  getAreaGuideBySlug(slug: string): Promise<AreaGuideContent | null>;
}

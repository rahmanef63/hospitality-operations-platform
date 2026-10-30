import type { HomeContent, HomePageUi, PropertyContent } from "@/shared/content";

export type HomePageProps = {
  content: HomeContent;
  properties: PropertyContent[];
  ui: HomePageUi;
};

export type HeroSectionProps = {
  content: HomeContent["hero"];
};

export type CollectionSectionProps = {
  content: HomeContent["collection"];
  properties: PropertyContent[];
  linkLabel: string;
};

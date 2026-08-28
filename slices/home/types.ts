import type { HomeContent, PropertyContent } from "@/shared/content";

export type HomePageProps = {
  content: HomeContent;
  properties: PropertyContent[];
};

export type HeroSectionProps = {
  content: HomeContent["hero"];
};

export type CollectionSectionProps = {
  content: HomeContent["collection"];
  properties: PropertyContent[];
};

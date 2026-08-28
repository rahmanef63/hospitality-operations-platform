import type { PropertyPageProps } from "../types";
import { PropertyEnquiry } from "./property-enquiry";
import { PropertyFacts } from "./property-facts";
import { PropertyGallery } from "./property-gallery";
import { PropertyGuides } from "./property-guides";
import { PropertyHero } from "./property-hero";
import { PropertyPillars } from "./property-pillars";
import { PropertyRhythm } from "./property-rhythm";
import { PropertyStory } from "./property-story";

export function PropertyPage({ property, guides, facts }: PropertyPageProps) {
  return (
    <main id="main-content">
      <PropertyHero property={property} />
      <PropertyStory property={property} />
      <PropertyFacts facts={facts} />
      <PropertyGallery property={property} />
      <PropertyPillars property={property} />
      <PropertyRhythm property={property} />
      <PropertyGuides guides={guides} />
      <PropertyEnquiry property={property} />
    </main>
  );
}

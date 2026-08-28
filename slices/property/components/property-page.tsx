import type { PropertyPageProps } from "../types";
import { PropertyEnquiry } from "./property-enquiry";
import { PropertyGallery } from "./property-gallery";
import { PropertyHero } from "./property-hero";
import { PropertyPillars } from "./property-pillars";
import { PropertyRhythm } from "./property-rhythm";
import { PropertyStory } from "./property-story";

export function PropertyPage({ property }: PropertyPageProps) {
  return (
    <main id="main-content">
      <PropertyHero property={property} />
      <PropertyStory property={property} />
      <PropertyGallery property={property} />
      <PropertyPillars property={property} />
      <PropertyRhythm property={property} />
      <PropertyEnquiry property={property} />
    </main>
  );
}

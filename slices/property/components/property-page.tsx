import type { PropertyPageProps } from "../types";
import { PropertyEnquiry } from "./property-enquiry";
import { PropertyFacts } from "./property-facts";
import { PropertyGallery } from "./property-gallery";
import { PropertyGuides } from "./property-guides";
import { PropertyHero } from "./property-hero";
import { PropertyPillars } from "./property-pillars";
import { PropertyRhythm } from "./property-rhythm";
import { PropertyStory } from "./property-story";

export function PropertyPage({ property, guides, facts, ui }: PropertyPageProps) {
  const sections = {
    hero: <PropertyHero property={property} ui={ui} />,
    story: <PropertyStory property={property} ui={ui} />,
    facts: <PropertyFacts facts={facts} ui={ui} />,
    gallery: <PropertyGallery property={property} ui={ui} />,
    pillars: <PropertyPillars property={property} ui={ui} />,
    rhythm: <PropertyRhythm property={property} ui={ui} />,
    guides: <PropertyGuides guides={guides} ui={ui} />,
    enquiry: <PropertyEnquiry property={property} ui={ui} />,
  };
  return <main id="main-content">{ui.sections.order.filter((id) => !ui.sections.hidden.includes(id)).map((id) => <div key={id}>{sections[id]}</div>)}</main>;
}

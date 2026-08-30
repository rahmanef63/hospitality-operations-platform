import type { HomePageProps } from "../types";
import { CollectionSection } from "./collection-section";
import { ContactSection } from "./contact-section";
import { HeroSection } from "./hero-section";
import { IntroductionSection } from "./introduction-section";
import { PhilosophySection } from "./philosophy-section";
import { RitualsSection } from "./rituals-section";

export function HomePage({ content, properties, ui }: HomePageProps) {
  const primaryProperty = properties[0];
  const sections = {
    hero: <HeroSection content={content.hero} />,
    introduction: <IntroductionSection content={content.introduction} />,
    collection: <CollectionSection content={content.collection} properties={properties} linkLabel={ui.collectionLinkLabel} />,
    rituals: <RitualsSection content={content.rituals} />,
    philosophy: <PhilosophySection content={content.philosophy} />,
    contact: <ContactSection content={content.contact} property={primaryProperty} />,
  };
  return <main id="main-content">{ui.sections.order.filter((id) => !ui.sections.hidden.includes(id)).map((id) => <div key={id}>{sections[id]}</div>)}</main>;
}

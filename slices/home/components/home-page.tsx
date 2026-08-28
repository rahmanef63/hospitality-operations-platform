import type { HomePageProps } from "../types";
import { CollectionSection } from "./collection-section";
import { ContactSection } from "./contact-section";
import { HeroSection } from "./hero-section";
import { IntroductionSection } from "./introduction-section";
import { PhilosophySection } from "./philosophy-section";
import { RitualsSection } from "./rituals-section";

export function HomePage({ content, properties }: HomePageProps) {
  const primaryProperty = properties[0];
  return (
    <main id="main-content">
      <HeroSection content={content.hero} />
      <IntroductionSection content={content.introduction} />
      <CollectionSection content={content.collection} properties={properties} />
      <RitualsSection content={content.rituals} />
      <PhilosophySection content={content.philosophy} />
      <ContactSection content={content.contact} property={primaryProperty} />
    </main>
  );
}

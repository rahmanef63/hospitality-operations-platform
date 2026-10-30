import type { AreaGuideContent, PropertyContent, PropertyPageUi } from "@/shared/content";
import type { PublicPropertyFacts } from "@/shared/pms";

export type PropertyPageProps = {
  property: PropertyContent;
  guides: AreaGuideContent[];
  facts: PublicPropertyFacts;
  ui: PropertyPageUi;
};

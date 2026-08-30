import type { AreaGuideContent, GuidePageUi, PropertyContent } from "@/shared/content";

export type GuidePageProps = {
  guide: AreaGuideContent;
  property: PropertyContent;
  ui: GuidePageUi;
};

import { defaultPresentationSlides } from "@/shared/announcements";
import { media } from "@/shared/media";
import type { WelcomePageProps, WelcomePresentationSlide } from "../types";
import { WelcomePresentation } from "./welcome-presentation";

const mediaByKey = {
  livingCourtyard: media.livingCourtyard,
  bedroomRetreat: media.bedroomRetreat,
  poolCourtyard: media.poolCourtyard,
  welcomeDetails: media.welcomeDetails,
  livingDining: media.livingDining,
  spaBath: media.spaBath,
  diningTable: media.diningTable,
  materialPalette: media.materialPalette,
} as const;

function buildSlides(props: WelcomePageProps): WelcomePresentationSlide[] {
  const configured = props.announcements.settings.presentationSlides
    .filter((slide) => slide.enabled)
    .sort((left, right) => left.sortOrder - right.sortOrder || left.key.localeCompare(right.key));
  const source = configured.length ? configured : defaultPresentationSlides().slice(0, 1);
  return source.map((slide) => ({
    id: slide.key,
    durationSeconds: slide.durationSeconds,
    ...mediaByKey[slide.mediaKey],
  }));
}

export function PresentationPage(props: WelcomePageProps & { tvMode?: boolean }) {
  return <WelcomePresentation {...props} tvMode={props.tvMode ?? true} slides={buildSlides(props)} />;
}

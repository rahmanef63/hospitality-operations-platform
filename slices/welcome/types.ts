import type { MediaVariant } from "@/shared/media";
import type {
  RenderedWelcome,
  ReservationWelcomeContext,
  WelcomeLocale,
  WelcomeLocaleMeta,
} from "@/shared/welcome";

export type WelcomePresentationSlide = {
  id: string;
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
  variants?: readonly MediaVariant[];
};

export type WelcomePageProps = {
  locale: WelcomeLocale;
  content: RenderedWelcome;
  propertyName: string;
  propertySlug: string;
  context?: ReservationWelcomeContext;
  token?: string;
  contactHref: string;
  contactLabel: string;
};

export type WelcomePresentationProps = WelcomePageProps & {
  tvMode: boolean;
  slides: readonly WelcomePresentationSlide[];
};

export type WelcomeSlideProps = WelcomePresentationProps & {
  slide: WelcomePresentationSlide;
  index: number;
  active: boolean;
  localeMeta: WelcomeLocaleMeta;
};

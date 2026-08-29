import type { RenderedWelcome, ReservationWelcomeContext, WelcomeLocale } from "@/shared/welcome";

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

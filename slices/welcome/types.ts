import type { RenderedWelcome, WelcomeLocale } from "@/shared/welcome";

export type WelcomePageProps = {
  locale: WelcomeLocale;
  content: RenderedWelcome;
  contactHref: string;
  contactLabel: string;
};

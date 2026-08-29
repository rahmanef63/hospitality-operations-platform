import { media } from "@/shared/media";
import type { WelcomePageProps, WelcomePresentationSlide } from "../types";
import { WelcomePresentation } from "./welcome-presentation";

const slides: readonly WelcomePresentationSlide[] = [
  { id: "arrival", ...media.livingCourtyard },
  { id: "stay", ...media.bedroomRetreat },
  { id: "stillness", ...media.poolCourtyard },
  { id: "contact", ...media.welcomeDetails },
];

export function WelcomePage(props: Omit<WelcomePageProps, "slides">) {
  return <WelcomePresentation {...props} slides={slides} />;
}

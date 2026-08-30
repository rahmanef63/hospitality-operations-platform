import { homeContent } from "./home";
import { footerLinks, navigation } from "./navigation";
import { properties } from "./properties";
import { publicUi } from "./ui";
import type { SiteContent } from "../types";

export const siteContent: SiteContent = {
  navigation,
  home: homeContent,
  properties,
  publicUi,
  footer: {
    statement: "A growing collection of homes for slower living.",
    links: footerLinks,
    legal: "Kamyna Living. All rights reserved.",
    tagline: "return to stillness",
  },
};

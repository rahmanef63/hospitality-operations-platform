import type { MetadataRoute } from "next";
import { SITE_DESCRIPTION, SITE_NAME } from "@/shared/config/site";
import { PWA_ICONS, PWA_SCREENSHOTS } from "@/shared/pwa/manifest-assets";

type ExtendedManifest = MetadataRoute.Manifest & {
  id: string;
  display_override: Array<"fullscreen" | "standalone" | "minimal-ui">;
  handle_links: "preferred";
  launch_handler: { client_mode: Array<"navigate-existing" | "auto"> };
  screenshots: Array<{
    src: string;
    sizes: string;
    type: string;
    form_factor?: "wide" | "narrow";
    label?: string;
  }>;
};

export default function manifest(): ExtendedManifest {
  return {
    id: "/",
    name: `${SITE_NAME} | Homes for slower living`,
    short_name: "Kamyna",
    description: SITE_DESCRIPTION,
    lang: "en",
    dir: "ltr",
    start_url: "/",
    scope: "/",
    display: "standalone",
    display_override: ["fullscreen", "standalone", "minimal-ui"],
    orientation: "any",
    background_color: "#2D2B27",
    theme_color: "#2D2B27",
    categories: ["travel", "lifestyle", "hospitality"],
    handle_links: "preferred",
    launch_handler: { client_mode: ["navigate-existing", "auto"] },
    prefer_related_applications: false,
    icons: [...PWA_ICONS],
    screenshots: [...PWA_SCREENSHOTS],
    shortcuts: [
      {
        name: "Guest welcome · TV mode",
        short_name: "TV Welcome",
        description: "Open the fullscreen guest welcome slideshow.",
        url: "/welcome?tv=1",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }],
      },
      {
        name: "Ruma Kamyna",
        short_name: "Ruma Kamyna",
        description: "Open the Ruma Kamyna property page.",
        url: "/stays/ruma-kamyna",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }],
      },
    ],
  };
}

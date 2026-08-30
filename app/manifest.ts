import type { MetadataRoute } from "next";
import { SITE_DESCRIPTION, SITE_NAME, SITE_SLOGAN } from "@/shared/config/site";
import { PWA_ICONS, PWA_SCREENSHOTS } from "@/shared/pwa/manifest-assets";

type ExtendedManifest = MetadataRoute.Manifest & {
  id: string;
  display_override: Array<"standalone" | "minimal-ui">;
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
    name: `${SITE_NAME} | ${SITE_SLOGAN}`,
    short_name: "Hospitality",
    description: SITE_DESCRIPTION,
    lang: "en",
    dir: "ltr",
    start_url: "/",
    scope: "/",
    display: "standalone",
    display_override: ["standalone", "minimal-ui"],
    orientation: "portrait-primary",
    background_color: "#F3EFE8",
    theme_color: "#2D2B27",
    categories: ["travel", "lifestyle", "hospitality"],
    handle_links: "preferred",
    launch_handler: { client_mode: ["navigate-existing", "auto"] },
    prefer_related_applications: false,
    icons: [...PWA_ICONS],
    screenshots: [...PWA_SCREENSHOTS],
    shortcuts: [
      {
        name: "Guest presentation · TV mode",
        short_name: "Presentation",
        description: "Open the fullscreen guest presentation.",
        url: "/presentation?tv=1",
        icons: [PWA_ICONS[0]],
      },

    ],
  };
}

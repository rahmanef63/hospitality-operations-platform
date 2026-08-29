import { SITE_DESCRIPTION } from "@/shared/config/site";
import { PWA_ICONS, PWA_PRESENTATION_SCREENSHOT } from "@/shared/pwa/manifest-assets";

const manifest = {
  id: "/presentation",
  name: "Kamyna Guest Presentation · TV",
  short_name: "Kamyna TV",
  description: `${SITE_DESCRIPTION} Fullscreen guest presentation for shared displays.`,
  lang: "en",
  dir: "ltr",
  start_url: "/presentation?tv=1",
  scope: "/",
  display: "fullscreen",
  display_override: ["fullscreen", "standalone", "minimal-ui"],
  orientation: "landscape",
  background_color: "#2D2B27",
  theme_color: "#2D2B27",
  categories: ["hospitality", "travel", "lifestyle"],
  handle_links: "preferred",
  launch_handler: { client_mode: ["navigate-existing", "auto"] },
  prefer_related_applications: false,
  icons: [...PWA_ICONS],
  screenshots: [PWA_PRESENTATION_SCREENSHOT],
  shortcuts: [
    {
      name: "Kamyna Living home",
      short_name: "Home",
      url: "/",
      icons: [PWA_ICONS[0]],
    },
    {
      name: "Ruma Kamyna",
      short_name: "Ruma Kamyna",
      url: "/stays/ruma-kamyna",
      icons: [PWA_ICONS[0]],
    },
  ],
};

export function GET() {
  return Response.json(manifest, {
    headers: {
      "Cache-Control": "no-cache, max-age=0, must-revalidate",
      "Content-Type": "application/manifest+json; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

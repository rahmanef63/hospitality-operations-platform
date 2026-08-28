import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Kamyna Living",
    short_name: "Kamyna",
    description: "Homes for slower living.",
    start_url: "/",
    display: "standalone",
    background_color: "#F5F2EC",
    theme_color: "#A58F7D",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/icon-512-maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}

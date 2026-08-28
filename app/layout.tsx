import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import {
  GOOGLE_SITE_VERIFICATION,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_SLOGAN,
  SITE_URL,
} from "@/shared/config/site";
import { socialImages } from "@/shared/media";
import { buildGlobalSchema, JsonLd } from "@/shared/seo";
import "./globals.css";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const sans = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — ${SITE_SLOGAN}`,
    template: `%s — ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "hospitality",
  keywords: [
    "Kamyna Living",
    "Ruma Kamyna",
    "private stays",
    "design-led accommodation",
    "quiet hospitality",
    "slow living retreat",
  ],
  alternates: {
    canonical: "/",
    languages: { en: "/", "x-default": "/" },
  },
  verification: { google: GOOGLE_SITE_VERIFICATION },
  formatDetection: { address: false, email: false, telephone: false },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    other: [{ rel: "mask-icon", url: "/brand/mask-icon.svg", color: "#2D2B27" }],
  },
  manifest: "/manifest.webmanifest",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: SITE_NAME,
    title: `${SITE_NAME} — ${SITE_SLOGAN}`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    images: [
      {
        url: socialImages.kamynaLiving,
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} — ${SITE_SLOGAN}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — ${SITE_SLOGAN}`,
    description: SITE_DESCRIPTION,
    images: [socialImages.kamynaLiving],
  },
  appleWebApp: {
    capable: true,
    title: SITE_NAME,
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F3EFE8" },
    { media: "(prefers-color-scheme: dark)", color: "#2D2B27" },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body className="antialiased">
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <JsonLd data={buildGlobalSchema()} />
        {children}
      </body>
    </html>
  );
}

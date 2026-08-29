const buildVersion = process.env.NEXT_PUBLIC_BUILD_VERSION?.trim()
  || process.env.SOURCE_COMMIT?.trim()
  || process.env.GITHUB_SHA?.trim()
  || `build-${Date.now().toString(36)}`;

/** @type {import("next").NextConfig} */
const nextConfig = {
  output: "standalone",
  cacheComponents: true,
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  env: { NEXT_PUBLIC_BUILD_VERSION: buildVersion },
  generateBuildId: async () => buildVersion,
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75],
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.kamynaliving.com" }],
        destination: "https://kamynaliving.com/:path*",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), fullscreen=(self), screen-wake-lock=(self)" },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
        ],
      },
      {
        source: "/sw.js",
        headers: [
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
          { key: "Service-Worker-Allowed", value: "/" },
        ],
      },
      {
        source: "/:manifest(manifest|presentation).webmanifest",
        headers: [{ key: "Cache-Control", value: "no-cache, max-age=0, must-revalidate" }],
      },
      {
        source: "/admin/:path*",
        headers: [
          { key: "Cache-Control", value: "private, no-store" },
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
        ],
      },
      {
        source: "/:privatePage(welcome|presentation)",
        headers: [
          { key: "Cache-Control", value: "private, no-store" },
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
        ],
      },
      {
        source: "/offline",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" }],
      },
      {
        source: "/media/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" }],
      },
      {
        source: "/brand/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" }],
      },
      {
        source: "/pwa/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" }],
      },
    ];
  },
};

export default nextConfig;

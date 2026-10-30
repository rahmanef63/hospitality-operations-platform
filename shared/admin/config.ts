export type AdminRuntimeConfig = { siteOrigin: string };

export function getAdminRuntimeConfig(): AdminRuntimeConfig {
  const value = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!value) throw new Error("NEXT_PUBLIC_SITE_URL is not configured correctly.");
  const siteUrl = new URL(value);
  if (process.env.NODE_ENV === "production" && siteUrl.protocol !== "https:") {
    throw new Error("NEXT_PUBLIC_SITE_URL must use HTTPS in production.");
  }
  return { siteOrigin: siteUrl.origin };
}

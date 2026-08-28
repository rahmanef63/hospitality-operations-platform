const fallbackUrl = "https://kamynaliving.com";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? fallbackUrl;
export const SITE_NAME = "Kamyna Living";
export const SITE_SLOGAN = "Homes for slower living";
export const SITE_DESCRIPTION =
  "A growing collection of private stays shaped by quiet design, thoughtful hospitality, and unhurried time.";
export const CONTACT_EMAIL = "hello@kamynaliving.com";
export const GOOGLE_SITE_VERIFICATION = "E6-55-Sl0x-BwAAgBwYg8MTz4HBUVlc3ZlFkKmtFVBs";
export const COPYRIGHT_YEAR = 2026;
export const CONTENT_UPDATED_AT = new Date("2026-08-28T00:00:00.000Z");

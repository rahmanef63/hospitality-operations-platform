const fallbackUrl = "https://kamynaliving.com";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? fallbackUrl;
export const SITE_NAME = "Kamyna Living";
export const CONTACT_EMAIL = "hello@kamynaliving.com";

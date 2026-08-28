import type { Metadata } from "next";
import { WelcomePage } from "@/features/welcome";
import { getPublishedWelcome } from "@/shared/convex";
import { getPropertyBySlug } from "@/shared/content";
import {
  DEFAULT_WELCOME_CONTENT,
  normalizeGuestName,
  parseWelcomeLocale,
  renderWelcomeContent,
} from "@/shared/welcome";


export const metadata: Metadata = {
  title: "Welcome to Ruma Kamyna",
  description: "A private welcome for guests of Ruma Kamyna.",
  robots: { index: false, follow: false, noarchive: true, googleBot: { index: false, follow: false } },
};

export const instant = false;

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ locale?: string; name?: string }>;
}) {
  const params = await searchParams;
  const locale = parseWelcomeLocale(params.locale);
  const guestName = normalizeGuestName(params.name);
  let content = DEFAULT_WELCOME_CONTENT[locale];
  try {
    const published = await getPublishedWelcome(locale);
    if (published) content = published.content;
  } catch {
    // The verified static fallback keeps the guest page available during a backend interruption.
  }
  const property = await getPropertyBySlug("ruma-kamyna");
  const contactHref = property?.contact.whatsappHref ?? `mailto:${property?.contact.email ?? "hello@kamynaliving.com"}`;
  const contactLabel = locale === "id" ? "Hubungi host" : "Contact your host";
  return (
    <WelcomePage
      locale={locale}
      content={renderWelcomeContent(content, locale, guestName)}
      contactHref={contactHref}
      contactLabel={contactLabel}
    />
  );
}

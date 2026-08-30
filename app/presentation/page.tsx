import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PresentationPage } from "@/features/welcome";
import { getPublishedWelcome } from "@/shared/convex";
import { CONTACT_EMAIL } from "@/shared/config/site";
import { getPropertyBySlug } from "@/shared/content";
import { defaultWelcomeContent, getWelcomeLocaleMeta, renderWelcomeContent } from "@/shared/welcome";
import { resolveGuestWelcomeRequest } from "@/shared/welcome/resolve";
import { getAnnouncementProgram } from "@/shared/announcements/server";

export const metadata: Metadata = {
  title: "Hospitality TV Presentation",
  description: "A fullscreen guest welcome presentation for Hospitality Operations Platform displays.",
  manifest: "/presentation.webmanifest",
  robots: { index: false, follow: false, noarchive: true, googleBot: { index: false, follow: false } },
};
export const instant = false;

export default async function Page({ searchParams }: {
  searchParams: Promise<{ locale?: string; name?: string; token?: string; property?: string; tv?: string }>;
}) {
  const params = await searchParams;
  const resolved = await resolveGuestWelcomeRequest(params);
  if (!resolved.valid) notFound();
  const propertySlug = resolved.propertySlug ?? "primary-property";
  const property = await getPropertyBySlug(propertySlug);
  const propertyName = resolved.context?.propertyName ?? property?.name ?? "Property";
  let content = defaultWelcomeContent(resolved.locale, propertyName);
  const [published, announcements] = await Promise.all([
    getPublishedWelcome(resolved.locale, propertySlug).catch(() => null),
    getAnnouncementProgram({
      propertySlug,
      locale: resolved.locale,
      timezone: property?.timezone ?? "Asia/Jakarta",
      coordinates: property?.location.geo,
    }),
  ]);
  if (published) content = published.content;
  const contactHref = property?.contact.whatsappHref ?? `mailto:${property?.contact.email ?? CONTACT_EMAIL}`;
  const meta = getWelcomeLocaleMeta(resolved.locale);
  return (
    <PresentationPage
      locale={resolved.locale}
      content={renderWelcomeContent(content, resolved.locale, resolved.guestName, propertyName)}
      propertyName={propertyName}
      propertySlug={propertySlug}
      context={resolved.context}
      token={resolved.token}
      contactHref={contactHref}
      contactLabel={meta.contactLabel}
      announcements={announcements}
      tvMode={params.tv !== "0"}
    />
  );
}

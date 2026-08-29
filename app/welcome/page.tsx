import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { WelcomePage } from "@/features/welcome";
import { getPublishedWelcome } from "@/shared/convex";
import { getPropertyBySlug } from "@/shared/content";
import { defaultWelcomeContent, getWelcomeLocaleMeta, renderWelcomeContent } from "@/shared/welcome";
import { resolveGuestWelcomeRequest } from "@/shared/welcome/resolve";

export const metadata: Metadata = {
  title: "Welcome to Kamyna Living",
  manifest: "/tv-manifest.webmanifest",
  description: "A private welcome for guests of Kamyna Living.",
  robots: { index: false, follow: false, noarchive: true, googleBot: { index: false, follow: false } },
};
export const instant = false;

export default async function Page({ searchParams }: {
  searchParams: Promise<{ locale?: string; name?: string; token?: string; property?: string; tv?: string }>;
}) {
  const params = await searchParams;
  const resolved = await resolveGuestWelcomeRequest(params);
  if (!resolved.valid) notFound();
  const propertySlug = resolved.propertySlug ?? "ruma-kamyna";
  const property = await getPropertyBySlug(propertySlug);
  const propertyName = resolved.context?.propertyName ?? property?.name ?? "Ruma Kamyna";
  let content = defaultWelcomeContent(resolved.locale, propertyName);
  try {
    const published = await getPublishedWelcome(resolved.locale, propertySlug);
    if (published) content = published.content;
  } catch {
    // Reviewed multilingual defaults keep this private page available during backend interruptions.
  }
  const contactHref = property?.contact.whatsappHref ?? `mailto:${property?.contact.email ?? "hello@kamynaliving.com"}`;
  const meta = getWelcomeLocaleMeta(resolved.locale);
  return (
    <WelcomePage
      locale={resolved.locale}
      content={renderWelcomeContent(content, resolved.locale, resolved.guestName, propertyName)}
      propertyName={propertyName}
      propertySlug={propertySlug}
      context={resolved.context}
      token={resolved.token}
      contactHref={contactHref}
      contactLabel={meta.contactLabel}
      tvMode={params.tv === "1"}
    />
  );
}

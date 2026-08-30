import { AdminDashboard } from "@/features/admin";
import { SITE_URL } from "@/shared/config/site";
import { getPropertyBySlug } from "@/shared/content";
import { calculatePrayerMoments, defaultAnnouncementSettings, defaultRulesForProperty, type AnnouncementAdminOverview } from "@/shared/announcements";
import { requireAdminSession } from "@/shared/admin";
import { getAnnouncementAdminOverview, getPmsBookingData, getPmsCatalog, getWelcomeAdminOverview } from "@/shared/convex";
import type { PmsBookingData, PmsCatalog } from "@/shared/pms";
import { DEFAULT_WELCOME_CONTENT, WELCOME_LOCALES, defaultWelcomeContent, parseWelcomeLocale, type ReservationWelcomeLink, type WelcomeAdminOverview } from "@/shared/welcome";
import { buildReservationWelcomeLinks } from "@/shared/welcome/server";
import { updateWelcomeAction } from "./actions";
import { archiveAnnouncementRuleAction, ensureAnnouncementDefaultsAction, updateAnnouncementSettingsAction, updateGuestVisibilityAction, upsertAnnouncementRuleAction } from "./announcement-actions";

const emptyCatalog: PmsCatalog = { properties: [], units: [], amenities: [] };
const emptyBooking: PmsBookingData = { guests: [], reservations: [] };

function fallbackOverview(propertyName: string): WelcomeAdminOverview {
  return {
    configs: Object.fromEntries(WELCOME_LOCALES.map((locale) => [locale, {
      locale,
      draft: propertyName === "Ruma Kamyna" ? DEFAULT_WELCOME_CONTENT[locale] : defaultWelcomeContent(locale, propertyName),
      version: 0,
    }])) as WelcomeAdminOverview["configs"],
    events: [],
  };
}

function fallbackAnnouncements(propertySlug: string): AnnouncementAdminOverview {
  return {
    settings: defaultAnnouncementSettings(propertySlug),
    rules: defaultRulesForProperty(propertySlug),
    events: [],
  };
}

export const instant = false;

export default async function Page({ searchParams }: {
  searchParams: Promise<{ status?: string; error?: string; locale?: string; property?: string }>;
}) {
  const session = await requireAdminSession();
  const params = await searchParams;
  const selectedLocale = parseWelcomeLocale(params.locale);
  let catalog = emptyCatalog;
  let booking = emptyBooking;
  let backendError = false;
  try { [catalog, booking] = await Promise.all([getPmsCatalog(), getPmsBookingData()]); } catch { backendError = true; }
  const selectedProperty = catalog.properties.find((property) => property.slug === params.property)
    ?? catalog.properties.find((property) => property.slug === "ruma-kamyna")
    ?? catalog.properties[0]
    ?? { slug: "ruma-kamyna", name: "Ruma Kamyna", timezone: "Asia/Jakarta" };
  const propertyContent = await getPropertyBySlug(selectedProperty.slug);
  const announcementTimezone = "timezone" in selectedProperty ? selectedProperty.timezone : propertyContent?.timezone ?? "Asia/Jakarta";
  const announcementCoordinates = propertyContent?.location.geo;
  let announcementOverview = fallbackAnnouncements(selectedProperty.slug);
  let overview = fallbackOverview(selectedProperty.name);
  let links: ReservationWelcomeLink[] = [];
  let linkError = false;
  if (!backendError) {
    try {
      announcementOverview = await getAnnouncementAdminOverview(selectedProperty.slug);
    } catch { backendError = true; }
    try {
      const loaded = await getWelcomeAdminOverview(selectedProperty.slug);
      overview = {
        ...loaded,
        configs: Object.fromEntries(WELCOME_LOCALES.map((locale) => {
          const config = loaded.configs[locale];
          return [locale, config.version === 0
            ? { ...config, draft: defaultWelcomeContent(locale, selectedProperty.name) }
            : config];
        })) as WelcomeAdminOverview["configs"],
      };
    } catch { backendError = true; }
    try {
      links = buildReservationWelcomeLinks(booking, catalog).filter((link) => link.propertySlug === selectedProperty.slug);
    } catch { linkError = true; }
  }
  const prayerPreview = announcementCoordinates ? calculatePrayerMoments({
    ...announcementCoordinates,
    timezone: announcementTimezone,
    method: announcementOverview.settings.prayerMethod,
    madhab: announcementOverview.settings.madhab,
  }) : [];
  return (
    <AdminDashboard
      sessionEmail={session.email}
      overview={overview}
      links={links}
      linkError={linkError}
      properties={catalog.properties.map(({ slug, name }) => ({ slug, name }))}
      selectedProperty={{ slug: selectedProperty.slug, name: selectedProperty.name }}
      endpointUrl={`${SITE_URL}/api/welcome`}
      previewUrl={`${SITE_URL}/welcome`}
      backendError={backendError}
      status={params.status}
      error={params.error}
      selectedLocale={selectedLocale}
      formAction={updateWelcomeAction}
      announcementOverview={announcementOverview}
      announcementTimezone={announcementTimezone}
      announcementCoordinatesAvailable={Boolean(announcementCoordinates)}
      prayerPreview={prayerPreview}
      announcementSettingsAction={updateAnnouncementSettingsAction}
      announcementExperienceAction={updateGuestVisibilityAction}
      announcementRuleAction={upsertAnnouncementRuleAction}
      announcementArchiveAction={archiveAnnouncementRuleAction}
      announcementSeedAction={ensureAnnouncementDefaultsAction}
    />
  );
}

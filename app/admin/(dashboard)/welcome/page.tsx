import { AdminDashboard } from "@/features/admin";
import { SITE_URL } from "@/shared/config/site";
import { requireAdminSession } from "@/shared/admin";
import { getPmsBookingData, getPmsCatalog, getWelcomeAdminOverview } from "@/shared/convex";
import type { PmsBookingData, PmsCatalog } from "@/shared/pms";
import { DEFAULT_WELCOME_CONTENT, WELCOME_LOCALES, defaultWelcomeContent, parseWelcomeLocale, type ReservationWelcomeLink, type WelcomeAdminOverview } from "@/shared/welcome";
import { buildReservationWelcomeLinks } from "@/shared/welcome/server";
import { updateWelcomeAction } from "./actions";

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
    ?? { slug: "ruma-kamyna", name: "Ruma Kamyna" };
  let overview = fallbackOverview(selectedProperty.name);
  let links: ReservationWelcomeLink[] = [];
  let linkError = false;
  if (!backendError) {
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
    />
  );
}

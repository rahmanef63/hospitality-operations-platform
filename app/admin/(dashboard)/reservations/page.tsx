import { ReservationManager } from "@/features/pms";
import { getPmsBookingData, getPmsCalendar, getPmsCatalog } from "@/shared/convex";
import {
  monthGridRange,
  normalizeMonth,
  todayInTimeZone,
  type PmsBookingData,
  type PmsCalendarData,
  type PmsCatalog,
} from "@/shared/pms";
import { buildReservationWelcomeLinks } from "@/shared/welcome/server";
import { pmsAction } from "../actions";

const emptyCatalog: PmsCatalog = { properties: [], units: [], amenities: [] };
const emptyBooking: PmsBookingData = { guests: [], reservations: [] };
const emptyCalendar: PmsCalendarData = { reservations: [], blocks: [] };
export const instant = false;

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; error?: string; property?: string; month?: string; new?: string }>;
}) {
  const params = await searchParams;
  const today = todayInTimeZone();
  const month = normalizeMonth(params.month, today);
  const range = monthGridRange(month);
  let catalog = emptyCatalog;
  let booking = emptyBooking;
  let calendar = emptyCalendar;
  let backendError = false;
  let welcomeLinks: Record<string, string> = {};
  try {
    catalog = await getPmsCatalog();
    const propertyId = catalog.properties.some((property) => property.id === params.property) ? params.property : undefined;
    [booking, calendar] = await Promise.all([
      getPmsBookingData(propertyId ? { propertyId } : {}),
      getPmsCalendar({ propertyId, startDate: range.start, endDate: range.end }),
    ]);
    try { welcomeLinks = Object.fromEntries((await buildReservationWelcomeLinks(booking, catalog)).map((link) => [link.reservationId, link.url])); } catch { /* Links remain unavailable until the runtime secret is configured. */ }
  } catch { backendError = true; }
  const propertyId = catalog.properties.some((property) => property.id === params.property) ? params.property : undefined;
  return (
    <ReservationManager
      catalog={catalog}
      booking={booking}
      calendar={calendar}
      month={month}
      propertyId={propertyId}
      today={today}
      openCreate={params.new === "1"}
      state={params}
      backendError={backendError}
      formAction={pmsAction}
      welcomeLinks={welcomeLinks}
    />
  );
}

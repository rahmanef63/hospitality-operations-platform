import { CalendarManager } from "@/features/pms";
import { getPmsCalendar, getPmsCatalog } from "@/shared/convex";
import {
  monthGridRange,
  normalizeMonth,
  todayInTimeZone,
  type PmsCalendarData,
  type PmsCatalog,
} from "@/shared/pms";
import { pmsAction } from "../actions";

const emptyCatalog: PmsCatalog = { properties: [], units: [], amenities: [] };
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
  let calendar = emptyCalendar;
  let backendError = false;
  try {
    catalog = await getPmsCatalog();
    const propertyId = catalog.properties.some((property) => property.id === params.property) ? params.property : undefined;
    calendar = await getPmsCalendar({ propertyId, startDate: range.start, endDate: range.end });
  } catch { backendError = true; }
  const propertyId = catalog.properties.some((property) => property.id === params.property) ? params.property : undefined;
  return (
    <CalendarManager
      catalog={catalog}
      calendar={calendar}
      month={month}
      propertyId={propertyId}
      today={today}
      openCreate={params.new === "1"}
      state={params}
      backendError={backendError}
      formAction={pmsAction}
    />
  );
}

import { CalendarManager } from "@/features/pms";
import { getPmsCalendar, getPmsCatalog } from "@/shared/convex";
import { monthCalendarRange, todayInTimeZone, type PmsCalendarData, type PmsCatalog } from "@/shared/pms";
import { pmsAction } from "../actions";

const emptyCatalog: PmsCatalog = { properties: [], units: [], amenities: [] };
const emptyCalendar: PmsCalendarData = { reservations: [], blocks: [] };
const validDate = (value: string | undefined, fallback: string) => /^\d{4}-\d{2}-\d{2}$/.test(value ?? "") ? value! : fallback;

export const instant = false;
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; error?: string; property?: string; start?: string; end?: string }>;
}) {
  const params = await searchParams;
  const defaults = monthCalendarRange(todayInTimeZone());
  const range = { start: validDate(params.start, defaults.start), end: validDate(params.end, defaults.end) };
  let catalog = emptyCatalog;
  let calendar = emptyCalendar;
  let backendError = false;
  try {
    catalog = await getPmsCatalog();
    const propertyId = catalog.properties.some((property) => property.id === params.property) ? params.property : undefined;
    calendar = await getPmsCalendar({ propertyId, startDate: range.start, endDate: range.end });
  } catch { backendError = true; }
  const propertyId = catalog.properties.some((property) => property.id === params.property) ? params.property : undefined;
  return <CalendarManager catalog={catalog} calendar={calendar} range={range} propertyId={propertyId} state={params} backendError={backendError} formAction={pmsAction} />;
}

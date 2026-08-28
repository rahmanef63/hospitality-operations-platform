import { ReservationManager } from "@/features/pms";
import { getPmsBookingData, getPmsCatalog } from "@/shared/convex";
import type { PmsBookingData, PmsCatalog } from "@/shared/pms";
import { pmsAction } from "../actions";

const emptyCatalog: PmsCatalog = { properties: [], units: [], amenities: [] };
const emptyBooking: PmsBookingData = { guests: [], reservations: [] };
export const instant = false;
export default async function Page({ searchParams }: { searchParams: Promise<{ status?: string; error?: string }> }) {
  const state = await searchParams;
  let catalog = emptyCatalog;
  let booking = emptyBooking;
  let backendError = false;
  try { [catalog, booking] = await Promise.all([getPmsCatalog(), getPmsBookingData()]); } catch { backendError = true; }
  return <ReservationManager catalog={catalog} booking={booking} state={state} backendError={backendError} formAction={pmsAction} />;
}

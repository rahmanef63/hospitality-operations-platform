import { GuestManager } from "@/features/pms";
import { getPmsBookingData } from "@/shared/convex";
import type { PmsBookingData } from "@/shared/pms";
import { pmsAction } from "../actions";

const empty: PmsBookingData = { guests: [], reservations: [] };
export const instant = false;
export default async function Page({ searchParams }: { searchParams: Promise<{ status?: string; error?: string; new?: string }> }) {
  const state = await searchParams;
  let booking = empty;
  let backendError = false;
  try { booking = await getPmsBookingData(); } catch { backendError = true; }
  return <GuestManager booking={booking} openCreate={state.new === "1"} state={state} backendError={backendError} formAction={pmsAction} />;
}

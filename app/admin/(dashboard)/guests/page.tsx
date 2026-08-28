import { GuestManager } from "@/features/pms";
import { getPmsGuests } from "@/shared/convex";
import type { PmsGuest } from "@/shared/pms";
import { pmsAction } from "../actions";

export const instant = false;
export default async function Page({ searchParams }: { searchParams: Promise<{ status?: string; error?: string; new?: string }> }) {
  const state = await searchParams;
  let guests: PmsGuest[] = [];
  let backendError = false;
  try { guests = await getPmsGuests(); } catch { backendError = true; }
  return <GuestManager guests={guests} openCreate={state.new === "1"} state={state} backendError={backendError} formAction={pmsAction} />;
}

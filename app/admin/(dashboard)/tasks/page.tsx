import { TaskManager } from "@/features/pms";
import { getPmsCatalog, getPmsReservations, getPmsTasks } from "@/shared/convex";
import { todayInTimeZone, type PmsCatalog, type PmsReservation, type PmsTask } from "@/shared/pms";
import { pmsAction } from "../actions";

const emptyCatalog: PmsCatalog = { properties: [], units: [], amenities: [] };
export const instant = false;
export default async function Page({ searchParams }: { searchParams: Promise<{ status?: string; error?: string; new?: string }> }) {
  const state = await searchParams;
  let catalog = emptyCatalog;
  let reservations: PmsReservation[] = [];
  let tasks: PmsTask[] = [];
  let backendError = false;
  try { [catalog, reservations, tasks] = await Promise.all([getPmsCatalog(), getPmsReservations(), getPmsTasks()]); } catch { backendError = true; }
  return <TaskManager catalog={catalog} reservations={reservations} tasks={tasks} today={todayInTimeZone()} openCreate={state.new === "1"} state={state} backendError={backendError} formAction={pmsAction} />;
}

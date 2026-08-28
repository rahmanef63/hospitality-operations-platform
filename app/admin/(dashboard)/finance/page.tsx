import { FinanceManager } from "@/features/pms";
import { getPmsCatalog, getPmsFinance, getPmsReservations } from "@/shared/convex";
import type { PmsCatalog, PmsFinanceData, PmsReservation } from "@/shared/pms";
import { pmsAction } from "../actions";

const emptyCatalog: PmsCatalog = { properties: [], units: [], amenities: [] };
const emptyFinance: PmsFinanceData = { transactions: [], totals: { payments: 0, refunds: 0, expenses: 0, net: 0 } };
export const instant = false;
export default async function Page({ searchParams }: { searchParams: Promise<{ status?: string; error?: string }> }) {
  const state = await searchParams;
  let catalog = emptyCatalog;
  let finance = emptyFinance;
  let reservations: PmsReservation[] = [];
  let backendError = false;
  try { [catalog, finance, reservations] = await Promise.all([getPmsCatalog(), getPmsFinance(), getPmsReservations()]); } catch { backendError = true; }
  return <FinanceManager catalog={catalog} finance={finance} reservations={reservations} state={state} backendError={backendError} formAction={pmsAction} />;
}

import { UnitManager } from "@/features/pms";
import { getPmsCatalog } from "@/shared/convex";
import type { PmsCatalog } from "@/shared/pms";
import { pmsAction } from "../actions";

const empty: PmsCatalog = { properties: [], units: [], amenities: [] };
export const instant = false;
export default async function Page({ searchParams }: { searchParams: Promise<{ status?: string; error?: string }> }) {
  const state = await searchParams;
  let catalog = empty;
  let backendError = false;
  try { catalog = await getPmsCatalog(); } catch { backendError = true; }
  return <UnitManager catalog={catalog} state={state} backendError={backendError} formAction={pmsAction} />;
}

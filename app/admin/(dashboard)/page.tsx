import { PmsDashboardPage } from "@/features/pms";
import { getPmsDashboard } from "@/shared/convex";
import { addDays, monthBounds, todayInTimeZone, type PmsDashboard } from "@/shared/pms";
import { pmsAction } from "./actions";

function emptyDashboard(): PmsDashboard {
  return {
    metrics: {
      activeProperties: 0, upcomingReservations: 0, inHouse: 0, arrivalsNextSevenDays: 0,
      openTasks: 0, incomeThisMonth: 0, expensesThisMonth: 0, outstandingBalance: 0,
    },
    properties: [], arrivals: [], departures: [], tasks: [], activity: [],
  };
}

export const instant = false;

export default async function Page({ searchParams }: { searchParams: Promise<{ status?: string; error?: string }> }) {
  const state = await searchParams;
  const today = todayInTimeZone();
  const month = monthBounds(today);
  let dashboard = emptyDashboard();
  let backendError = false;
  try {
    dashboard = await getPmsDashboard({
      today,
      weekEnd: addDays(today, 7),
      monthStart: month.start,
      monthEnd: month.end,
    });
  } catch {
    backendError = true;
  }
  return <PmsDashboardPage dashboard={dashboard} today={today} backendError={backendError} state={state} formAction={pmsAction} />;
}

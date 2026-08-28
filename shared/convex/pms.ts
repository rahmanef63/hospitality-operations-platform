import "server-only";
import { api } from "@/convex/_generated/api";
import {
  RUMA_KAMYNA_PUBLIC_FALLBACK,
  type PmsBookingData,
  type PmsCalendarData,
  type PmsCatalog,
  type PmsDashboard,
  type PmsFinanceData,
  type PmsGuest,
  type PmsReservation,
  type PmsTask,
  type PublicPropertyFacts,
} from "@/shared/pms";
import { adminFetch, getConvexClient } from "./core";

export async function pmsAdminRequest<T>(action: string, payload: Record<string, unknown> = {}): Promise<T> {
  return adminFetch<T>("/admin/pms", { action, payload });
}

export async function getPmsDashboard(input: {
  today: string;
  weekEnd: string;
  monthStart: string;
  monthEnd: string;
}): Promise<PmsDashboard> {
  return pmsAdminRequest("dashboard.get", input);
}

export async function getPmsCatalog(): Promise<PmsCatalog> {
  return pmsAdminRequest("catalog.list");
}

export async function getPmsGuests(): Promise<PmsGuest[]> {
  return pmsAdminRequest("guest.list");
}

export async function getPmsReservations(input: {
  propertyId?: string;
  startDate?: string;
  endDate?: string;
} = {}): Promise<PmsReservation[]> {
  return pmsAdminRequest("reservation.list", input);
}

export async function getPmsBookingData(input: {
  propertyId?: string;
  startDate?: string;
  endDate?: string;
} = {}): Promise<PmsBookingData> {
  const [guests, reservations] = await Promise.all([getPmsGuests(), getPmsReservations(input)]);
  return { guests, reservations };
}

export async function getPmsCalendar(input: {
  propertyId?: string;
  startDate: string;
  endDate: string;
}): Promise<PmsCalendarData> {
  return pmsAdminRequest("calendar.get", input);
}

export async function getPmsFinance(input: {
  propertyId?: string;
  startDate?: string;
  endDate?: string;
} = {}): Promise<PmsFinanceData> {
  return pmsAdminRequest("finance.list", input);
}

export async function getPmsTasks(propertyId?: string): Promise<PmsTask[]> {
  return pmsAdminRequest("task.list", propertyId ? { propertyId } : {});
}

export async function seedRumaKamyna(actorEmailHash: string) {
  return pmsAdminRequest<{
    propertyId: string;
    propertyCreated: boolean;
    amenitiesCreated: number;
    amenitiesUpdated: number;
  }>("seed.ruma-kamyna", { actorEmailHash });
}

export async function getPublicPropertyFacts(slug: string): Promise<PublicPropertyFacts | null> {
  try {
    const data = await getConvexClient().query(api.pms.public.getProperty, { slug });
    if (data) {
      return {
        ...data,
        id: String(data.id),
        units: data.units.map((unit) => ({ ...unit, id: String(unit.id) })),
        source: "convex",
      };
    }
  } catch {
    // The public route keeps an owner-reviewed fallback if Convex is temporarily unavailable.
  }
  return slug === RUMA_KAMYNA_PUBLIC_FALLBACK.slug ? RUMA_KAMYNA_PUBLIC_FALLBACK : null;
}

import "server-only";
import { SITE_URL } from "@/shared/config/site";
import { createReservationWelcomeTokens } from "@/shared/convex";
import { addDays } from "@/shared/pms";
import type { PmsBookingData, PmsCatalog } from "@/shared/pms";
import type { ReservationWelcomeLink } from "./types";

function guestWelcomeExpiry(checkOut: string): number {
  const expiresOn = addDays(checkOut, 30);
  return Date.parse(`${expiresOn}T23:59:59.999Z`);
}

export async function buildReservationWelcomeLinks(
  booking: PmsBookingData,
  catalog?: PmsCatalog,
  now = Date.now(),
): Promise<ReservationWelcomeLink[]> {
  const guests = new Map(booking.guests.map((guest) => [guest.id, guest]));
  const properties = new Map(catalog?.properties.map((property) => [property.id, property]) ?? []);
  const candidates = booking.reservations
    .filter((reservation) => !["cancelled", "no_show"].includes(reservation.status))
    .map((reservation) => ({ reservation, expiresAt: guestWelcomeExpiry(reservation.checkOut) }))
    .filter(({ expiresAt }) => expiresAt > now);
  const tokens = await createReservationWelcomeTokens(candidates.map(({ reservation, expiresAt }) => ({
    reservationId: reservation.id, expiresAt,
  })));
  const tokenByReservation = new Map(tokens.map((item) => [item.reservationId, item.token]));
  const links: ReservationWelcomeLink[] = [];
  for (const { reservation } of candidates) {
    const token = tokenByReservation.get(reservation.id);
    if (!token) continue;
    const guest = guests.get(reservation.guestId);
    const params = new URLSearchParams({ token, locale: reservation.welcomeLocale });
    const property = properties.get(reservation.propertyId);
    links.push({
      reservationId: reservation.id, reference: reservation.reference,
      propertySlug: property?.slug ?? "primary-property", guestName: reservation.guestName,
      ...(guest?.email ? { guestEmail: guest.email } : {}),
      ...(guest?.phone ? { guestPhone: guest.phone } : {}),
      propertyName: reservation.propertyName, ...(reservation.unitName ? { unitName: reservation.unitName } : {}),
      checkIn: reservation.checkIn, checkOut: reservation.checkOut, status: reservation.status,
      locale: reservation.welcomeLocale, url: `${SITE_URL}/welcome?${params}`,
    });
  }
  return links.sort((left, right) => left.checkIn.localeCompare(right.checkIn));
}

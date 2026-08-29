import "server-only";
import { SITE_URL } from "@/shared/config/site";
import { addDays } from "@/shared/pms";
import type { PmsBookingData, PmsCatalog } from "@/shared/pms";
import type { ReservationWelcomeLink } from "./types";
import { createGuestWelcomeToken } from "./token";

export function getGuestWelcomeSecret(): string {
  const value = process.env.KAMYNA_GUEST_LINK_SECRET?.trim();
  if (!value || value.length < 32) throw new Error("KAMYNA_GUEST_LINK_SECRET is not configured correctly.");
  return value;
}

export function guestWelcomeExpiry(checkOut: string): number {
  const expiresOn = addDays(checkOut, 30);
  return Date.parse(`${expiresOn}T23:59:59.999Z`);
}

export function buildReservationWelcomeLinks(
  booking: PmsBookingData,
  catalog?: PmsCatalog,
  now = Date.now(),
): ReservationWelcomeLink[] {
  const secret = getGuestWelcomeSecret();
  const guests = new Map(booking.guests.map((guest) => [guest.id, guest]));
  const properties = new Map(catalog?.properties.map((property) => [property.id, property]) ?? []);
  const links: ReservationWelcomeLink[] = [];
  for (const reservation of booking.reservations) {
    if (["cancelled", "no_show"].includes(reservation.status)) continue;
    const expiresAt = guestWelcomeExpiry(reservation.checkOut);
    if (expiresAt <= now) continue;
    const guest = guests.get(reservation.guestId);
    const token = createGuestWelcomeToken(reservation.id, secret, expiresAt, now);
    const params = new URLSearchParams({ token, locale: reservation.welcomeLocale });
    const property = properties.get(reservation.propertyId);
    links.push({
      reservationId: reservation.id,
      reference: reservation.reference,
      propertySlug: property?.slug ?? "ruma-kamyna",
      guestName: reservation.guestName,
      ...(guest?.email ? { guestEmail: guest.email } : {}),
      ...(guest?.phone ? { guestPhone: guest.phone } : {}),
      propertyName: reservation.propertyName,
      ...(reservation.unitName ? { unitName: reservation.unitName } : {}),
      checkIn: reservation.checkIn,
      checkOut: reservation.checkOut,
      status: reservation.status,
      locale: reservation.welcomeLocale,
      url: `${SITE_URL}/welcome?${params}`,
    });
  }
  return links.sort((left, right) => left.checkIn.localeCompare(right.checkIn));
}

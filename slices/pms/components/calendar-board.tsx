import Link from "next/link";
import { Ban, CalendarDays, ChevronLeft, ChevronRight, Clock3, House, MoveRight } from "lucide-react";
import {
  calendarDays,
  isDateWithin,
  isSameMonth,
  monthLabel,
  shiftMonth,
  shortDayLabel,
  todayInTimeZone,
  type PmsAvailabilityBlock,
  type PmsCalendarData,
  type PmsReservation,
} from "@/shared/pms";
import type { PmsTone } from "./ui-options";

const weekdays = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

type CalendarEvent = {
  id: string;
  type: "reservation" | "block";
  title: string;
  subtitle: string;
  start: string;
  end: string;
  status: string;
  tone: PmsTone;
  href: string;
};

function reservationTone(status: string): PmsTone {
  if (status === "confirmed") return "green";
  if (status === "checked_in") return "olive";
  if (status === "tentative") return "amber";
  if (status === "cancelled" || status === "no_show") return "red";
  if (status === "checked_out") return "blue";
  return "neutral";
}

function eventTone(tone: PmsTone) {
  return {
    neutral: "border-charcoal/12 bg-charcoal/[.055] text-charcoal/72",
    olive: "border-olive/25 bg-olive/12 text-olive",
    blue: "border-[#51718d]/25 bg-[#e3edf4] text-[#365d78]",
    amber: "border-[#a3721f]/25 bg-[#f1e4cb] text-[#825912]",
    red: "border-[#a6392c]/25 bg-[#f4e0db] text-[#833126]",
    purple: "border-[#765b8d]/25 bg-[#eee7f3] text-[#674b7d]",
    green: "border-[#43704f]/25 bg-[#dfe9df] text-[#31533b]",
  }[tone];
}

function hrefFor(basePath: string, month: string, propertyId?: string) {
  const query = new URLSearchParams({ month: month.slice(0, 7) });
  if (propertyId) query.set("property", propertyId);
  return `${basePath}?${query.toString()}`;
}

function toEvents(
  calendar: PmsCalendarData,
  month: string,
): CalendarEvent[] {
  const reservations = calendar.reservations.map((reservation: PmsReservation): CalendarEvent => ({
    id: reservation.id,
    type: "reservation",
    title: reservation.guestName,
    subtitle: `${reservation.propertyName}${reservation.unitName ? ` · ${reservation.unitName}` : ""}`,
    start: reservation.checkIn,
    end: reservation.checkOut,
    status: reservation.status,
    tone: reservationTone(reservation.status),
    href: `/admin/reservations#reservation-${reservation.id}`,
  }));
  const blocks = calendar.blocks.map((block: PmsAvailabilityBlock): CalendarEvent => ({
    id: block.id,
    type: "block",
    title: block.title,
    subtitle: `${block.propertyName}${block.unitName ? ` · ${block.unitName}` : ""}`,
    start: block.startDate,
    end: block.endDate,
    status: block.reason,
    tone: block.reason === "maintenance" ? "amber" : block.reason === "closed" ? "red" : "purple",
    href: `/admin/calendar?month=${month.slice(0, 7)}#block-${block.id}`,
  }));
  return [...reservations, ...blocks];
}

function EventChip({ event, dense = false }: { event: CalendarEvent; dense?: boolean }) {
  return (
    <Link
      href={event.href}
      title={`${event.title} · ${event.subtitle}`}
      className={`flex min-w-0 items-center gap-1.5 rounded-[.3rem] border px-2 py-1 text-[.62rem] font-semibold transition hover:brightness-[.97] ${eventTone(event.tone)}`}
    >
      {event.type === "block" ? <Ban className="size-3 shrink-0" aria-hidden="true" /> : <House className="size-3 shrink-0" aria-hidden="true" />}
      <span className="truncate">{event.title}</span>
      {!dense ? <span className="ml-auto shrink-0 opacity-55">{event.type === "block" ? "blok" : "stay"}</span> : null}
    </Link>
  );
}

function MobileAgenda({ events, days }: { events: CalendarEvent[]; days: string[] }) {
  const activeDays = days.filter((day) => events.some((event) => isDateWithin(day, event.start, event.end)));
  if (!activeDays.length) {
    return <div className="rounded-[.45rem] border border-dashed border-charcoal/18 bg-[#f8f8f5] p-8 text-center text-sm leading-7 text-ink-soft md:hidden">Belum ada reservasi atau blok pada bulan ini.</div>;
  }
  return (
    <div className="divide-y divide-charcoal/10 rounded-[.45rem] border border-charcoal/12 bg-white md:hidden">
      {activeDays.map((day) => {
        const dayEvents = events.filter((event) => isDateWithin(day, event.start, event.end));
        return (
          <section key={day} className="grid grid-cols-[5.5rem_1fr] gap-3 p-4">
            <time dateTime={day} className="text-xs font-bold text-charcoal">{shortDayLabel(day)}</time>
            <div className="space-y-2">
              {dayEvents.map((event) => (
                <Link key={`${event.type}-${event.id}`} href={event.href} className="grid min-h-14 grid-cols-[auto_1fr_auto] items-center gap-3 rounded-[.4rem] border border-charcoal/10 bg-[#f8f8f5] px-3 py-2">
                  <span className={`flex size-8 items-center justify-center rounded-full ${eventTone(event.tone)}`}>{event.type === "block" ? <Ban className="size-3.5" aria-hidden="true" /> : <CalendarDays className="size-3.5" aria-hidden="true" />}</span>
                  <span className="min-w-0"><span className="block truncate text-xs font-bold">{event.title}</span><span className="mt-1 block truncate text-[.64rem] text-ink-soft">{event.subtitle}</span></span>
                  <MoveRight className="size-4 text-charcoal/35" aria-hidden="true" />
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

export function CalendarBoard({
  calendar,
  month,
  basePath,
  propertyId,
  compact = false,
  title = "Kalender operasional",
}: {
  calendar: PmsCalendarData;
  month: string;
  basePath: string;
  propertyId?: string;
  compact?: boolean;
  title?: string;
}) {
  const days = calendarDays(month);
  const events = toEvents(calendar, month);
  const today = todayInTimeZone();
  const previous = hrefFor(basePath, shiftMonth(month, -1), propertyId);
  const next = hrefFor(basePath, shiftMonth(month, 1), propertyId);
  const current = hrefFor(basePath, today, propertyId);

  return (
    <section className="overflow-hidden rounded-[.65rem] border border-charcoal/12 bg-white shadow-[0_18px_55px_-44px_rgba(45,43,39,.65)]" aria-label={title}>
      <header className="flex flex-col gap-4 border-b border-charcoal/10 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <p className="kicker text-umber">{title}</p>
          <h2 className="mt-2 font-serif text-3xl capitalize">{monthLabel(month)}</h2>
        </div>
        <div className="flex items-center gap-2">
          <Link href={previous} aria-label="Bulan sebelumnya" className="flex size-11 items-center justify-center rounded-full border border-charcoal/12 hover:bg-charcoal/[.045]"><ChevronLeft className="size-4" aria-hidden="true" /></Link>
          <Link href={current} className="flex min-h-11 items-center justify-center rounded-full border border-charcoal/12 px-4 text-xs font-bold hover:bg-charcoal/[.045]">Hari ini</Link>
          <Link href={next} aria-label="Bulan berikutnya" className="flex size-11 items-center justify-center rounded-full border border-charcoal/12 hover:bg-charcoal/[.045]"><ChevronRight className="size-4" aria-hidden="true" /></Link>
        </div>
      </header>

      <div className="hidden grid-cols-7 border-b border-charcoal/10 bg-[#f8f8f5] md:grid">
        {weekdays.map((day) => <div key={day} className="border-r border-charcoal/8 px-3 py-2 text-center text-[.62rem] font-bold tracking-[.08em] text-ink-soft uppercase last:border-r-0">{day}</div>)}
      </div>
      <div role="grid" className="hidden grid-cols-7 md:grid">
        {days.map((day) => {
          const dayEvents = events.filter((event) => isDateWithin(day, event.start, event.end));
          const visible = dayEvents.slice(0, compact ? 2 : 3);
          const currentMonth = isSameMonth(day, month);
          return (
            <div
              key={day}
              role="gridcell"
              aria-label={shortDayLabel(day)}
              className={`${compact ? "min-h-24" : "min-h-32"} border-b border-r border-charcoal/8 p-2 last:border-r-0 ${currentMonth ? "bg-white" : "bg-charcoal/[.022] text-charcoal/38"}`}
            >
              <time dateTime={day} className={`flex size-7 items-center justify-center rounded-full text-[.68rem] font-bold ${day === today ? "bg-charcoal text-ivory" : ""}`}>{Number(day.slice(-2))}</time>
              <div className="mt-2 space-y-1">
                {visible.map((event) => <EventChip key={`${event.type}-${event.id}`} event={event} dense />)}
                {dayEvents.length > visible.length ? <p className="px-1 text-[.6rem] font-semibold text-ink-soft">+{dayEvents.length - visible.length} lainnya</p> : null}
              </div>
            </div>
          );
        })}
      </div>
      <div className="p-3 sm:p-4 md:hidden"><MobileAgenda events={events} days={days} /></div>

      <footer className="flex flex-wrap items-center gap-3 border-t border-charcoal/10 bg-[#f8f8f5] px-4 py-3 text-[.64rem] text-ink-soft sm:px-6">
        <span className="inline-flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-[#43704f]" />Terkonfirmasi</span>
        <span className="inline-flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-olive" />Menginap</span>
        <span className="inline-flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-[#a3721f]" />Tentatif / maintenance</span>
        <span className="inline-flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-[#765b8d]" />Owner use</span>
        <span className="ml-auto inline-flex items-center gap-1.5"><Clock3 className="size-3.5" aria-hidden="true" />Rentang checkout tidak dihitung sebagai malam</span>
      </footer>
    </section>
  );
}

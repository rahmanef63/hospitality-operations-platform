import Link from "next/link";
import { CalendarDays, Plus, ReceiptText } from "lucide-react";
import {
  formatCurrency,
  formatPmsDate,
  type PmsBookingData,
  type PmsCalendarData,
  type PmsCatalog,
} from "@/shared/pms";
import type { PmsFormAction, PmsPageState } from "../types";
import { CalendarBoard } from "./calendar-board";
import { CollectionSearch } from "./collection-search";
import { CreatePanel, EmptyState, RecordPanel } from "./manager-primitives";
import { PageHeader } from "./page-header";
import { PmsIcon } from "./pms-icon";
import { ReservationForm } from "./reservation-form";
import { StatusBanner } from "./status-banner";
import { StatusPill } from "./status-pill";
import { reservationStatusOptions } from "./ui-options";

export function ReservationManager({
  catalog,
  booking,
  calendar,
  month,
  propertyId,
  today,
  openCreate,
  state,
  backendError,
  formAction,
}: {
  catalog: PmsCatalog;
  booking: PmsBookingData;
  calendar: PmsCalendarData;
  month: string;
  propertyId?: string;
  today: string;
  openCreate: boolean;
  state: PmsPageState;
  backendError: boolean;
  formAction: PmsFormAction;
}) {
  const ready = catalog.properties.length > 0 && booking.guests.length > 0;
  const outstanding = booking.reservations.reduce((sum, reservation) => sum + reservation.outstandingAmount, 0);
  const active = booking.reservations.filter((reservation) => !["cancelled", "checked_out", "no_show"].includes(reservation.status)).length;
  const returnParams = new URLSearchParams({ month: month.slice(0, 7) });
  if (propertyId) returnParams.set("property", propertyId);
  const returnTo = `/admin/reservations?${returnParams.toString()}`;

  return (
    <div className="pb-20">
      <PageHeader
        eyebrow="Bookings"
        title="Reservasi yang menghitung dirinya sendiri."
        description="Pilih akomodasi seperti tag, masukkan tanggal dan harga per malam, lalu subtotal, total, mata uang, serta saldo dihitung konsisten oleh UI dan backend."
        action={(
          <div className="flex flex-wrap gap-2">
            <Link href="/admin/calendar" className="cta-outline"><CalendarDays className="size-4" aria-hidden="true" />Kalender</Link>
            {booking.guests.length ? <Link href="?new=1#new-reservation" className="cta-solid"><Plus className="size-4" aria-hidden="true" />Reservasi baru</Link> : <Link href="/admin/guests?new=1" className="cta-solid">Tambah tamu dahulu</Link>}
          </div>
        )}
      />
      <div className="mx-auto max-w-[92rem] space-y-8 px-4 pt-8 sm:px-8 lg:px-12">
        <StatusBanner status={state.status} error={state.error || (backendError ? "service" : undefined)} />

        <section className="grid gap-px overflow-hidden rounded-[.55rem] border border-charcoal/12 bg-charcoal/10 sm:grid-cols-3">
          <article className="bg-white p-5"><p className="kicker text-umber">Aktif</p><p className="mt-3 font-serif text-4xl">{active}</p><p className="mt-2 text-xs text-ink-soft">Inquiry hingga sedang menginap</p></article>
          <article className="bg-white p-5"><p className="kicker text-umber">Total ledger</p><p className="mt-3 font-serif text-4xl">{booking.reservations.length}</p><p className="mt-2 text-xs text-ink-soft">Termasuk reservasi selesai dan batal</p></article>
          <article className="bg-white p-5"><p className="kicker text-umber">Belum dibayar</p><p className="mt-3 font-serif text-4xl">{formatCurrency(outstanding)}</p><p className="mt-2 text-xs text-ink-soft">Dari transaksi completed yang tertaut</p></article>
        </section>

        <CalendarBoard calendar={calendar} month={month} basePath="/admin/reservations" propertyId={propertyId} compact title="Booking calendar" />

        <div id="new-reservation">
          {ready ? (
            <CreatePanel
              title="Buat reservasi"
              description="Akomodasi, harga dasar, mata uang, malam, subtotal, dan total saling terhubung otomatis."
              icon="booking"
              open={openCreate}
            >
              <ReservationForm catalog={catalog} booking={booking} action={formAction} today={today} returnTo={returnTo} />
            </CreatePanel>
          ) : (
            <EmptyState title="Reservasi belum dapat dibuat" action={<Link href="/admin/guests?new=1" className="cta-solid">Tambah tamu</Link>}>
              Tambahkan minimal satu properti dan satu tamu. Sistem tidak membuat data contoh untuk mengisi kekosongan.
            </EmptyState>
          )}
        </div>

        <section className="overflow-hidden rounded-[.55rem] border border-charcoal/12 bg-white">
          <header className="flex flex-col gap-3 border-b border-charcoal/10 px-5 py-5 sm:flex-row sm:items-end sm:justify-between sm:px-7">
            <div><p className="kicker text-umber">Reservation ledger</p><h2 className="mt-2 font-serif text-3xl">{booking.reservations.length} reservasi</h2></div>
            <p className="max-w-md text-xs leading-5 text-ink-soft">Cari berdasarkan tamu, referensi, properti, unit, atau status. Buka satu baris untuk mengedit tanpa kehilangan konteks halaman.</p>
          </header>
          <div className="p-3 sm:p-4"><CollectionSearch targetId="reservation-ledger" placeholder="Cari tamu, referensi, atau akomodasi…" filters={reservationStatusOptions} /></div>
          <div id="reservation-ledger" className="border-t border-charcoal/10">
            {booking.reservations.length ? booking.reservations.map((reservation) => (
              <RecordPanel
                key={reservation.id}
                id={`reservation-${reservation.id}`}
                title={`${reservation.guestName} · ${reservation.reference}`}
                meta={`${reservation.propertyName}${reservation.unitName ? ` · ${reservation.unitName}` : " · whole property"} · ${formatPmsDate(reservation.checkIn)}–${formatPmsDate(reservation.checkOut)} · ${reservation.nights} malam · sisa ${formatCurrency(reservation.outstandingAmount, reservation.currency)}`}
                searchText={`${reservation.guestName} ${reservation.reference} ${reservation.externalReference ?? ""} ${reservation.propertyName} ${reservation.unitName ?? ""} ${reservation.status} ${reservation.source}`}
                status={reservation.status}
                leading={<PmsIcon name="booking" />}
                trailing={<StatusPill value={reservation.status} options={reservationStatusOptions} />}
              >
                <ReservationForm reservation={reservation} catalog={catalog} booking={booking} action={formAction} today={today} returnTo={returnTo} />
              </RecordPanel>
            )) : <div className="p-4 sm:p-6"><EmptyState title="Belum ada reservasi"><span>Buat reservasi pertama setelah data tamu tersedia.</span></EmptyState></div>}
          </div>
        </section>

        <div className="flex items-start gap-3 rounded-[.45rem] border border-charcoal/10 bg-white p-4 text-xs leading-6 text-ink-soft">
          <ReceiptText className="mt-0.5 size-4 shrink-0 text-olive" aria-hidden="true" />
          Pembayaran tidak mengubah total reservasi. Catat pembayaran, refund, atau biaya di modul Keuangan agar saldo dan audit trail tetap dapat direkonsiliasi.
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";
import { CalendarPlus, MoveRight, Plus } from "lucide-react";
import {
  formatPmsDate,
  type PmsCalendarData,
  type PmsCatalog,
} from "@/shared/pms";
import type { PmsFormAction, PmsPageState } from "../types";
import { BlockForm } from "./block-form";
import { CalendarBoard } from "./calendar-board";
import { CollectionSearch } from "./collection-search";
import { Field, TextInput } from "./form-controls";
import { CreatePanel, EmptyState, RecordPanel } from "./manager-primitives";
import { PageHeader } from "./page-header";
import { PmsIcon } from "./pms-icon";
import { StatusBanner } from "./status-banner";
import { StatusPill } from "./status-pill";
import { TagSelect } from "./tag-select";
import { blockReasonOptions, reservationStatusOptions, type PmsSelectOption } from "./ui-options";

function propertyFilterOptions(catalog: PmsCatalog): PmsSelectOption[] {
  return [
    { value: "", label: "Semua properti", icon: "building", tone: "neutral" },
    ...catalog.properties.map((property) => ({ value: property.id, label: property.name, description: property.locationLabel, icon: "house" as const, tone: "olive" as const })),
  ];
}

export function CalendarManager({
  catalog,
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
  calendar: PmsCalendarData;
  month: string;
  propertyId?: string;
  today: string;
  openCreate: boolean;
  state: PmsPageState;
  backendError: boolean;
  formAction: PmsFormAction;
}) {
  const returnParams = new URLSearchParams({ month: month.slice(0, 7) });
  if (propertyId) returnParams.set("property", propertyId);
  const returnTo = `/admin/calendar?${returnParams.toString()}`;
  return (
    <div className="pb-20">
      <PageHeader
        eyebrow="Availability"
        title="Satu kalender untuk semua inventori."
        description="Lihat reservasi dan blok pada grid bulan yang sama. Whole-property block otomatis menutup unit di bawahnya, dengan overlap tetap divalidasi oleh Convex."
        action={<Link href="?new=1#new-block" className="cta-solid"><CalendarPlus className="size-4" aria-hidden="true" />Blokir tanggal</Link>}
      />
      <div className="mx-auto max-w-[92rem] space-y-8 px-4 pt-8 sm:px-8 lg:px-12">
        <StatusBanner status={state.status} error={state.error || (backendError ? "service" : undefined)} />

        <form method="get" className="grid gap-4 rounded-[.55rem] border border-charcoal/12 bg-white p-4 sm:grid-cols-[minmax(0,1fr)_13rem_auto] sm:items-end sm:p-5">
          <Field label="Properti"><TagSelect name="property" options={propertyFilterOptions(catalog)} defaultValue={propertyId ?? ""} /></Field>
          <Field label="Bulan"><TextInput name="month" type="month" defaultValue={month.slice(0, 7)} /></Field>
          <button type="submit" className="cta-solid">Terapkan tampilan</button>
        </form>

        <CalendarBoard calendar={calendar} month={month} basePath="/admin/calendar" propertyId={propertyId} title="Availability calendar" />

        <div id="new-block">
          {catalog.properties.length ? (
            <CreatePanel title="Blokir tanggal" description="Pilih akomodasi dan alasan, lalu tentukan rentang. Sistem mencegah benturan dengan reservasi aktif." icon="calendar" open={openCreate}>
              <BlockForm catalog={catalog} action={formAction} today={today} returnTo={returnTo} />
            </CreatePanel>
          ) : <EmptyState title="Belum ada properti">Tambahkan properti sebelum membuat availability block.</EmptyState>}
        </div>

        <section className="grid gap-6 xl:grid-cols-2">
          <div className="overflow-hidden rounded-[.55rem] border border-charcoal/12 bg-white">
            <header className="border-b border-charcoal/10 px-5 py-5 sm:px-7"><p className="kicker text-umber">Bookings</p><h2 className="mt-2 font-serif text-3xl">{calendar.reservations.length} reservasi pada grid</h2></header>
            <div className="divide-y divide-charcoal/10">
              {calendar.reservations.length ? calendar.reservations.map((reservation) => (
                <Link key={reservation.id} href={`/admin/reservations#reservation-${reservation.id}`} className="grid min-h-20 grid-cols-[auto_1fr_auto] items-center gap-3 px-5 py-4 transition hover:bg-charcoal/[.025] sm:px-7">
                  <span className="flex size-10 items-center justify-center rounded-full bg-olive/10 text-olive"><PmsIcon name="booking" /></span>
                  <span className="min-w-0"><span className="block truncate text-sm font-bold">{reservation.guestName}</span><span className="mt-1 block truncate text-xs text-ink-soft">{reservation.propertyName} · {formatPmsDate(reservation.checkIn)}–{formatPmsDate(reservation.checkOut)} · {reservation.nights} malam</span></span>
                  <span className="flex items-center gap-2"><StatusPill value={reservation.status} options={reservationStatusOptions} /><MoveRight className="size-4 text-charcoal/32" aria-hidden="true" /></span>
                </Link>
              )) : <div className="p-5"><EmptyState title="Tidak ada reservasi">Tidak ada reservasi dalam rentang grid bulan ini.</EmptyState></div>}
            </div>
          </div>

          <div className="overflow-hidden rounded-[.55rem] border border-charcoal/12 bg-white">
            <header className="border-b border-charcoal/10 px-5 py-5 sm:px-7"><p className="kicker text-umber">Blocked inventory</p><h2 className="mt-2 font-serif text-3xl">{calendar.blocks.length} availability block</h2></header>
            <div className="p-3"><CollectionSearch targetId="availability-blocks" placeholder="Cari blok atau properti…" filters={blockReasonOptions} /></div>
            <div id="availability-blocks" className="border-t border-charcoal/10">
              {calendar.blocks.length ? calendar.blocks.map((block) => (
                <RecordPanel
                  key={block.id}
                  id={`block-${block.id}`}
                  title={block.title}
                  meta={`${block.propertyName}${block.unitName ? ` · ${block.unitName}` : " · whole property"} · ${formatPmsDate(block.startDate)}–${formatPmsDate(block.endDate)}`}
                  searchText={`${block.title} ${block.propertyName} ${block.unitName ?? ""} ${block.reason}`}
                  status={block.reason}
                  leading={<PmsIcon name="calendar" />}
                  trailing={<StatusPill value={block.reason} options={blockReasonOptions} />}
                >
                  <BlockForm block={block} catalog={catalog} action={formAction} today={today} returnTo={returnTo} />
                </RecordPanel>
              )) : <div className="p-5"><EmptyState title="Tidak ada blok"><span>Inventori tidak memiliki blok pada rentang ini.</span></EmptyState></div>}
            </div>
          </div>
        </section>

        <Link href="/admin/reservations?new=1#new-reservation" className="flex min-h-14 items-center justify-between gap-4 rounded-[.45rem] border border-charcoal/12 bg-charcoal px-5 text-sm font-semibold text-ivory transition hover:bg-olive">
          <span className="flex items-center gap-3"><Plus className="size-4" aria-hidden="true" />Buat reservasi dari tanggal yang sudah diperiksa</span><MoveRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}

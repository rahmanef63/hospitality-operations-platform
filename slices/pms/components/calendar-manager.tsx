import {
  BLOCK_REASONS,
  formatPmsDate,
  humanize,
  type PmsAvailabilityBlock,
  type PmsCalendarData,
  type PmsCatalog,
} from "@/shared/pms";
import type { PmsFormAction, PmsPageState } from "../types";
import { Field, SelectInput, TextArea, TextInput } from "./form-controls";
import { CreatePanel, EmptyState, FormActions, RecordPanel } from "./manager-primitives";
import { PageHeader } from "./page-header";
import { StatusBanner } from "./status-banner";

function BlockForm({ block, catalog, action }: { block?: PmsAvailabilityBlock; catalog: PmsCatalog; action: PmsFormAction }) {
  const propertyId = block?.propertyId ?? catalog.properties[0]?.id ?? "";
  return (
    <form action={action}>
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        <Field label="Properti">
          <SelectInput name="propertyId" defaultValue={propertyId} required>
            {catalog.properties.map((property) => <option key={property.id} value={property.id}>{property.name}</option>)}
          </SelectInput>
        </Field>
        <Field label="Unit (opsional)">
          <SelectInput name="unitId" defaultValue={block?.unitId ?? ""}>
            <option value="">Blok seluruh properti</option>
            {catalog.units.map((unit) => <option key={unit.id} value={unit.id}>{unit.propertyName} · {unit.name}</option>)}
          </SelectInput>
        </Field>
        <Field label="Judul"><TextInput name="title" defaultValue={block?.title} required maxLength={100} placeholder="Perawatan kolam" /></Field>
        <Field label="Alasan">
          <SelectInput name="reason" defaultValue={block?.reason ?? "maintenance"}>
            {BLOCK_REASONS.map((item) => <option key={item} value={item}>{humanize(item)}</option>)}
          </SelectInput>
        </Field>
        <Field label="Mulai"><TextInput name="startDate" type="date" defaultValue={block?.startDate} required /></Field>
        <Field label="Selesai"><TextInput name="endDate" type="date" defaultValue={block?.endDate} required /></Field>
        <Field label="Catatan" className="sm:col-span-2 xl:col-span-3"><TextArea name="notes" defaultValue={block?.notes} maxLength={1000} /></Field>
      </div>
      <FormActions action={action} operation="block.upsert" archiveOperation="block.archive" returnTo="/admin/calendar" id={block?.id} />
    </form>
  );
}

export function CalendarManager({
  catalog,
  calendar,
  range,
  propertyId,
  state,
  backendError,
  formAction,
}: {
  catalog: PmsCatalog;
  calendar: PmsCalendarData;
  range: { start: string; end: string };
  propertyId?: string;
  state: PmsPageState;
  backendError: boolean;
  formAction: PmsFormAction;
}) {
  return (
    <div className="pb-20">
      <PageHeader
        eyebrow="Availability"
        title="Kalender yang mencegah tanggal bertabrakan."
        description="Reservasi tentatif, terkonfirmasi, dan sedang menginap akan memblokir inventori. Owner use, maintenance, atau penutupan dapat dicatat sebagai availability block."
      />
      <div className="mx-auto max-w-[92rem] space-y-8 px-4 pt-8 sm:px-8 lg:px-12">
        <StatusBanner status={state.status} error={state.error || (backendError ? "service" : undefined)} />
        <form method="get" className="grid gap-4 border border-charcoal/12 bg-white p-5 sm:grid-cols-2 xl:grid-cols-[1fr_1fr_1fr_auto] xl:items-end sm:p-7">
          <Field label="Properti">
            <SelectInput name="property" defaultValue={propertyId ?? ""}>
              <option value="">Semua properti</option>
              {catalog.properties.map((property) => <option key={property.id} value={property.id}>{property.name}</option>)}
            </SelectInput>
          </Field>
          <Field label="Mulai"><TextInput name="start" type="date" defaultValue={range.start} /></Field>
          <Field label="Selesai"><TextInput name="end" type="date" defaultValue={range.end} /></Field>
          <button type="submit" className="cta-solid">Terapkan filter</button>
        </form>

        {catalog.properties.length ? <CreatePanel title="Blokir tanggal"><BlockForm catalog={catalog} action={formAction} /></CreatePanel> : null}

        <section className="grid gap-6 xl:grid-cols-2">
          <div className="border border-charcoal/12 bg-white">
            <header className="border-b border-charcoal/12 px-5 py-5 sm:px-7">
              <p className="kicker text-umber">Bookings</p>
              <h2 className="mt-3 font-serif text-3xl">Reservasi pada rentang ini</h2>
            </header>
            {calendar.reservations.length ? (
              <div className="divide-y divide-charcoal/10">
                {calendar.reservations.map((reservation) => (
                  <article key={reservation.id} className="px-5 py-5 sm:px-7">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold">{reservation.guestName}</p>
                        <p className="mt-1 text-xs text-ink-soft">{reservation.propertyName} · {reservation.reference}</p>
                      </div>
                      <span className="border border-charcoal/15 px-2 py-1 text-[.62rem] font-semibold tracking-[.08em] uppercase">{humanize(reservation.status)}</span>
                    </div>
                    <p className="mt-4 text-sm">{formatPmsDate(reservation.checkIn)} → {formatPmsDate(reservation.checkOut)} · {reservation.nights} malam</p>
                  </article>
                ))}
              </div>
            ) : <EmptyState>Tidak ada reservasi pada rentang yang dipilih.</EmptyState>}
          </div>

          <div className="border border-charcoal/12 bg-white">
            <header className="border-b border-charcoal/12 px-5 py-5 sm:px-7">
              <p className="kicker text-umber">Blocked inventory</p>
              <h2 className="mt-3 font-serif text-3xl">Availability block</h2>
            </header>
            {calendar.blocks.length ? calendar.blocks.map((block) => (
              <RecordPanel key={block.id} title={block.title} meta={`${block.propertyName} · ${formatPmsDate(block.startDate)}–${formatPmsDate(block.endDate)} · ${humanize(block.reason)}`}>
                <BlockForm block={block} catalog={catalog} action={formAction} />
              </RecordPanel>
            )) : <EmptyState>Tidak ada tanggal yang diblokir pada rentang ini.</EmptyState>}
          </div>
        </section>
      </div>
    </div>
  );
}

import Link from "next/link";
import {
  RESERVATION_SOURCES,
  RESERVATION_STATUSES,
  formatCurrency,
  formatPmsDate,
  humanize,
  type PmsBookingData,
  type PmsCatalog,
  type PmsReservation,
} from "@/shared/pms";
import type { PmsFormAction, PmsPageState } from "../types";
import { Field, SelectInput, TextArea, TextInput } from "./form-controls";
import { CreatePanel, EmptyState, FormActions, RecordPanel } from "./manager-primitives";
import { PageHeader } from "./page-header";
import { StatusBanner } from "./status-banner";

function ReservationForm({ reservation, catalog, booking, action }: {
  reservation?: PmsReservation; catalog: PmsCatalog; booking: PmsBookingData; action: PmsFormAction;
}) {
  const propertyId = reservation?.propertyId ?? catalog.properties[0]?.id ?? "";
  return (
    <form action={action}>
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <Field label="Properti">
          <SelectInput name="propertyId" defaultValue={propertyId} required>
            {catalog.properties.map((property) => <option key={property.id} value={property.id}>{property.name}</option>)}
          </SelectInput>
        </Field>
        <Field label="Unit (opsional)">
          <SelectInput name="unitId" defaultValue={reservation?.unitId ?? ""}>
            <option value="">Whole property / belum ditentukan</option>
            {catalog.units.map((unit) => <option key={unit.id} value={unit.id}>{unit.propertyName} · {unit.name}</option>)}
          </SelectInput>
        </Field>
        <Field label="Tamu">
          <SelectInput name="guestId" defaultValue={reservation?.guestId ?? booking.guests[0]?.id ?? ""} required>
            {booking.guests.map((guest) => <option key={guest.id} value={guest.id}>{guest.fullName}</option>)}
          </SelectInput>
        </Field>
        <Field label="Referensi eksternal"><TextInput name="externalReference" defaultValue={reservation?.externalReference} maxLength={100} /></Field>
        <Field label="Status">
          <SelectInput name="status" defaultValue={reservation?.status ?? "inquiry"}>
            {RESERVATION_STATUSES.map((item) => <option key={item} value={item}>{humanize(item)}</option>)}
          </SelectInput>
        </Field>
        <Field label="Sumber">
          <SelectInput name="source" defaultValue={reservation?.source ?? "direct"}>
            {RESERVATION_SOURCES.map((item) => <option key={item} value={item}>{humanize(item)}</option>)}
          </SelectInput>
        </Field>
        <Field label="Check-in"><TextInput name="checkIn" type="date" defaultValue={reservation?.checkIn} required /></Field>
        <Field label="Check-out"><TextInput name="checkOut" type="date" defaultValue={reservation?.checkOut} required /></Field>
        <Field label="Dewasa"><TextInput name="adults" type="number" min={0} defaultValue={reservation?.adults} /></Field>
        <Field label="Anak"><TextInput name="children" type="number" min={0} defaultValue={reservation?.children} /></Field>
        <Field label="Harga / malam"><TextInput name="nightlyRate" type="number" min={0} defaultValue={reservation?.nightlyRate} /></Field>
        <Field label="Akomodasi"><TextInput name="accommodationAmount" type="number" min={0} defaultValue={reservation?.accommodationAmount} /></Field>
        <Field label="Biaya tambahan"><TextInput name="extraFees" type="number" min={0} defaultValue={reservation?.extraFees} /></Field>
        <Field label="Diskon"><TextInput name="discountAmount" type="number" min={0} defaultValue={reservation?.discountAmount} /></Field>
        <Field label="Total"><TextInput name="totalAmount" type="number" min={0} defaultValue={reservation?.totalAmount} /></Field>
        <Field label="Mata uang"><TextInput name="currency" defaultValue={reservation?.currency ?? "IDR"} required maxLength={3} /></Field>
        <Field label="Catatan" className="sm:col-span-2 xl:col-span-4"><TextArea name="notes" defaultValue={reservation?.notes} maxLength={2000} /></Field>
      </div>
      <FormActions action={action} operation="reservation.upsert" archiveOperation="reservation.archive" returnTo="/admin/reservations" id={reservation?.id} />
    </form>
  );
}

export function ReservationManager({ catalog, booking, state, backendError, formAction }: {
  catalog: PmsCatalog; booking: PmsBookingData; state: PmsPageState; backendError: boolean; formAction: PmsFormAction;
}) {
  const ready = catalog.properties.length > 0 && booking.guests.length > 0;
  return (
    <div className="pb-20">
      <PageHeader
        eyebrow="Bookings"
        title="Reservasi dengan inventori dan saldo yang jelas."
        description="Status tentatif, terkonfirmasi, dan check-in memblokir tanggal secara otomatis. Sistem mencegah benturan reservasi serta availability block pada inventori yang sama."
        action={!booking.guests.length ? <Link href="/admin/guests" className="cta-solid">Tambah tamu dahulu</Link> : undefined}
      />
      <div className="mx-auto max-w-[92rem] space-y-8 px-4 pt-8 sm:px-8 lg:px-12">
        <StatusBanner status={state.status} error={state.error || (backendError ? "service" : undefined)} />
        {ready ? <CreatePanel title="Buat reservasi"><ReservationForm catalog={catalog} booking={booking} action={formAction} /></CreatePanel> : null}
        <section className="border border-charcoal/12 bg-white">
          <header className="border-b border-charcoal/12 px-5 py-5 sm:px-7"><p className="kicker text-umber">Reservation ledger</p><h2 className="mt-3 font-serif text-3xl">{booking.reservations.length} reservasi</h2></header>
          {booking.reservations.length ? booking.reservations.map((reservation) => (
            <RecordPanel
              key={reservation.id}
              title={`${reservation.guestName} · ${reservation.reference}`}
              meta={`${reservation.propertyName} · ${formatPmsDate(reservation.checkIn)}–${formatPmsDate(reservation.checkOut)} · ${humanize(reservation.status)} · saldo ${formatCurrency(reservation.outstandingAmount, reservation.currency)}`}
            >
              <ReservationForm reservation={reservation} catalog={catalog} booking={booking} action={formAction} />
            </RecordPanel>
          )) : <EmptyState>Belum ada reservasi. Buat data tamu dan properti terlebih dahulu.</EmptyState>}
        </section>
      </div>
    </div>
  );
}

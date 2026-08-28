import { UNIT_STATUSES, UNIT_TYPES, humanize, type PmsCatalog, type PmsUnit } from "@/shared/pms";
import type { PmsFormAction, PmsPageState } from "../types";
import { Checkbox, Field, SelectInput, TextArea, TextInput } from "./form-controls";
import { CreatePanel, EmptyState, FormActions, RecordPanel } from "./manager-primitives";
import { PageHeader } from "./page-header";
import { StatusBanner } from "./status-banner";

function UnitForm({ unit, catalog, action }: { unit?: PmsUnit; catalog: PmsCatalog; action: PmsFormAction }) {
  const propertyId = unit?.propertyId ?? catalog.properties[0]?.id ?? "";
  return (
    <form action={action}>
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        <Field label="Properti">
          <SelectInput name="propertyId" defaultValue={propertyId} required>
            {catalog.properties.map((property) => <option key={property.id} value={property.id}>{property.name}</option>)}
          </SelectInput>
        </Field>
        <Field label="Kode unit"><TextInput name="code" defaultValue={unit?.code} required maxLength={24} placeholder="VILLA-01" /></Field>
        <Field label="Nama unit"><TextInput name="name" defaultValue={unit?.name} required maxLength={100} /></Field>
        <Field label="Jenis unit">
          <SelectInput name="unitType" defaultValue={unit?.unitType ?? "room"}>
            {UNIT_TYPES.map((item) => <option key={item} value={item}>{humanize(item)}</option>)}
          </SelectInput>
        </Field>
        <Field label="Status">
          <SelectInput name="status" defaultValue={unit?.status ?? "active"}>
            {UNIT_STATUSES.map((item) => <option key={item} value={item}>{humanize(item)}</option>)}
          </SelectInput>
        </Field>
        <Field label="Kamar tidur"><TextInput name="bedroomCount" type="number" min={0} defaultValue={unit?.bedroomCount} /></Field>
        <Field label="Kamar mandi"><TextInput name="bathroomCount" type="number" min={0} defaultValue={unit?.bathroomCount} /></Field>
        <Field label="Kapasitas tamu"><TextInput name="maxGuests" type="number" min={0} defaultValue={unit?.maxGuests} /></Field>
        <Field label="Harga dasar / malam"><TextInput name="baseNightlyRate" type="number" min={0} defaultValue={unit?.baseNightlyRate} /></Field>
        <div className="sm:col-span-2 xl:col-span-3"><Checkbox name="bookable" label="Unit dapat dipesan" defaultChecked={unit?.bookable ?? true} /></div>
        <Field label="Catatan" className="sm:col-span-2 xl:col-span-3"><TextArea name="notes" defaultValue={unit?.notes} maxLength={2000} /></Field>
      </div>
      <FormActions action={action} operation="unit.upsert" archiveOperation="unit.archive" returnTo="/admin/units" id={unit?.id} />
    </form>
  );
}

export function UnitManager({ catalog, state, backendError, formAction }: {
  catalog: PmsCatalog; state: PmsPageState; backendError: boolean; formAction: PmsFormAction;
}) {
  return (
    <div className="pb-20">
      <PageHeader
        eyebrow="Inventory"
        title="Unit dan ruang yang dapat dipesan."
        description="Gunakan unit untuk whole-villa inventory, kamar yang dijual terpisah, suite, atau properti multi-unit. Tiga kamar Ruma Kamyna saat ini dicatat sebagai fakta properti, bukan otomatis sebagai unit terpisah."
      />
      <div className="mx-auto max-w-[92rem] space-y-8 px-4 pt-8 sm:px-8 lg:px-12">
        <StatusBanner status={state.status} error={state.error || (backendError ? "service" : undefined)} />
        {catalog.properties.length ? <CreatePanel title="Tambah unit"><UnitForm catalog={catalog} action={formAction} /></CreatePanel> : null}
        <section className="border border-charcoal/12 bg-white">
          <header className="border-b border-charcoal/12 px-5 py-5 sm:px-7"><p className="kicker text-umber">Inventory</p><h2 className="mt-3 font-serif text-3xl">{catalog.units.length} unit</h2></header>
          {catalog.units.length ? catalog.units.map((unit) => (
            <RecordPanel key={unit.id} title={unit.name} meta={`${unit.propertyName} · ${unit.code} · ${humanize(unit.status)}`}>
              <UnitForm unit={unit} catalog={catalog} action={formAction} />
            </RecordPanel>
          )) : <EmptyState>Belum ada unit terpisah. Tambahkan whole-villa atau kamar hanya ketika model penjualannya sudah ditentukan.</EmptyState>}
        </section>
      </div>
    </div>
  );
}

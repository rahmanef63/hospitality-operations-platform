import Link from "next/link";
import { BedDouble, CircleOff, Plus, Tags } from "lucide-react";
import { formatCurrency, type PmsCatalog, type PmsUnit } from "@/shared/pms";
import type { PmsFormAction, PmsPageState } from "../types";
import { CollectionSearch } from "./collection-search";
import { Checkbox, Field, TextArea, TextInput } from "./form-controls";
import { FormSection } from "./form-section";
import { CreatePanel, EmptyState, FormActions, RecordPanel } from "./manager-primitives";
import { PageHeader } from "./page-header";
import { PmsIcon } from "./pms-icon";
import { propertyOptions } from "./property-options";
import { StatusBanner } from "./status-banner";
import { StatusPill } from "./status-pill";
import { TagSelect } from "./tag-select";
import { unitStatusOptions, unitTypeOptions } from "./ui-options";

function UnitForm({ unit, catalog, action }: { unit?: PmsUnit; catalog: PmsCatalog; action: PmsFormAction }) {
  const propertyId = unit?.propertyId ?? catalog.properties[0]?.id ?? "";
  const property = catalog.properties.find((item) => item.id === propertyId);
  return (
    <form action={action} className="space-y-6">
      <FormSection title="Identitas inventori" description="Gunakan unit hanya bila akomodasi memang dijual atau diblokir secara terpisah." icon="bed">
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          <Field label="Properti" required><TagSelect name="propertyId" options={propertyOptions(catalog)} defaultValue={propertyId} required /></Field>
          <Field label="Kode unit" required><TextInput name="code" defaultValue={unit?.code} required maxLength={24} placeholder="VILLA-01" /></Field>
          <Field label="Nama unit" required><TextInput name="name" defaultValue={unit?.name} required maxLength={100} placeholder="Whole Villa atau Garden Room" /></Field>
          <Field label="Jenis unit"><TagSelect name="unitType" options={unitTypeOptions} defaultValue={unit?.unitType ?? "room"} /></Field>
          <Field label="Status"><TagSelect name="status" options={unitStatusOptions} defaultValue={unit?.status ?? "active"} /></Field>
        </div>
      </FormSection>
      <FormSection title="Kapasitas dan harga" description="Harga unit mengalahkan harga dasar properti saat dipilih. Kosongkan bila ingin mengikuti harga properti." icon="wallet">
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <Field label="Kamar tidur"><TextInput name="bedroomCount" type="number" min={0} defaultValue={unit?.bedroomCount} /></Field>
          <Field label="Kamar mandi"><TextInput name="bathroomCount" type="number" min={0} defaultValue={unit?.bathroomCount} /></Field>
          <Field label="Kapasitas tamu"><TextInput name="maxGuests" type="number" min={0} defaultValue={unit?.maxGuests} /></Field>
          <Field label="Harga dasar / malam" hint={property?.baseNightlyRate === undefined ? "Properti juga belum memiliki harga dasar." : `Kosong = mengikuti ${formatCurrency(property.baseNightlyRate, property.currency)}`}><TextInput name="baseNightlyRate" type="number" min={0} defaultValue={unit?.baseNightlyRate} /></Field>
        </div>
      </FormSection>
      <FormSection title="Ketersediaan penjualan" description="Unit non-bookable tetap dapat disimpan untuk struktur internal, tetapi tidak muncul di pilihan reservasi." icon="check">
        <Checkbox name="bookable" label="Unit dapat dipesan" description="Tampilkan pada dropdown akomodasi dan public unit projection bila statusnya aktif." icon="booking" defaultChecked={unit?.bookable ?? true} />
      </FormSection>
      <FormSection title="Catatan internal" description="Catatan tidak dipublikasikan dan hanya digunakan oleh tim operasi." icon="message">
        <Field label="Catatan"><TextArea name="notes" defaultValue={unit?.notes} maxLength={2000} /></Field>
      </FormSection>
      <FormActions action={action} operation="unit.upsert" archiveOperation="unit.archive" returnTo="/admin/units" id={unit?.id} />
    </form>
  );
}

export function UnitManager({ catalog, openCreate, state, backendError, formAction }: {
  catalog: PmsCatalog;
  openCreate: boolean;
  state: PmsPageState;
  backendError: boolean;
  formAction: PmsFormAction;
}) {
  const active = catalog.units.filter((unit) => unit.status === "active").length;
  const bookable = catalog.units.filter((unit) => unit.status === "active" && unit.bookable).length;
  return (
    <div className="pb-20">
      <PageHeader
        eyebrow="Inventory"
        title="Unit yang jelas, bukan asumsi dari jumlah kamar."
        description="Whole villa, kamar, suite, dan ruang lain memiliki status, kapasitas, serta harga sendiri. Kamar tidur properti tidak otomatis menjadi unit terpisah."
        action={<Link href="?new=1#new-unit" className="cta-solid"><Plus className="size-4" aria-hidden="true" />Unit baru</Link>}
      />
      <div className="mx-auto max-w-[92rem] space-y-8 px-4 pt-8 sm:px-8 lg:px-12">
        <StatusBanner status={state.status} error={state.error || (backendError ? "service" : undefined)} />
        <section className="grid gap-px overflow-hidden rounded-[.55rem] border border-charcoal/12 bg-charcoal/10 sm:grid-cols-3">
          <article className="bg-white p-5"><BedDouble className="size-5 text-olive" aria-hidden="true" /><p className="kicker mt-5 text-umber">Total unit</p><p className="mt-2 font-serif text-4xl">{catalog.units.length}</p></article>
          <article className="bg-white p-5"><Tags className="size-5 text-olive" aria-hidden="true" /><p className="kicker mt-5 text-umber">Aktif</p><p className="mt-2 font-serif text-4xl">{active}</p></article>
          <article className="bg-white p-5"><CircleOff className="size-5 text-olive" aria-hidden="true" /><p className="kicker mt-5 text-umber">Bookable</p><p className="mt-2 font-serif text-4xl">{bookable}</p></article>
        </section>

        <div id="new-unit">
          {catalog.properties.length ? <CreatePanel title="Tambah unit" description="Buat hanya jika inventori ini benar-benar dikelola secara terpisah." icon="bed" open={openCreate}><UnitForm catalog={catalog} action={formAction} /></CreatePanel> : <EmptyState title="Belum ada properti" action={<Link href="/admin/properties?new=1" className="cta-solid">Tambah properti</Link>}>Unit harus berada di bawah properti.</EmptyState>}
        </div>

        <section className="overflow-hidden rounded-[.55rem] border border-charcoal/12 bg-white">
          <header className="border-b border-charcoal/10 px-5 py-5 sm:px-7"><p className="kicker text-umber">Inventory</p><h2 className="mt-2 font-serif text-3xl">{catalog.units.length} unit</h2></header>
          <div className="p-3 sm:p-4"><CollectionSearch targetId="unit-directory" placeholder="Cari unit, kode, properti, atau tipe…" filters={unitStatusOptions} /></div>
          <div id="unit-directory" className="border-t border-charcoal/10">
            {catalog.units.length ? catalog.units.map((unit) => {
              const property = catalog.properties.find((item) => item.id === unit.propertyId);
              const inherited = unit.baseNightlyRate ?? property?.baseNightlyRate;
              const rate = inherited === undefined ? "Harga belum diisi" : formatCurrency(inherited, property?.currency ?? "IDR");
              return (
                <RecordPanel
                  key={unit.id}
                  id={`unit-${unit.id}`}
                  title={unit.name}
                  meta={`${unit.propertyName} · ${unit.code} · ${unit.unitType.replaceAll("_", " ")} · ${rate}${unit.baseNightlyRate === undefined && inherited !== undefined ? " (dari properti)" : ""}`}
                  searchText={`${unit.name} ${unit.code} ${unit.propertyName} ${unit.unitType} ${unit.status} ${unit.bookable ? "bookable" : "not bookable"}`}
                  status={unit.status}
                  leading={<PmsIcon name={unit.unitType === "room" ? "bed" : unit.unitType === "apartment" ? "building" : "house"} />}
                  trailing={<div className="hidden items-center gap-2 sm:flex">{unit.bookable ? <StatusPill value="green" label="Bookable" tone="green" /> : <StatusPill value="neutral" label="Internal" tone="neutral" />}<StatusPill value={unit.status} options={unitStatusOptions} /></div>}
                >
                  <UnitForm unit={unit} catalog={catalog} action={formAction} />
                </RecordPanel>
              );
            }) : <div className="p-5"><EmptyState title="Belum ada unit terpisah">Whole-property reservasi tetap dapat dibuat langsung dari properti.</EmptyState></div>}
          </div>
        </section>
      </div>
    </div>
  );
}

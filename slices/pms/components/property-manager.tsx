import {
  PROPERTY_STATUSES,
  PROPERTY_TYPES,
  PUBLICATION_STATUSES,
  humanize,
  type PmsCatalog,
  type PmsProperty,
} from "@/shared/pms";
import type { PmsFormAction, PmsPageState } from "../types";
import { Field, SelectInput, TextArea, TextInput } from "./form-controls";
import { CreatePanel, EmptyState, FormActions, RecordPanel } from "./manager-primitives";
import { PageHeader } from "./page-header";
import { StatusBanner } from "./status-banner";

const emptyProperty = {
  slug: "",
  name: "",
  propertyType: "villa",
  status: "active",
  publicationStatus: "draft",
  countryCode: "ID",
  timezone: "Asia/Jakarta",
  currency: "IDR",
} as const;

function PropertyForm({ property, action }: { property?: PmsProperty; action: PmsFormAction }) {
  const value = { ...emptyProperty, ...property };
  return (
    <form action={action}>
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        <Field label="Nama properti"><TextInput name="name" defaultValue={value.name} required maxLength={100} /></Field>
        <Field label="Slug"><TextInput name="slug" defaultValue={value.slug} required maxLength={64} placeholder="nama-properti" /></Field>
        <Field label="Jenis properti">
          <SelectInput name="propertyType" defaultValue={value.propertyType}>
            {PROPERTY_TYPES.map((item) => <option key={item} value={item}>{humanize(item)}</option>)}
          </SelectInput>
        </Field>
        <Field label="Status operasional">
          <SelectInput name="status" defaultValue={value.status}>
            {PROPERTY_STATUSES.map((item) => <option key={item} value={item}>{humanize(item)}</option>)}
          </SelectInput>
        </Field>
        <Field label="Status publikasi">
          <SelectInput name="publicationStatus" defaultValue={value.publicationStatus}>
            {PUBLICATION_STATUSES.map((item) => <option key={item} value={item}>{humanize(item)}</option>)}
          </SelectInput>
        </Field>
        <Field label="Label lokasi"><TextInput name="locationLabel" defaultValue={value.locationLabel} maxLength={160} placeholder="Megamendung, Puncak Bogor" /></Field>
        <Field label="Alamat jalan" className="sm:col-span-2"><TextInput name="addressLine" defaultValue={value.addressLine} maxLength={240} /></Field>
        <Field label="Kota / kecamatan"><TextInput name="locality" defaultValue={value.locality} maxLength={100} /></Field>
        <Field label="Provinsi"><TextInput name="region" defaultValue={value.region} maxLength={100} /></Field>
        <Field label="Kode pos"><TextInput name="postalCode" defaultValue={value.postalCode} maxLength={24} /></Field>
        <Field label="Kode negara"><TextInput name="countryCode" defaultValue={value.countryCode} required maxLength={2} /></Field>
        <Field label="Zona waktu"><TextInput name="timezone" defaultValue={value.timezone} required maxLength={64} /></Field>
        <Field label="Mata uang"><TextInput name="currency" defaultValue={value.currency} required maxLength={3} /></Field>
        <Field label="Jumlah kamar tidur"><TextInput name="bedroomCount" type="number" min={0} defaultValue={value.bedroomCount} /></Field>
        <Field label="Jumlah kamar mandi"><TextInput name="bathroomCount" type="number" min={0} defaultValue={value.bathroomCount} /></Field>
        <Field label="Kapasitas tamu"><TextInput name="maxGuests" type="number" min={0} defaultValue={value.maxGuests} /></Field>
        <Field label="Harga dasar / malam"><TextInput name="baseNightlyRate" type="number" min={0} defaultValue={value.baseNightlyRate} /></Field>
        <Field label="Path halaman publik"><TextInput name="publicPath" defaultValue={value.publicPath} maxLength={160} placeholder="/stays/nama-properti" /></Field>
        <Field label="Ringkasan publik" className="sm:col-span-2 xl:col-span-3">
          <TextArea name="publicSummary" defaultValue={value.publicSummary} maxLength={500} />
        </Field>
        <Field label="Catatan internal" className="sm:col-span-2 xl:col-span-3">
          <TextArea name="internalNotes" defaultValue={value.internalNotes} maxLength={2000} />
        </Field>
      </div>
      <FormActions
        action={action}
        operation="property.upsert"
        archiveOperation="property.archive"
        returnTo="/admin/properties"
        id={property?.id}
      />
    </form>
  );
}

export function PropertyManager({
  catalog,
  state,
  backendError,
  formAction,
}: {
  catalog: PmsCatalog;
  state: PmsPageState;
  backendError: boolean;
  formAction: PmsFormAction;
}) {
  return (
    <div className="pb-20">
      <PageHeader
        eyebrow="Portfolio setup"
        title="Properti yang dapat tumbuh bersama portfolio."
        description="Setiap properti memiliki identitas, lokasi, mata uang, inventori, dan fakta publik sendiri. Nilai yang belum terkonfirmasi boleh dibiarkan kosong."
      />
      <div className="mx-auto max-w-[92rem] space-y-8 px-4 pt-8 sm:px-8 lg:px-12">
        <StatusBanner status={state.status} error={state.error || (backendError ? "service" : undefined)} />
        <CreatePanel title="Tambah properti baru"><PropertyForm action={formAction} /></CreatePanel>
        <section className="border border-charcoal/12 bg-white">
          <header className="border-b border-charcoal/12 px-5 py-5 sm:px-7">
            <p className="kicker text-umber">Portfolio</p>
            <h2 className="mt-3 font-serif text-3xl">{catalog.properties.length} properti</h2>
          </header>
          {catalog.properties.length ? catalog.properties.map((property) => (
            <RecordPanel
              key={property.id}
              title={property.name}
              meta={`${humanize(property.propertyType)} · ${humanize(property.status)} · ${property.locationLabel ?? "Lokasi belum diisi"}`}
            >
              <PropertyForm property={property} action={formAction} />
            </RecordPanel>
          )) : <EmptyState>Belum ada properti. Tambahkan baru atau jalankan inisialisasi Ruma Kamyna dari Dashboard.</EmptyState>}
        </section>
      </div>
    </div>
  );
}

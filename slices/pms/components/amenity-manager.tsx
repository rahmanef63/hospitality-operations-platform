import { AMENITY_CATEGORIES, humanize, type PmsAmenity, type PmsCatalog } from "@/shared/pms";
import type { PmsFormAction, PmsPageState } from "../types";
import { Checkbox, Field, SelectInput, TextArea, TextInput } from "./form-controls";
import { CreatePanel, EmptyState, FormActions, RecordPanel } from "./manager-primitives";
import { PageHeader } from "./page-header";
import { StatusBanner } from "./status-banner";

function AmenityForm({ amenity, catalog, action }: { amenity?: PmsAmenity; catalog: PmsCatalog; action: PmsFormAction }) {
  const propertyId = amenity?.propertyId ?? catalog.properties[0]?.id ?? "";
  return (
    <form action={action}>
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        <Field label="Properti">
          <SelectInput name="propertyId" defaultValue={propertyId} required>
            {catalog.properties.map((property) => <option key={property.id} value={property.id}>{property.name}</option>)}
          </SelectInput>
        </Field>
        <Field label="Nama fasilitas"><TextInput name="name" defaultValue={amenity?.name} required maxLength={100} /></Field>
        <Field label="Key"><TextInput name="key" defaultValue={amenity?.key} required maxLength={64} placeholder="swimming-pool" /></Field>
        <Field label="Kategori">
          <SelectInput name="category" defaultValue={amenity?.category ?? "other"}>
            {AMENITY_CATEGORIES.map((item) => <option key={item} value={item}>{humanize(item)}</option>)}
          </SelectInput>
        </Field>
        <Field label="Deskripsi" className="sm:col-span-2"><TextArea name="description" defaultValue={amenity?.description} maxLength={500} /></Field>
        <div className="sm:col-span-2 xl:col-span-3 grid gap-2 sm:grid-cols-3">
          <Checkbox name="featured" label="Tampilkan sebagai unggulan" defaultChecked={amenity?.featured ?? false} />
          <Checkbox name="publicVisible" label="Tampil di website publik" defaultChecked={amenity?.publicVisible ?? true} />
          <Checkbox name="active" label="Fasilitas aktif" defaultChecked={amenity?.active ?? true} />
        </div>
      </div>
      <FormActions action={action} operation="amenity.upsert" archiveOperation="amenity.archive" returnTo="/admin/amenities" id={amenity?.id} />
    </form>
  );
}

export function AmenityManager({ catalog, state, backendError, formAction }: {
  catalog: PmsCatalog; state: PmsPageState; backendError: boolean; formAction: PmsFormAction;
}) {
  return (
    <div className="pb-20">
      <PageHeader
        eyebrow="Guest experience"
        title="Fasilitas yang dapat dikelola tanpa menyentuh kode."
        description="Fasilitas yang aktif dan ditandai publik akan tampil pada halaman properti serta structured data. Ruma Kamyna dimulai dengan kolam renang, gym, jacuzzi, dan pemandangan gunung."
      />
      <div className="mx-auto max-w-[92rem] space-y-8 px-4 pt-8 sm:px-8 lg:px-12">
        <StatusBanner status={state.status} error={state.error || (backendError ? "service" : undefined)} />
        {catalog.properties.length ? <CreatePanel title="Tambah fasilitas"><AmenityForm catalog={catalog} action={formAction} /></CreatePanel> : null}
        <section className="border border-charcoal/12 bg-white">
          <header className="border-b border-charcoal/12 px-5 py-5 sm:px-7"><p className="kicker text-umber">Amenities</p><h2 className="mt-3 font-serif text-3xl">{catalog.amenities.length} fasilitas</h2></header>
          {catalog.amenities.length ? catalog.amenities.map((amenity) => (
            <RecordPanel key={amenity.id} title={amenity.name} meta={`${amenity.propertyName} · ${humanize(amenity.category)} · ${amenity.publicVisible ? "Publik" : "Internal"}`}>
              <AmenityForm amenity={amenity} catalog={catalog} action={formAction} />
            </RecordPanel>
          )) : <EmptyState>Belum ada fasilitas. Inisialisasi Ruma Kamyna dari Dashboard untuk memuat empat fasilitas terkonfirmasi.</EmptyState>}
        </section>
      </div>
    </div>
  );
}

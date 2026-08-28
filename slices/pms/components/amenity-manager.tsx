import Link from "next/link";
import { Eye, EyeOff, Plus, Sparkles } from "lucide-react";
import type { PmsAmenity, PmsCatalog } from "@/shared/pms";
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
import { amenityCategoryOptions } from "./ui-options";

function AmenityForm({ amenity, catalog, action }: { amenity?: PmsAmenity; catalog: PmsCatalog; action: PmsFormAction }) {
  const propertyId = amenity?.propertyId ?? catalog.properties[0]?.id ?? "";
  return (
    <form action={action} className="space-y-6">
      <FormSection title="Identitas fasilitas" description="Nama tampil ke tamu bila public visibility aktif; key menjadi identitas stabil untuk integrasi." icon="sparkles">
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          <Field label="Properti" required><TagSelect name="propertyId" options={propertyOptions(catalog)} defaultValue={propertyId} required /></Field>
          <Field label="Nama fasilitas" required><TextInput name="name" defaultValue={amenity?.name} required maxLength={100} /></Field>
          <Field label="Key" required hint="Gunakan lowercase-kebab-case."><TextInput name="key" defaultValue={amenity?.key} required maxLength={64} placeholder="swimming-pool" pattern="[a-z0-9-]+" /></Field>
          <Field label="Kategori"><TagSelect name="category" options={amenityCategoryOptions} defaultValue={amenity?.category ?? "other"} /></Field>
          <Field label="Deskripsi" className="sm:col-span-2"><TextArea name="description" defaultValue={amenity?.description} maxLength={500} /></Field>
        </div>
      </FormSection>
      <FormSection title="Status dan visibilitas" description="Ketiga kontrol ini terpisah agar fasilitas bisa disiapkan internal sebelum dipublikasikan." icon="eye">
        <div className="grid gap-3 sm:grid-cols-3">
          <Checkbox name="featured" label="Unggulan" description="Prioritaskan di halaman properti." icon="sparkles" defaultChecked={amenity?.featured ?? false} />
          <Checkbox name="publicVisible" label="Tampil publik" description="Masuk website dan structured data." icon="eye" defaultChecked={amenity?.publicVisible ?? true} />
          <Checkbox name="active" label="Fasilitas aktif" description="Nonaktif tidak tampil pada operasi aktif." icon="check" defaultChecked={amenity?.active ?? true} />
        </div>
      </FormSection>
      <FormActions action={action} operation="amenity.upsert" archiveOperation="amenity.archive" returnTo="/admin/amenities" id={amenity?.id} />
    </form>
  );
}

export function AmenityManager({ catalog, openCreate, state, backendError, formAction }: {
  catalog: PmsCatalog;
  openCreate: boolean;
  state: PmsPageState;
  backendError: boolean;
  formAction: PmsFormAction;
}) {
  const publicCount = catalog.amenities.filter((amenity) => amenity.active && amenity.publicVisible).length;
  const featured = catalog.amenities.filter((amenity) => amenity.active && amenity.featured).length;
  return (
    <div className="pb-20">
      <PageHeader
        eyebrow="Guest experience"
        title="Fasilitas yang mudah dipindai dan aman dipublikasikan."
        description="Kategori berbentuk tag, sedangkan status aktif, publik, dan unggulan terlihat jelas sebelum data masuk ke website atau structured data."
        action={<Link href="?new=1#new-amenity" className="cta-solid"><Plus className="size-4" aria-hidden="true" />Fasilitas baru</Link>}
      />
      <div className="mx-auto max-w-[92rem] space-y-8 px-4 pt-8 sm:px-8 lg:px-12">
        <StatusBanner status={state.status} error={state.error || (backendError ? "service" : undefined)} />
        <section className="grid gap-px overflow-hidden rounded-[.55rem] border border-charcoal/12 bg-charcoal/10 sm:grid-cols-3">
          <article className="bg-white p-5"><Sparkles className="size-5 text-olive" aria-hidden="true" /><p className="kicker mt-5 text-umber">Total</p><p className="mt-2 font-serif text-4xl">{catalog.amenities.length}</p></article>
          <article className="bg-white p-5"><Eye className="size-5 text-olive" aria-hidden="true" /><p className="kicker mt-5 text-umber">Publik aktif</p><p className="mt-2 font-serif text-4xl">{publicCount}</p></article>
          <article className="bg-white p-5"><PmsIcon name="sparkles" className="size-5 text-olive" /><p className="kicker mt-5 text-umber">Unggulan</p><p className="mt-2 font-serif text-4xl">{featured}</p></article>
        </section>

        <div id="new-amenity">
          {catalog.properties.length ? <CreatePanel title="Tambah fasilitas" description="Fasilitas baru dapat disimpan internal sebelum dibuat publik." icon="sparkles" open={openCreate}><AmenityForm catalog={catalog} action={formAction} /></CreatePanel> : <EmptyState title="Belum ada properti">Fasilitas harus terhubung ke properti.</EmptyState>}
        </div>

        <section className="overflow-hidden rounded-[.55rem] border border-charcoal/12 bg-white">
          <header className="border-b border-charcoal/10 px-5 py-5 sm:px-7"><p className="kicker text-umber">Amenities</p><h2 className="mt-2 font-serif text-3xl">{catalog.amenities.length} fasilitas</h2></header>
          <div className="p-3 sm:p-4"><CollectionSearch targetId="amenity-directory" placeholder="Cari fasilitas, properti, key, atau kategori…" filters={amenityCategoryOptions} /></div>
          <div id="amenity-directory" className="border-t border-charcoal/10">
            {catalog.amenities.length ? catalog.amenities.map((amenity) => (
              <RecordPanel
                key={amenity.id}
                id={`amenity-${amenity.id}`}
                title={amenity.name}
                meta={`${amenity.propertyName} · ${amenity.key} · ${amenity.category.replaceAll("_", " ")}`}
                searchText={`${amenity.name} ${amenity.propertyName} ${amenity.key} ${amenity.category} ${amenity.active ? "active" : "inactive"} ${amenity.publicVisible ? "public" : "internal"}`}
                status={amenity.category}
                leading={<PmsIcon name="sparkles" />}
                trailing={<div className="hidden items-center gap-2 sm:flex">{amenity.featured ? <StatusPill value="purple" label="Unggulan" tone="purple" /> : null}{amenity.publicVisible ? <StatusPill value="green" label="Publik" tone="green" /> : <StatusPill value="neutral" label="Internal" tone="neutral" />}{amenity.active ? null : <StatusPill value="red" label="Nonaktif" tone="red" />}</div>}
              >
                <AmenityForm amenity={amenity} catalog={catalog} action={formAction} />
              </RecordPanel>
            )) : <div className="p-5"><EmptyState title="Belum ada fasilitas"><span>Inisialisasi Ruma Kamyna dari Dashboard untuk memuat fasilitas terverifikasi.</span></EmptyState></div>}
          </div>
        </section>

        <div className="flex items-start gap-3 rounded-[.45rem] border border-charcoal/10 bg-white p-4 text-xs leading-6 text-ink-soft"><EyeOff className="mt-0.5 size-4 shrink-0 text-olive" aria-hidden="true" />Fasilitas nonaktif atau internal tidak pernah masuk ke public property projection.</div>
      </div>
    </div>
  );
}

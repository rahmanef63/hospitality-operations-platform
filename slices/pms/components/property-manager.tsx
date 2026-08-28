import Link from "next/link";
import { MapPin, Plus, ShieldCheck } from "lucide-react";
import { formatCurrency, type PmsCatalog, type PmsProperty } from "@/shared/pms";
import type { PmsFormAction, PmsPageState } from "../types";
import { CollectionSearch } from "./collection-search";
import { Field, TextArea, TextInput } from "./form-controls";
import { FormSection } from "./form-section";
import { CreatePanel, EmptyState, FormActions, RecordPanel } from "./manager-primitives";
import { PageHeader } from "./page-header";
import { PmsIcon } from "./pms-icon";
import { StatusBanner } from "./status-banner";
import { StatusPill } from "./status-pill";
import { TagSelect } from "./tag-select";
import { activeStatusOptions, propertyTypeOptions, publicationOptions } from "./ui-options";

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

function completeness(property: PmsProperty) {
  const fields = [
    property.locationLabel,
    property.addressLine,
    property.locality,
    property.region,
    property.postalCode,
    property.bedroomCount,
    property.bathroomCount,
    property.maxGuests,
    property.baseNightlyRate,
    property.publicSummary,
    property.publicPath,
  ];
  return Math.round((fields.filter((value) => value !== undefined && value !== "").length / fields.length) * 100);
}

function PropertyForm({ property, action }: { property?: PmsProperty; action: PmsFormAction }) {
  const value = { ...emptyProperty, ...property };
  return (
    <form action={action} className="space-y-6">
      <FormSection title="Identitas properti" description="Nama, slug, dan jenis menjadi identitas utama di operasi dan halaman publik." icon="house">
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          <Field label="Nama properti" required><TextInput name="name" defaultValue={value.name} required maxLength={100} /></Field>
          <Field label="Slug" required hint="Gunakan huruf kecil dan tanda hubung."><TextInput name="slug" defaultValue={value.slug} required maxLength={64} placeholder="nama-properti" pattern="[a-z0-9-]+" /></Field>
          <Field label="Jenis properti"><TagSelect name="propertyType" options={propertyTypeOptions} defaultValue={value.propertyType} /></Field>
          <Field label="Status operasional"><TagSelect name="status" options={activeStatusOptions} defaultValue={value.status} /></Field>
          <Field label="Status publikasi"><TagSelect name="publicationStatus" options={publicationOptions} defaultValue={value.publicationStatus} /></Field>
          <Field label="Path halaman publik"><TextInput name="publicPath" defaultValue={value.publicPath} maxLength={160} placeholder="/stays/nama-properti" /></Field>
        </div>
      </FormSection>

      <FormSection title="Lokasi dan administrasi" description="Nilai ini membantu operasi, SEO lokal, mata uang, dan penghitungan reservasi." icon="map">
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <Field label="Label lokasi" className="sm:col-span-2"><TextInput name="locationLabel" defaultValue={value.locationLabel} maxLength={160} placeholder="Megamendung, Puncak Bogor" /></Field>
          <Field label="Alamat jalan" className="sm:col-span-2"><TextInput name="addressLine" defaultValue={value.addressLine} maxLength={240} /></Field>
          <Field label="Kota / kecamatan"><TextInput name="locality" defaultValue={value.locality} maxLength={100} /></Field>
          <Field label="Provinsi"><TextInput name="region" defaultValue={value.region} maxLength={100} /></Field>
          <Field label="Kode pos"><TextInput name="postalCode" defaultValue={value.postalCode} maxLength={24} /></Field>
          <Field label="Kode negara" required><TextInput name="countryCode" defaultValue={value.countryCode} required maxLength={2} /></Field>
          <Field label="Zona waktu" required><TextInput name="timezone" defaultValue={value.timezone} required maxLength={64} /></Field>
          <Field label="Mata uang" required><TextInput name="currency" defaultValue={value.currency} required maxLength={3} /></Field>
        </div>
      </FormSection>

      <FormSection title="Fakta dan harga dasar" description="Kosongkan nilai yang belum terverifikasi. Harga dasar hanya menjadi saran otomatis saat membuat reservasi." icon="bed">
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <Field label="Kamar tidur"><TextInput name="bedroomCount" type="number" min={0} defaultValue={value.bedroomCount} /></Field>
          <Field label="Kamar mandi"><TextInput name="bathroomCount" type="number" min={0} defaultValue={value.bathroomCount} /></Field>
          <Field label="Kapasitas tamu"><TextInput name="maxGuests" type="number" min={0} defaultValue={value.maxGuests} /></Field>
          <Field label="Harga dasar / malam"><TextInput name="baseNightlyRate" type="number" min={0} defaultValue={value.baseNightlyRate} /></Field>
        </div>
      </FormSection>

      <FormSection title="Konten dan catatan" description="Ringkasan publik dapat muncul di website. Catatan internal tidak pernah dikirim ke public projection." icon="eye">
        <div className="grid gap-5 xl:grid-cols-2">
          <Field label="Ringkasan publik"><TextArea name="publicSummary" defaultValue={value.publicSummary} maxLength={500} /></Field>
          <Field label="Catatan internal"><TextArea name="internalNotes" defaultValue={value.internalNotes} maxLength={2000} /></Field>
        </div>
      </FormSection>
      <FormActions action={action} operation="property.upsert" archiveOperation="property.archive" returnTo="/admin/properties" id={property?.id} />
    </form>
  );
}

export function PropertyManager({ catalog, openCreate, state, backendError, formAction }: {
  catalog: PmsCatalog;
  openCreate: boolean;
  state: PmsPageState;
  backendError: boolean;
  formAction: PmsFormAction;
}) {
  const active = catalog.properties.filter((property) => property.status === "active").length;
  const published = catalog.properties.filter((property) => property.publicationStatus === "published").length;
  return (
    <div className="pb-20">
      <PageHeader
        eyebrow="Portfolio setup"
        title="Satu sumber fakta untuk setiap properti."
        description="Status, lokasi, kapasitas, harga dasar, dan publikasi kini dikelompokkan agar mudah dipahami tanpa menebak nilai yang belum dikonfirmasi."
        action={<Link href="?new=1#new-property" className="cta-solid"><Plus className="size-4" aria-hidden="true" />Properti baru</Link>}
      />
      <div className="mx-auto max-w-[92rem] space-y-8 px-4 pt-8 sm:px-8 lg:px-12">
        <StatusBanner status={state.status} error={state.error || (backendError ? "service" : undefined)} />
        <section className="grid gap-px overflow-hidden rounded-[.55rem] border border-charcoal/12 bg-charcoal/10 sm:grid-cols-3">
          <article className="bg-white p-5"><PmsIcon name="building" className="size-5 text-olive" /><p className="kicker mt-5 text-umber">Portfolio</p><p className="mt-2 font-serif text-4xl">{catalog.properties.length}</p></article>
          <article className="bg-white p-5"><ShieldCheck className="size-5 text-olive" aria-hidden="true" /><p className="kicker mt-5 text-umber">Aktif</p><p className="mt-2 font-serif text-4xl">{active}</p></article>
          <article className="bg-white p-5"><MapPin className="size-5 text-olive" aria-hidden="true" /><p className="kicker mt-5 text-umber">Published</p><p className="mt-2 font-serif text-4xl">{published}</p></article>
        </section>

        <div id="new-property"><CreatePanel title="Tambah properti" description="Mulai dengan identitas minimum; fakta yang belum terverifikasi boleh tetap kosong." icon="building" open={openCreate}><PropertyForm action={formAction} /></CreatePanel></div>

        <section className="overflow-hidden rounded-[.55rem] border border-charcoal/12 bg-white">
          <header className="border-b border-charcoal/10 px-5 py-5 sm:px-7"><p className="kicker text-umber">Portfolio</p><h2 className="mt-2 font-serif text-3xl">{catalog.properties.length} properti</h2></header>
          <div className="p-3 sm:p-4"><CollectionSearch targetId="property-directory" placeholder="Cari nama, slug, lokasi, atau status…" filters={activeStatusOptions} /></div>
          <div id="property-directory" className="border-t border-charcoal/10">
            {catalog.properties.length ? catalog.properties.map((property) => {
              const score = completeness(property);
              const price = property.baseNightlyRate === undefined ? "Harga belum diisi" : formatCurrency(property.baseNightlyRate, property.currency);
              return (
                <RecordPanel
                  key={property.id}
                  id={`property-${property.id}`}
                  title={property.name}
                  meta={`${property.locationLabel ?? "Lokasi belum diisi"} · /${property.slug} · ${price} · kelengkapan ${score}%`}
                  searchText={`${property.name} ${property.slug} ${property.locationLabel ?? ""} ${property.status} ${property.publicationStatus} ${property.propertyType}`}
                  status={property.status}
                  leading={<PmsIcon name={property.propertyType === "apartment" ? "building" : "house"} />}
                  trailing={<div className="hidden items-center gap-2 sm:flex"><StatusPill value={property.publicationStatus} options={publicationOptions} /><StatusPill value={property.status} options={activeStatusOptions} /></div>}
                >
                  <PropertyForm property={property} action={formAction} />
                </RecordPanel>
              );
            }) : <div className="p-5"><EmptyState title="Belum ada properti" action={<Link href="?new=1#new-property" className="cta-solid">Tambah properti</Link>}>Mulai dari fakta yang sudah diverifikasi.</EmptyState></div>}
          </div>
        </section>
      </div>
    </div>
  );
}

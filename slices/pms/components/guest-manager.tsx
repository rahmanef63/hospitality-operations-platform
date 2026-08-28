import Link from "next/link";
import { Mail, MessageCircle, Plus, UserRound, UsersRound } from "lucide-react";
import type { PmsGuest } from "@/shared/pms";
import type { PmsFormAction, PmsPageState } from "../types";
import { CollectionSearch } from "./collection-search";
import { Field, TextArea, TextInput } from "./form-controls";
import { FormSection } from "./form-section";
import { CreatePanel, EmptyState, FormActions, RecordPanel } from "./manager-primitives";
import { PageHeader } from "./page-header";
import { PmsIcon } from "./pms-icon";
import { StatusBanner } from "./status-banner";
import { StatusPill } from "./status-pill";

function GuestForm({ guest, action }: { guest?: PmsGuest; action: PmsFormAction }) {
  return (
    <form action={action} className="space-y-6">
      <FormSection title="Identitas tamu" description="Simpan nama yang digunakan saat reservasi dan komunikasi." icon="user">
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          <Field label="Nama lengkap" required><TextInput name="fullName" defaultValue={guest?.fullName} required maxLength={120} autoComplete="name" /></Field>
          <Field label="Email"><TextInput name="email" type="email" defaultValue={guest?.email} maxLength={254} autoComplete="email" placeholder="nama@email.com" /></Field>
          <Field label="Telepon / WhatsApp"><TextInput name="phone" type="tel" defaultValue={guest?.phone} maxLength={40} autoComplete="tel" placeholder="+62…" /></Field>
          <Field label="Kewarganegaraan"><TextInput name="nationality" defaultValue={guest?.nationality} maxLength={80} autoComplete="country-name" /></Field>
        </div>
      </FormSection>
      <FormSection title="Catatan layanan" description="Hanya untuk konteks yang benar-benar membantu pelayanan. Jangan menyimpan data sensitif yang tidak diperlukan." icon="message">
        <Field label="Catatan internal"><TextArea name="notes" defaultValue={guest?.notes} maxLength={2000} placeholder="Preferensi, kebutuhan khusus, atau konteks komunikasi" /></Field>
      </FormSection>
      <FormActions action={action} operation="guest.upsert" archiveOperation="guest.archive" returnTo="/admin/guests" id={guest?.id} />
    </form>
  );
}

export function GuestManager({ guests, openCreate, state, backendError, formAction }: {
  guests: PmsGuest[];
  openCreate: boolean;
  state: PmsPageState;
  backendError: boolean;
  formAction: PmsFormAction;
}) {
  const reachable = guests.filter((guest) => guest.email || guest.phone).length;
  const complete = guests.filter((guest) => guest.email && guest.phone).length;
  return (
    <div className="pb-20">
      <PageHeader
        eyebrow="Guest records"
        title="Direktori tamu yang cepat ditemukan."
        description="Cari kontak dalam satu langkah, simpan hanya data yang dibutuhkan, lalu gunakan profil yang sama pada setiap reservasi berikutnya."
        action={<Link href="?new=1#new-guest" className="cta-solid"><Plus className="size-4" aria-hidden="true" />Tamu baru</Link>}
      />
      <div className="mx-auto max-w-[92rem] space-y-8 px-4 pt-8 sm:px-8 lg:px-12">
        <StatusBanner status={state.status} error={state.error || (backendError ? "service" : undefined)} />
        <section className="grid gap-px overflow-hidden rounded-[.55rem] border border-charcoal/12 bg-charcoal/10 sm:grid-cols-3">
          <article className="bg-white p-5"><UsersRound className="size-5 text-olive" aria-hidden="true" /><p className="kicker mt-5 text-umber">Total tamu</p><p className="mt-2 font-serif text-4xl">{guests.length}</p></article>
          <article className="bg-white p-5"><MessageCircle className="size-5 text-olive" aria-hidden="true" /><p className="kicker mt-5 text-umber">Dapat dihubungi</p><p className="mt-2 font-serif text-4xl">{reachable}</p><p className="mt-2 text-xs text-ink-soft">Punya email atau telepon</p></article>
          <article className="bg-white p-5"><Mail className="size-5 text-olive" aria-hidden="true" /><p className="kicker mt-5 text-umber">Kontak lengkap</p><p className="mt-2 font-serif text-4xl">{complete}</p><p className="mt-2 text-xs text-ink-soft">Email dan telepon terisi</p></article>
        </section>

        <div id="new-guest">
          <CreatePanel title="Tambah tamu" description="Profil yang disimpan dapat langsung dipilih di form reservasi." icon="user" open={openCreate}>
            <GuestForm action={formAction} />
          </CreatePanel>
        </div>

        <section className="overflow-hidden rounded-[.55rem] border border-charcoal/12 bg-white">
          <header className="border-b border-charcoal/10 px-5 py-5 sm:px-7"><p className="kicker text-umber">Guest directory</p><h2 className="mt-2 font-serif text-3xl">{guests.length} profil tamu</h2></header>
          <div className="p-3 sm:p-4"><CollectionSearch targetId="guest-directory" placeholder="Cari nama, email, telepon, atau negara…" /></div>
          <div id="guest-directory" className="border-t border-charcoal/10">
            {guests.length ? guests.map((guest) => {
              const contactStatus = guest.email && guest.phone ? "Lengkap" : guest.email || guest.phone ? "Sebagian" : "Belum ada kontak";
              const tone = guest.email && guest.phone ? "green" : guest.email || guest.phone ? "amber" : "red";
              return (
                <RecordPanel
                  key={guest.id}
                  id={`guest-${guest.id}`}
                  title={guest.fullName}
                  meta={[guest.email, guest.phone, guest.nationality].filter(Boolean).join(" · ") || "Kontak belum lengkap"}
                  searchText={`${guest.fullName} ${guest.email ?? ""} ${guest.phone ?? ""} ${guest.nationality ?? ""}`}
                  leading={<UserRound className="size-4" aria-hidden="true" />}
                  trailing={<StatusPill value={tone} label={contactStatus} tone={tone} />}
                >
                  <GuestForm guest={guest} action={formAction} />
                </RecordPanel>
              );
            }) : <div className="p-5"><EmptyState title="Belum ada data tamu" action={<Link href="?new=1#new-guest" className="cta-solid">Tambah tamu pertama</Link>}><span>Profil tamu dibuat hanya dari data nyata, bukan contoh.</span></EmptyState></div>}
          </div>
        </section>

        <Link href="/admin/reservations?new=1#new-reservation" className="flex min-h-14 items-center justify-between rounded-[.45rem] border border-charcoal/12 bg-white px-5 text-sm font-semibold hover:border-olive">
          <span className="flex items-center gap-3"><PmsIcon name="booking" />Gunakan tamu ini pada reservasi baru</span><span aria-hidden="true">→</span>
        </Link>
      </div>
    </div>
  );
}

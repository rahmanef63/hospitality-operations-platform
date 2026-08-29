import Link from "next/link";
import { CalendarDays, Mail, MessageCircle, Plus, UserRound, UsersRound } from "lucide-react";
import { WELCOME_LOCALE_META } from "@/shared/welcome";
import type { PmsBookingData, PmsGuest } from "@/shared/pms";
import type { PmsFormAction, PmsPageState } from "../types";
import { CollectionSearch } from "./collection-search";
import { Field, TextArea, TextInput } from "./form-controls";
import { FormSection } from "./form-section";
import { CreatePanel, EmptyState, FormActions, RecordPanel } from "./manager-primitives";
import { PageHeader } from "./page-header";
import { StatusBanner } from "./status-banner";
import { StatusPill } from "./status-pill";
import { TagSelect } from "./tag-select";
import { welcomeLocaleSelectOptions } from "./welcome-locale-options";

function GuestForm({ guest, action }: { guest?: PmsGuest; action: PmsFormAction }) {
  return (
    <form action={action} className="space-y-6">
      <FormSection title="Identitas dan komunikasi" description="Bahasa pilihan menjadi default sambutan pada reservasi baru." icon="user">
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          <Field label="Nama lengkap" required><TextInput name="fullName" defaultValue={guest?.fullName} required maxLength={120} autoComplete="name" /></Field>
          <Field label="Email"><TextInput name="email" type="email" defaultValue={guest?.email} maxLength={254} autoComplete="email" placeholder="nama@email.com" /></Field>
          <Field label="Telepon / WhatsApp"><TextInput name="phone" type="tel" defaultValue={guest?.phone} maxLength={40} autoComplete="tel" placeholder="+62…" /></Field>
          <Field label="Kewarganegaraan"><TextInput name="nationality" defaultValue={guest?.nationality} maxLength={80} autoComplete="country-name" /></Field>
          <Field label="Bahasa sambutan" className="sm:col-span-2">
            <TagSelect name="preferredLocale" options={welcomeLocaleSelectOptions} defaultValue={guest?.preferredLocale ?? "id"} />
          </Field>
        </div>
      </FormSection>
      <FormSection title="Catatan layanan" description="Simpan hanya konteks yang benar-benar membantu pelayanan; hindari data sensitif yang tidak diperlukan." icon="message">
        <Field label="Catatan internal"><TextArea name="notes" defaultValue={guest?.notes} maxLength={2000} placeholder="Preferensi, kebutuhan khusus, atau konteks komunikasi" /></Field>
      </FormSection>
      <FormActions action={action} operation="guest.upsert" archiveOperation="guest.archive" returnTo="/admin/guests" id={guest?.id} />
    </form>
  );
}

function RelatedStays({ guestId, booking }: { guestId: string; booking: PmsBookingData }) {
  const stays = booking.reservations.filter((reservation) => reservation.guestId === guestId).slice(0, 6);
  if (!stays.length) return null;
  return (
    <section className="mb-6 rounded-[.45rem] border border-charcoal/10 bg-white p-4">
      <p className="kicker text-umber">Riwayat reservasi</p>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {stays.map((stay) => (
          <Link key={stay.id} href={`/admin/reservations#reservation-${stay.id}`} className="flex min-h-12 items-center justify-between gap-3 rounded-[.35rem] border border-charcoal/10 px-3 text-xs hover:border-olive">
            <span><strong className="block">{stay.reference}</strong><span className="mt-1 block text-ink-soft">{stay.checkIn} → {stay.checkOut}</span></span>
            <CalendarDays className="size-4 text-olive" aria-hidden="true" />
          </Link>
        ))}
      </div>
    </section>
  );
}

export function GuestManager({ booking, openCreate, state, backendError, formAction }: {
  booking: PmsBookingData;
  openCreate: boolean;
  state: PmsPageState;
  backendError: boolean;
  formAction: PmsFormAction;
}) {
  const { guests } = booking;
  const reachable = guests.filter((guest) => guest.email || guest.phone).length;
  const complete = guests.filter((guest) => guest.email && guest.phone).length;
  return (
    <div className="pb-20">
      <PageHeader
        eyebrow="Guest records"
        title="Satu profil tamu untuk setiap masa inap."
        description="Kontak, bahasa sambutan, dan riwayat reservasi kini saling terhubung sehingga data tidak perlu diketik ulang pada modul lain."
        action={<Link href="?new=1#new-guest" className="cta-solid"><Plus className="size-4" aria-hidden="true" />Tamu baru</Link>}
      />
      <div className="mx-auto max-w-[92rem] space-y-8 px-4 pt-8 sm:px-8 lg:px-12">
        <StatusBanner status={state.status} error={state.error || (backendError ? "service" : undefined)} />
        <section className="grid gap-px overflow-hidden rounded-[.55rem] border border-charcoal/12 bg-charcoal/10 sm:grid-cols-3">
          <article className="bg-white p-5"><UsersRound className="size-5 text-olive" aria-hidden="true" /><p className="kicker mt-5 text-umber">Total tamu</p><p className="mt-2 font-serif text-4xl">{guests.length}</p></article>
          <article className="bg-white p-5"><MessageCircle className="size-5 text-olive" aria-hidden="true" /><p className="kicker mt-5 text-umber">Dapat dihubungi</p><p className="mt-2 font-serif text-4xl">{reachable}</p><p className="mt-2 text-xs text-ink-soft">Punya email atau telepon</p></article>
          <article className="bg-white p-5"><Mail className="size-5 text-olive" aria-hidden="true" /><p className="kicker mt-5 text-umber">Kontak lengkap</p><p className="mt-2 font-serif text-4xl">{complete}</p><p className="mt-2 text-xs text-ink-soft">Email dan telepon terisi</p></article>
        </section>

        <div id="new-guest"><CreatePanel title="Tambah tamu" description="Profil tersimpan langsung tersedia di Reservasi dan Sambutan." icon="user" open={openCreate}><GuestForm action={formAction} /></CreatePanel></div>

        <section className="overflow-hidden rounded-[.55rem] border border-charcoal/12 bg-white">
          <header className="border-b border-charcoal/10 px-5 py-5 sm:px-7"><p className="kicker text-umber">Guest directory</p><h2 className="mt-2 font-serif text-3xl">{guests.length} profil tamu</h2></header>
          <div className="p-3 sm:p-4"><CollectionSearch targetId="guest-directory" placeholder="Cari nama, kontak, negara, atau bahasa…" /></div>
          <div id="guest-directory" className="border-t border-charcoal/10">
            {guests.length ? guests.map((guest) => {
              const contactStatus = guest.email && guest.phone ? "Lengkap" : guest.email || guest.phone ? "Sebagian" : "Belum ada kontak";
              const tone = guest.email && guest.phone ? "green" : guest.email || guest.phone ? "amber" : "red";
              const locale = WELCOME_LOCALE_META[guest.preferredLocale ?? "id"];
              const stayCount = booking.reservations.filter((reservation) => reservation.guestId === guest.id).length;
              return (
                <RecordPanel
                  key={guest.id}
                  id={`guest-${guest.id}`}
                  title={guest.fullName}
                  meta={`${locale.nativeLabel} · ${stayCount} reservasi · ${[guest.email, guest.phone].filter(Boolean).join(" · ") || "Kontak belum lengkap"}`}
                  searchText={`${guest.fullName} ${guest.email ?? ""} ${guest.phone ?? ""} ${guest.nationality ?? ""} ${locale.label} ${locale.nativeLabel}`}
                  leading={<UserRound className="size-4" aria-hidden="true" />}
                  trailing={<StatusPill value={tone} label={contactStatus} tone={tone} />}
                >
                  <RelatedStays guestId={guest.id} booking={booking} />
                  <GuestForm guest={guest} action={formAction} />
                </RecordPanel>
              );
            }) : <div className="p-5"><EmptyState title="Belum ada data tamu" action={<Link href="?new=1#new-guest" className="cta-solid">Tambah tamu pertama</Link>}><span>Profil tamu dibuat hanya dari data nyata, bukan contoh.</span></EmptyState></div>}
          </div>
        </section>
      </div>
    </div>
  );
}

import type { PmsGuest } from "@/shared/pms";
import type { PmsFormAction, PmsPageState } from "../types";
import { Field, TextArea, TextInput } from "./form-controls";
import { CreatePanel, EmptyState, FormActions, RecordPanel } from "./manager-primitives";
import { PageHeader } from "./page-header";
import { StatusBanner } from "./status-banner";

function GuestForm({ guest, action }: { guest?: PmsGuest; action: PmsFormAction }) {
  return (
    <form action={action}>
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        <Field label="Nama lengkap"><TextInput name="fullName" defaultValue={guest?.fullName} required maxLength={120} /></Field>
        <Field label="Email"><TextInput name="email" type="email" defaultValue={guest?.email} maxLength={254} /></Field>
        <Field label="Telepon / WhatsApp"><TextInput name="phone" type="tel" defaultValue={guest?.phone} maxLength={40} /></Field>
        <Field label="Kewarganegaraan"><TextInput name="nationality" defaultValue={guest?.nationality} maxLength={80} /></Field>
        <Field label="Catatan internal" className="sm:col-span-2 xl:col-span-3"><TextArea name="notes" defaultValue={guest?.notes} maxLength={2000} /></Field>
      </div>
      <FormActions action={action} operation="guest.upsert" archiveOperation="guest.archive" returnTo="/admin/guests" id={guest?.id} />
    </form>
  );
}

export function GuestManager({ guests, state, backendError, formAction }: {
  guests: PmsGuest[]; state: PmsPageState; backendError: boolean; formAction: PmsFormAction;
}) {
  return (
    <div className="pb-20">
      <PageHeader
        eyebrow="Guest records"
        title="Riwayat tamu yang tetap ringkas dan berguna."
        description="Simpan hanya data kontak dan catatan yang benar-benar dibutuhkan untuk pelayanan serta reservasi. Data tamu tidak pernah tampil di halaman publik."
      />
      <div className="mx-auto max-w-[92rem] space-y-8 px-4 pt-8 sm:px-8 lg:px-12">
        <StatusBanner status={state.status} error={state.error || (backendError ? "service" : undefined)} />
        <CreatePanel title="Tambah tamu"><GuestForm action={formAction} /></CreatePanel>
        <section className="border border-charcoal/12 bg-white">
          <header className="border-b border-charcoal/12 px-5 py-5 sm:px-7"><p className="kicker text-umber">Guest directory</p><h2 className="mt-3 font-serif text-3xl">{guests.length} tamu</h2></header>
          {guests.length ? guests.map((guest) => (
            <RecordPanel key={guest.id} title={guest.fullName} meta={[guest.email, guest.phone, guest.nationality].filter(Boolean).join(" · ") || "Kontak belum lengkap"}>
              <GuestForm guest={guest} action={formAction} />
            </RecordPanel>
          )) : <EmptyState>Belum ada data tamu. Tambahkan tamu sebelum membuat reservasi.</EmptyState>}
        </section>
      </div>
    </div>
  );
}

"use client";

import { AlertTriangle, ArrowRight, Calculator, CreditCard, ExternalLink, MoonStar, UsersRound } from "lucide-react";
import { useMemo, useState } from "react";
import { getWelcomeLocaleMeta, type WelcomeLocale } from "@/shared/welcome";
import { addDays, daysBetween, formatCurrency, type PmsBookingData, type PmsCatalog, type PmsReservation } from "@/shared/pms";
import type { PmsFormAction } from "../types";
import { Field, TextArea, TextInput } from "./form-controls";
import { FormSection } from "./form-section";
import { accommodationOptions, initialAccommodation, resolveAccommodation } from "./accommodation-options";
import { FormActions } from "./manager-primitives";
import { TagSelect } from "./tag-select";
import { reservationSourceOptions, reservationStatusOptions, type PmsSelectOption } from "./ui-options";
import { welcomeLocaleSelectOptions } from "./welcome-locale-options";

function numeric(value: string) {
  if (!value.trim()) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? Math.round(parsed) : undefined;
}

function MoneyStat({ label, value, currency, strong = false }: { label: string; value?: number; currency: string; strong?: boolean }) {
  return <div className={`rounded-[.4rem] border p-4 ${strong ? "border-charcoal bg-charcoal text-ivory" : "border-charcoal/10 bg-[#f8f8f5]"}`}><p className={`text-[.64rem] font-bold tracking-[.08em] uppercase ${strong ? "text-ivory/58" : "text-ink-soft"}`}>{label}</p><p className="mt-2 font-serif text-2xl">{value === undefined ? "—" : formatCurrency(value, currency)}</p></div>;
}

export function ReservationForm({ reservation, catalog, booking, action, today, returnTo = "/admin/reservations", welcomeUrl }: {
  reservation?: PmsReservation;
  catalog: PmsCatalog;
  booking: PmsBookingData;
  action: PmsFormAction;
  today: string;
  returnTo?: string;
  welcomeUrl?: string;
}) {
  const options = useMemo(() => accommodationOptions(catalog), [catalog]);
  const [accommodation, setAccommodation] = useState(initialAccommodation(reservation, catalog));
  const current = resolveAccommodation(accommodation, catalog);
  const initialGuest = booking.guests.find((guest) => guest.id === reservation?.guestId) ?? booking.guests[0];
  const [guestId, setGuestId] = useState(initialGuest?.id ?? "");
  const [welcomeLocale, setWelcomeLocale] = useState<WelcomeLocale>(reservation?.welcomeLocale ?? initialGuest?.preferredLocale ?? "id");
  const initialRate = reservation?.nightlyRate ?? current.unit?.baseNightlyRate ?? current.property?.baseNightlyRate;
  const [nightlyRate, setNightlyRate] = useState(initialRate?.toString() ?? "");
  const [rateTouched, setRateTouched] = useState(false);
  const [checkIn, setCheckIn] = useState(reservation?.checkIn ?? today);
  const [checkOut, setCheckOut] = useState(reservation?.checkOut ?? addDays(today, 1));
  const [adults, setAdults] = useState(reservation?.adults?.toString() ?? "");
  const [children, setChildren] = useState(reservation?.children?.toString() ?? "");
  const [extraFees, setExtraFees] = useState(reservation?.extraFees?.toString() ?? "");
  const [discount, setDiscount] = useState(reservation?.discountAmount?.toString() ?? "");
  const nights = daysBetween(checkIn, checkOut);
  const rate = numeric(nightlyRate);
  const accommodationAmount = rate === undefined || nights < 1 ? undefined : rate * nights;
  const extras = numeric(extraFees) ?? 0;
  const discountAmount = numeric(discount) ?? 0;
  const total = accommodationAmount === undefined ? undefined : Math.max(0, accommodationAmount + extras - discountAmount);
  const currency = current.property?.currency ?? reservation?.currency ?? "IDR";
  const guestCount = (numeric(adults) ?? 0) + (numeric(children) ?? 0);
  const capacity = current.unit?.maxGuests ?? current.property?.maxGuests;
  const discountInvalid = accommodationAmount !== undefined && discountAmount > accommodationAmount + extras;
  const guestOptions: PmsSelectOption[] = booking.guests.map((guest) => ({
    value: guest.id,
    label: guest.fullName,
    description: `${getWelcomeLocaleMeta(guest.preferredLocale ?? "id").nativeLabel} · ${[guest.phone, guest.email].filter(Boolean).join(" · ") || "Kontak belum lengkap"}`,
    icon: "user",
    tone: "neutral",
  }));

  function changeAccommodation(next: string) {
    setAccommodation(next);
    if (!rateTouched) {
      const selected = resolveAccommodation(next, catalog);
      setNightlyRate((selected.unit?.baseNightlyRate ?? selected.property?.baseNightlyRate)?.toString() ?? "");
    }
  }

  function changeGuest(next: string) {
    setGuestId(next);
    const guest = booking.guests.find((item) => item.id === next);
    setWelcomeLocale(guest?.preferredLocale ?? "id");
  }

  return (
    <form action={action} className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem] xl:items-start">
      <input type="hidden" name="propertyId" value={current.propertyId} />
      <input type="hidden" name="unitId" value={current.unitId} />
      <div className="space-y-6">
        <FormSection title="Akomodasi, tamu, dan sambutan" description="Pilihan tamu otomatis membawa bahasa sambutannya; Anda tetap dapat menyesuaikannya per reservasi." icon="bed">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Akomodasi" required><TagSelect name="accommodation" options={options} value={accommodation} onValueChange={changeAccommodation} placeholder="Pilih akomodasi" required /></Field>
            <Field label="Tamu" required><TagSelect name="guestId" options={guestOptions} value={guestId} onValueChange={changeGuest} placeholder="Pilih tamu" required /></Field>
            <Field label="Bahasa sambutan"><TagSelect name="welcomeLocale" options={welcomeLocaleSelectOptions} value={welcomeLocale} onValueChange={(value) => setWelcomeLocale(value as WelcomeLocale)} /></Field>
            <Field label="Status"><TagSelect name="status" options={reservationStatusOptions} defaultValue={reservation?.status ?? "inquiry"} /></Field>
            <Field label="Sumber reservasi"><TagSelect name="source" options={reservationSourceOptions} defaultValue={reservation?.source ?? "direct"} /></Field>
          </div>
        </FormSection>

        <FormSection title="Tanggal dan jumlah tamu" description="Check-out otomatis dijaga minimal satu malam setelah check-in." icon="calendar">
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <Field label="Check-in" required><TextInput name="checkIn" type="date" value={checkIn} onChange={(event) => { const next = event.target.value; setCheckIn(next); if (checkOut <= next) setCheckOut(addDays(next, 1)); }} required /></Field>
            <Field label="Check-out" required><TextInput name="checkOut" type="date" min={addDays(checkIn, 1)} value={checkOut} onChange={(event) => setCheckOut(event.target.value)} required /></Field>
            <Field label="Dewasa"><TextInput name="adults" type="number" min={0} value={adults} onChange={(event) => setAdults(event.target.value)} /></Field>
            <Field label="Anak"><TextInput name="children" type="number" min={0} value={children} onChange={(event) => setChildren(event.target.value)} /></Field>
          </div>
          <div className="mt-5 flex flex-wrap gap-3 text-xs"><span className="inline-flex min-h-9 items-center gap-2 rounded-full bg-olive/10 px-3 font-semibold text-olive"><MoonStar className="size-4" aria-hidden="true" />{nights || 0} malam</span><span className="inline-flex min-h-9 items-center gap-2 rounded-full bg-charcoal/[.05] px-3 font-semibold"><UsersRound className="size-4" aria-hidden="true" />{guestCount} tamu</span>{capacity && guestCount > capacity ? <span className="inline-flex min-h-9 items-center gap-2 rounded-full bg-[#f4e0db] px-3 font-semibold text-[#833126]"><AlertTriangle className="size-4" aria-hidden="true" />Melebihi kapasitas {capacity}</span> : null}</div>
        </FormSection>

        <FormSection title="Harga yang dihitung otomatis" description="Subtotal dan total dihitung ulang oleh server dari malam × harga, biaya tambahan, dan diskon." icon="wallet">
          <div className="grid gap-5 sm:grid-cols-3">
            <Field label="Harga per malam" hint={rateTouched ? "Harga manual untuk reservasi ini." : "Mengikuti harga dasar akomodasi bila tersedia."}><TextInput name="nightlyRate" type="number" min={0} value={nightlyRate} onChange={(event) => { setRateTouched(true); setNightlyRate(event.target.value); }} placeholder="Belum ditentukan" /></Field>
            <Field label="Biaya tambahan"><TextInput name="extraFees" type="number" min={0} value={extraFees} onChange={(event) => setExtraFees(event.target.value)} /></Field>
            <Field label="Diskon" hint={discountInvalid ? "Diskon melebihi subtotal dan biaya tambahan." : undefined}><TextInput name="discountAmount" type="number" min={0} value={discount} onChange={(event) => setDiscount(event.target.value)} aria-invalid={discountInvalid} /></Field>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-3"><MoneyStat label="Subtotal akomodasi" value={accommodationAmount} currency={currency} /><MoneyStat label="Penyesuaian" value={accommodationAmount === undefined ? undefined : extras - discountAmount} currency={currency} /><MoneyStat label="Total reservasi" value={total} currency={currency} strong /></div>
        </FormSection>

        <FormSection title="Referensi dan catatan" description="Gunakan untuk nomor OTA, permintaan khusus, atau konteks operasional." icon="booking">
          <div className="grid gap-5 sm:grid-cols-2"><Field label="Referensi eksternal"><TextInput name="externalReference" defaultValue={reservation?.externalReference} maxLength={100} placeholder="Nomor booking OTA, bila ada" /></Field><Field label="Mata uang"><TextInput value={currency} readOnly aria-readonly="true" /></Field><Field label="Catatan" className="sm:col-span-2"><TextArea name="notes" defaultValue={reservation?.notes} maxLength={2000} placeholder="Permintaan tamu, waktu kedatangan, atau catatan internal" /></Field></div>
        </FormSection>
      </div>

      <aside className="sticky top-6 rounded-[.55rem] border border-charcoal/14 bg-white p-5 shadow-[0_18px_55px_-35px_rgba(45,43,39,.6)] xl:top-8">
        <p className="kicker text-umber">Ringkasan reservasi</p><h3 className="mt-3 font-serif text-3xl">{current.unit?.name ?? current.property?.name ?? "Pilih akomodasi"}</h3><p className="mt-2 text-xs leading-5 text-ink-soft">{current.unit ? current.property?.name : "Seluruh properti"}</p>
        <div className="mt-6 space-y-4 border-y border-charcoal/10 py-5 text-sm"><p className="flex items-center justify-between gap-3"><span className="text-ink-soft">Periode</span><strong>{nights} malam</strong></p><p className="flex items-center justify-between gap-3"><span className="text-ink-soft">Tamu</span><strong>{guestCount || "—"}</strong></p><p className="flex items-center justify-between gap-3"><span className="text-ink-soft">Bahasa</span><strong>{getWelcomeLocaleMeta(welcomeLocale).nativeLabel}</strong></p><p className="flex items-center justify-between gap-3"><span className="text-ink-soft">Total</span><strong>{total === undefined ? "Belum dihitung" : formatCurrency(total, currency)}</strong></p>{reservation ? <p className="flex items-center justify-between gap-3"><span className="text-ink-soft">Sudah dibayar</span><strong>{formatCurrency(reservation.paidAmount, reservation.currency)}</strong></p> : null}</div>
        <div className="mt-5 flex items-start gap-3 rounded-[.4rem] bg-olive/[.07] p-3 text-xs leading-5 text-olive"><Calculator className="mt-0.5 size-4 shrink-0" aria-hidden="true" /><p>Nilai tersimpan dihitung ulang oleh backend agar preview dan ledger tetap konsisten.</p></div>
        {welcomeUrl ? <a href={welcomeUrl} target="_blank" rel="noreferrer" className="mt-4 flex min-h-11 items-center justify-center gap-2 rounded-[.35rem] border border-charcoal/12 text-xs font-semibold hover:border-olive"><ExternalLink className="size-4" aria-hidden="true" />Buka sambutan tamu</a> : null}
        <div className="mt-5 flex items-center justify-center gap-2 text-[.64rem] font-semibold text-ink-soft"><CreditCard className="size-3.5" aria-hidden="true" />Pembayaran dicatat di Keuangan <ArrowRight className="size-3.5" aria-hidden="true" /></div>
      </aside>
      <div className="xl:col-span-2"><FormActions action={action} operation="reservation.upsert" archiveOperation="reservation.archive" returnTo={returnTo} id={reservation?.id} /></div>
    </form>
  );
}

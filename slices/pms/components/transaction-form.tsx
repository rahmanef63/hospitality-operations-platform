"use client";

import { ArrowDownLeft, ArrowUpRight, Link2, ReceiptText, WalletCards } from "lucide-react";
import { useMemo, useState } from "react";
import { formatCurrency, type PmsCatalog, type PmsReservation, type PmsTransaction } from "@/shared/pms";
import type { PmsFormAction } from "../types";
import { Field, TextArea, TextInput } from "./form-controls";
import { FormSection } from "./form-section";
import { FormActions } from "./manager-primitives";
import { TagSelect } from "./tag-select";
import {
  transactionCategoryOptions,
  transactionKindOptions,
  transactionMethodOptions,
  transactionStatusOptions,
  type PmsSelectOption,
} from "./ui-options";

function propertyOptions(catalog: PmsCatalog): PmsSelectOption[] {
  return catalog.properties.map((property) => ({
    value: property.id,
    label: property.name,
    description: `${property.locationLabel ?? "Lokasi belum diisi"} · ${property.currency}`,
    icon: property.propertyType === "apartment" ? "building" : "house",
    tone: "olive",
  }));
}

function reservationOptions(reservations: PmsReservation[]): PmsSelectOption[] {
  return [
    { value: "", label: "Tidak terkait reservasi", description: "Transaksi berdiri sendiri", icon: "minus", tone: "neutral" },
    ...reservations.map((reservation) => ({
      value: reservation.id,
      label: `${reservation.reference} · ${reservation.guestName}`,
      description: `${reservation.propertyName} · sisa ${formatCurrency(reservation.outstandingAmount, reservation.currency)}`,
      icon: "booking" as const,
      tone: reservation.outstandingAmount > 0 ? "amber" as const : "green" as const,
    })),
  ];
}

function withCustomCategory(value: string | undefined) {
  if (!value || transactionCategoryOptions.some((option) => option.value === value)) return transactionCategoryOptions;
  return [...transactionCategoryOptions, { value, label: value, icon: "tag" as const, tone: "neutral" as const }];
}

export function TransactionForm({
  transaction,
  catalog,
  reservations,
  action,
  today,
}: {
  transaction?: PmsTransaction;
  catalog: PmsCatalog;
  reservations: PmsReservation[];
  action: PmsFormAction;
  today: string;
}) {
  const [kind, setKind] = useState(transaction?.kind ?? "payment");
  const [reservationId, setReservationId] = useState(transaction?.reservationId ?? "");
  const linked = reservations.find((reservation) => reservation.id === reservationId);
  const [propertyId, setPropertyId] = useState(transaction?.propertyId ?? linked?.propertyId ?? catalog.properties[0]?.id ?? "");
  const initialProperty = catalog.properties.find((property) => property.id === propertyId);
  const [currency, setCurrency] = useState(transaction?.currency ?? linked?.currency ?? initialProperty?.currency ?? "IDR");
  const [amount, setAmount] = useState(transaction?.amount?.toString() ?? "");
  const [amountTouched, setAmountTouched] = useState(Boolean(transaction?.amount));
  const [category, setCategory] = useState(transaction?.category ?? (kind === "expense" ? "Operasional" : "Akomodasi"));
  const categories = useMemo(() => withCustomCategory(transaction?.category), [transaction?.category]);

  function chooseReservation(next: string) {
    setReservationId(next);
    const reservation = reservations.find((item) => item.id === next);
    if (!reservation) return;
    setPropertyId(reservation.propertyId);
    setCurrency(reservation.currency);
    if (!amountTouched && kind === "payment" && reservation.outstandingAmount > 0) {
      setAmount(reservation.outstandingAmount.toString());
    }
  }

  function chooseProperty(next: string) {
    setPropertyId(next);
    const property = catalog.properties.find((item) => item.id === next);
    if (property) setCurrency(property.currency);
  }

  function chooseKind(next: string) {
    setKind(next as PmsTransaction["kind"]);
    if (next === "refund") setCategory("Refund");
    else if (next === "expense") setCategory("Operasional");
    else setCategory("Akomodasi");
    if (!amountTouched && next === "payment" && linked?.outstandingAmount) setAmount(linked.outstandingAmount.toString());
  }

  const amountNumber = Number(amount || 0);
  return (
    <form action={action} className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_19rem] xl:items-start">
      <div className="space-y-6">
        <FormSection title="Hubungkan transaksi" description="Pilih reservasi bila transaksi memengaruhi saldo tamu. Properti dan mata uang akan mengikuti otomatis." icon="booking">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Reservasi">
              <TagSelect name="reservationId" options={reservationOptions(reservations)} value={reservationId} onValueChange={chooseReservation} />
            </Field>
            <Field label="Properti" required>
              <TagSelect name="propertyId" options={propertyOptions(catalog)} value={propertyId} onValueChange={chooseProperty} disabled={Boolean(linked)} required />
            </Field>
          </div>
        </FormSection>

        <FormSection title="Jenis dan klasifikasi" description="Tag berikon menjaga laporan tetap konsisten dan mudah dipindai seperti select property di Notion." icon="tag">
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <Field label="Jenis"><TagSelect name="kind" options={transactionKindOptions} value={kind} onValueChange={chooseKind} /></Field>
            <Field label="Kategori"><TagSelect name="category" options={categories} value={category} onValueChange={setCategory} /></Field>
            <Field label="Metode"><TagSelect name="method" options={transactionMethodOptions} defaultValue={transaction?.method ?? "bank_transfer"} /></Field>
            <Field label="Status"><TagSelect name="status" options={transactionStatusOptions} defaultValue={transaction?.status ?? "completed"} /></Field>
          </div>
        </FormSection>

        <FormSection title="Nilai transaksi" description="Saat memilih reservasi, pembayaran baru menyarankan sisa saldo yang belum lunas. Nilainya tetap dapat disesuaikan." icon="wallet">
          <div className="grid gap-5 sm:grid-cols-3">
            <Field label="Jumlah" required><TextInput name="amount" type="number" min={1} value={amount} onChange={(event) => { setAmountTouched(true); setAmount(event.target.value); }} required /></Field>
            <Field label="Mata uang"><TextInput value={currency} readOnly aria-readonly="true" /></Field>
            <Field label="Tanggal" required><TextInput name="occurredOn" type="date" defaultValue={transaction?.occurredOn ?? today} required /></Field>
            <Field label="Referensi"><TextInput name="reference" defaultValue={transaction?.reference} maxLength={100} placeholder="Nomor transfer atau kuitansi" /></Field>
            <Field label="Catatan" className="sm:col-span-2"><TextArea name="notes" defaultValue={transaction?.notes} maxLength={1000} placeholder="Keterangan yang membantu rekonsiliasi" /></Field>
          </div>
        </FormSection>
      </div>

      <aside className="sticky top-6 rounded-[.55rem] border border-charcoal/14 bg-white p-5 xl:top-8">
        <p className="kicker text-umber">Ringkasan transaksi</p>
        <div className="mt-5 flex items-center gap-3">
          <span className={`flex size-11 items-center justify-center rounded-full ${kind === "payment" ? "bg-[#dfe9df] text-[#31533b]" : kind === "refund" ? "bg-[#f1e4cb] text-[#825912]" : "bg-[#f4e0db] text-[#833126]"}`}>
            {kind === "payment" ? <ArrowDownLeft className="size-5" aria-hidden="true" /> : <ArrowUpRight className="size-5" aria-hidden="true" />}
          </span>
          <div><p className="text-xs text-ink-soft">{category}</p><p className="font-serif text-3xl">{amountNumber > 0 ? formatCurrency(amountNumber, currency) : "—"}</p></div>
        </div>
        {linked ? (
          <div className="mt-6 space-y-3 border-y border-charcoal/10 py-5 text-xs">
            <p className="flex justify-between gap-3"><span className="text-ink-soft">Reservasi</span><strong>{linked.reference}</strong></p>
            <p className="flex justify-between gap-3"><span className="text-ink-soft">Total</span><strong>{formatCurrency(linked.totalAmount ?? 0, linked.currency)}</strong></p>
            <p className="flex justify-between gap-3"><span className="text-ink-soft">Dibayar</span><strong>{formatCurrency(linked.paidAmount, linked.currency)}</strong></p>
            <p className="flex justify-between gap-3"><span className="text-ink-soft">Sisa</span><strong className={linked.outstandingAmount > 0 ? "text-[#825912]" : "text-[#31533b]"}>{formatCurrency(linked.outstandingAmount, linked.currency)}</strong></p>
          </div>
        ) : <p className="mt-6 rounded-[.4rem] bg-charcoal/[.045] p-3 text-xs leading-5 text-ink-soft">Transaksi ini tidak mengubah saldo reservasi karena belum dihubungkan.</p>}
        <div className="mt-5 flex items-start gap-2 text-[.66rem] leading-5 text-ink-soft"><Link2 className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />Hubungan ke reservasi membuat status pembayaran tampil otomatis di modul Reservasi.</div>
        <div className="mt-3 flex items-start gap-2 text-[.66rem] leading-5 text-ink-soft"><ReceiptText className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />Gunakan referensi bank atau kuitansi agar audit lebih mudah.</div>
        <div className="mt-3 flex items-start gap-2 text-[.66rem] leading-5 text-ink-soft"><WalletCards className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />Hanya transaksi completed masuk ke ringkasan kas.</div>
      </aside>

      <div className="xl:col-span-2"><FormActions action={action} operation="transaction.upsert" archiveOperation="transaction.archive" returnTo="/admin/finance" id={transaction?.id} /></div>
    </form>
  );
}

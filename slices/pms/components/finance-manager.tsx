import {
  TRANSACTION_KINDS,
  TRANSACTION_METHODS,
  TRANSACTION_STATUSES,
  formatCurrency,
  formatPmsDate,
  humanize,
  type PmsCatalog,
  type PmsFinanceData,
  type PmsReservation,
  type PmsTransaction,
} from "@/shared/pms";
import type { PmsFormAction, PmsPageState } from "../types";
import { Field, SelectInput, TextArea, TextInput } from "./form-controls";
import { CreatePanel, EmptyState, FormActions, RecordPanel } from "./manager-primitives";
import { PageHeader } from "./page-header";
import { StatusBanner } from "./status-banner";

function TransactionForm({ transaction, catalog, reservations, action }: {
  transaction?: PmsTransaction; catalog: PmsCatalog; reservations: PmsReservation[]; action: PmsFormAction;
}) {
  const propertyId = transaction?.propertyId ?? catalog.properties[0]?.id ?? "";
  return (
    <form action={action}>
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <Field label="Properti">
          <SelectInput name="propertyId" defaultValue={propertyId} required>
            {catalog.properties.map((property) => <option key={property.id} value={property.id}>{property.name}</option>)}
          </SelectInput>
        </Field>
        <Field label="Reservasi (opsional)">
          <SelectInput name="reservationId" defaultValue={transaction?.reservationId ?? ""}>
            <option value="">Tidak terkait reservasi</option>
            {reservations.map((reservation) => <option key={reservation.id} value={reservation.id}>{reservation.reference} · {reservation.guestName}</option>)}
          </SelectInput>
        </Field>
        <Field label="Jenis">
          <SelectInput name="kind" defaultValue={transaction?.kind ?? "payment"}>
            {TRANSACTION_KINDS.map((item) => <option key={item} value={item}>{humanize(item)}</option>)}
          </SelectInput>
        </Field>
        <Field label="Kategori"><TextInput name="category" defaultValue={transaction?.category ?? "Akomodasi"} required maxLength={80} /></Field>
        <Field label="Jumlah"><TextInput name="amount" type="number" min={1} defaultValue={transaction?.amount} required /></Field>
        <Field label="Mata uang"><TextInput name="currency" defaultValue={transaction?.currency ?? "IDR"} required maxLength={3} /></Field>
        <Field label="Metode">
          <SelectInput name="method" defaultValue={transaction?.method ?? "bank_transfer"}>
            {TRANSACTION_METHODS.map((item) => <option key={item} value={item}>{humanize(item)}</option>)}
          </SelectInput>
        </Field>
        <Field label="Status">
          <SelectInput name="status" defaultValue={transaction?.status ?? "completed"}>
            {TRANSACTION_STATUSES.map((item) => <option key={item} value={item}>{humanize(item)}</option>)}
          </SelectInput>
        </Field>
        <Field label="Tanggal"><TextInput name="occurredOn" type="date" defaultValue={transaction?.occurredOn} required /></Field>
        <Field label="Referensi"><TextInput name="reference" defaultValue={transaction?.reference} maxLength={100} /></Field>
        <Field label="Catatan" className="sm:col-span-2 xl:col-span-4"><TextArea name="notes" defaultValue={transaction?.notes} maxLength={1000} /></Field>
      </div>
      <FormActions action={action} operation="transaction.upsert" archiveOperation="transaction.archive" returnTo="/admin/finance" id={transaction?.id} />
    </form>
  );
}

function FinanceMetric({ label, value }: { label: string; value: number }) {
  return <article className="bg-white p-6"><p className="kicker text-umber">{label}</p><p className="mt-4 font-serif text-4xl">{formatCurrency(value)}</p></article>;
}

export function FinanceManager({ catalog, reservations, finance, state, backendError, formAction }: {
  catalog: PmsCatalog;
  reservations: PmsReservation[];
  finance: PmsFinanceData;
  state: PmsPageState;
  backendError: boolean;
  formAction: PmsFormAction;
}) {
  return (
    <div className="pb-20">
      <PageHeader
        eyebrow="Finance ledger"
        title="Uang masuk dan keluar tanpa angka perkiraan."
        description="Catat pembayaran, refund, dan pengeluaran hanya ketika transaksi benar-benar terjadi. Saldo reservasi dihitung dari transaksi berstatus completed."
      />
      <div className="mx-auto max-w-[92rem] space-y-8 px-4 pt-8 sm:px-8 lg:px-12">
        <StatusBanner status={state.status} error={state.error || (backendError ? "service" : undefined)} />
        <section className="grid gap-px border border-charcoal/12 bg-charcoal/12 sm:grid-cols-2 xl:grid-cols-4">
          <FinanceMetric label="Pembayaran" value={finance.totals.payments} />
          <FinanceMetric label="Refund" value={finance.totals.refunds} />
          <FinanceMetric label="Pengeluaran" value={finance.totals.expenses} />
          <FinanceMetric label="Net" value={finance.totals.net} />
        </section>
        {catalog.properties.length ? <CreatePanel title="Tambah transaksi"><TransactionForm catalog={catalog} reservations={reservations} action={formAction} /></CreatePanel> : null}
        <section className="border border-charcoal/12 bg-white">
          <header className="border-b border-charcoal/12 px-5 py-5 sm:px-7"><p className="kicker text-umber">Ledger</p><h2 className="mt-3 font-serif text-3xl">{finance.transactions.length} transaksi</h2></header>
          {finance.transactions.length ? finance.transactions.map((transaction) => (
            <RecordPanel
              key={transaction.id}
              title={`${humanize(transaction.kind)} · ${formatCurrency(transaction.amount, transaction.currency)}`}
              meta={`${transaction.propertyName} · ${formatPmsDate(transaction.occurredOn)} · ${humanize(transaction.method)} · ${humanize(transaction.status)}`}
            >
              <TransactionForm transaction={transaction} catalog={catalog} reservations={reservations} action={formAction} />
            </RecordPanel>
          )) : <EmptyState>Belum ada transaksi. Sistem tidak membuat revenue, biaya, atau saldo fiktif.</EmptyState>}
        </section>
      </div>
    </div>
  );
}

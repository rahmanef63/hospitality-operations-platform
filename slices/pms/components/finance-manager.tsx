import Link from "next/link";
import { ArrowDownLeft, ArrowUpRight, CircleDollarSign, Plus, ReceiptText } from "lucide-react";
import {
  formatCurrency,
  formatPmsDate,
  type PmsCatalog,
  type PmsFinanceData,
  type PmsReservation,
} from "@/shared/pms";
import type { PmsFormAction, PmsPageState } from "../types";
import { CollectionSearch } from "./collection-search";
import { CreatePanel, EmptyState, RecordPanel } from "./manager-primitives";
import { PageHeader } from "./page-header";
import { PmsIcon } from "./pms-icon";
import { StatusBanner } from "./status-banner";
import { StatusPill } from "./status-pill";
import { TransactionForm } from "./transaction-form";
import { transactionStatusOptions } from "./ui-options";

function FinanceMetric({ label, value, detail, icon }: { label: string; value: number; detail: string; icon: "hand-coins" | "wallet" | "receipt" | "bank" }) {
  return (
    <article className="bg-white p-5 sm:p-6">
      <span className="flex size-10 items-center justify-center rounded-full bg-olive/10 text-olive"><PmsIcon name={icon} /></span>
      <p className="kicker mt-6 text-umber">{label}</p>
      <p className="mt-2 font-serif text-4xl">{formatCurrency(value)}</p>
      <p className="mt-2 text-xs leading-5 text-ink-soft">{detail}</p>
    </article>
  );
}

export function FinanceManager({
  catalog,
  reservations,
  finance,
  today,
  openCreate,
  state,
  backendError,
  formAction,
}: {
  catalog: PmsCatalog;
  reservations: PmsReservation[];
  finance: PmsFinanceData;
  today: string;
  openCreate: boolean;
  state: PmsPageState;
  backendError: boolean;
  formAction: PmsFormAction;
}) {
  const outstanding = reservations.reduce((sum, reservation) => sum + reservation.outstandingAmount, 0);
  return (
    <div className="pb-20">
      <PageHeader
        eyebrow="Finance ledger"
        title="Arus kas yang terhubung ke reservasi."
        description="Kategori kini berupa tag berikon. Memilih reservasi mengisi properti, mata uang, dan saran jumlah pembayaran dari saldo yang belum lunas."
        action={<Link href="?new=1#new-transaction" className="cta-solid"><Plus className="size-4" aria-hidden="true" />Transaksi baru</Link>}
      />
      <div className="mx-auto max-w-[92rem] space-y-8 px-4 pt-8 sm:px-8 lg:px-12">
        <StatusBanner status={state.status} error={state.error || (backendError ? "service" : undefined)} />
        <section className="grid gap-px overflow-hidden rounded-[.55rem] border border-charcoal/12 bg-charcoal/10 sm:grid-cols-2 xl:grid-cols-4">
          <FinanceMetric label="Pembayaran" value={finance.totals.payments} detail="Pemasukan berstatus completed" icon="hand-coins" />
          <FinanceMetric label="Refund" value={finance.totals.refunds} detail="Dana yang dikembalikan" icon="wallet" />
          <FinanceMetric label="Pengeluaran" value={finance.totals.expenses} detail="Biaya operasional tercatat" icon="receipt" />
          <FinanceMetric label="Net" value={finance.totals.net} detail={`Saldo reservasi belum lunas ${formatCurrency(outstanding)}`} icon="bank" />
        </section>

        <div id="new-transaction">
          {catalog.properties.length ? (
            <CreatePanel title="Tambah transaksi" description="Hubungkan ke reservasi agar pembayaran otomatis mengurangi saldo yang belum lunas." icon="wallet" open={openCreate}>
              <TransactionForm catalog={catalog} reservations={reservations} action={formAction} today={today} />
            </CreatePanel>
          ) : <EmptyState title="Belum ada properti">Tambahkan properti sebelum mencatat transaksi.</EmptyState>}
        </div>

        <section className="overflow-hidden rounded-[.55rem] border border-charcoal/12 bg-white">
          <header className="flex flex-col gap-3 border-b border-charcoal/10 px-5 py-5 sm:flex-row sm:items-end sm:justify-between sm:px-7">
            <div><p className="kicker text-umber">Ledger</p><h2 className="mt-2 font-serif text-3xl">{finance.transactions.length} transaksi</h2></div>
            <p className="max-w-md text-xs leading-5 text-ink-soft">Hanya transaksi completed masuk ke ringkasan. Void tetap tersimpan melalui audit archive.</p>
          </header>
          <div className="p-3 sm:p-4"><CollectionSearch targetId="finance-ledger" placeholder="Cari kategori, referensi, atau properti…" filters={transactionStatusOptions} /></div>
          <div id="finance-ledger" className="border-t border-charcoal/10">
            {finance.transactions.length ? finance.transactions.map((transaction) => (
              <RecordPanel
                key={transaction.id}
                id={`transaction-${transaction.id}`}
                title={`${transaction.category} · ${formatCurrency(transaction.amount, transaction.currency)}`}
                meta={`${transaction.propertyName}${transaction.reservationReference ? ` · ${transaction.reservationReference}` : ""} · ${formatPmsDate(transaction.occurredOn)} · ${transaction.method.replaceAll("_", " ")}`}
                searchText={`${transaction.category} ${transaction.propertyName} ${transaction.reservationReference ?? ""} ${transaction.reference ?? ""} ${transaction.kind} ${transaction.method} ${transaction.status}`}
                status={transaction.status}
                leading={transaction.kind === "payment" ? <ArrowDownLeft className="size-4" aria-hidden="true" /> : transaction.kind === "refund" ? <ArrowUpRight className="size-4" aria-hidden="true" /> : <ReceiptText className="size-4" aria-hidden="true" />}
                trailing={<StatusPill value={transaction.status} options={transactionStatusOptions} />}
              >
                <TransactionForm transaction={transaction} catalog={catalog} reservations={reservations} action={formAction} today={today} />
              </RecordPanel>
            )) : <div className="p-5"><EmptyState title="Belum ada transaksi">Sistem tidak membuat revenue, biaya, atau saldo fiktif.</EmptyState></div>}
          </div>
        </section>

        <Link href="/admin/reservations" className="flex min-h-14 items-center justify-between rounded-[.45rem] border border-charcoal/12 bg-white px-5 text-sm font-semibold hover:border-olive">
          <span className="flex items-center gap-3"><CircleDollarSign className="size-4 text-olive" aria-hidden="true" />Tinjau saldo reservasi dan pembayaran</span><ArrowUpRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}

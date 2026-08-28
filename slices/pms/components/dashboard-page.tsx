import { ArrowDownLeft, ArrowUpRight, BedDouble, CircleDollarSign, ClipboardCheck, House } from "lucide-react";
import { formatCurrency, formatPmsDate, formatPmsDateTime, humanize, type PmsDashboard } from "@/shared/pms";
import type { PmsFormAction, PmsPageState } from "../types";
import { EmptyState } from "./manager-primitives";
import { PageHeader } from "./page-header";
import { StatusBanner } from "./status-banner";

function Metric({ label, value, detail, icon: Icon }: { label: string; value: string; detail: string; icon: typeof House }) {
  return (
    <article className="bg-white p-6 sm:p-7">
      <Icon className="size-5 text-olive" aria-hidden="true" />
      <p className="mt-7 text-xs font-semibold tracking-[.1em] text-ink-soft uppercase">{label}</p>
      <p className="mt-2 font-serif text-4xl leading-none">{value}</p>
      <p className="mt-3 text-xs leading-6 text-ink-soft">{detail}</p>
    </article>
  );
}

function BookingList({ title, items, direction }: { title: string; items: PmsDashboard["arrivals"]; direction: "in" | "out" }) {
  const Icon = direction === "in" ? ArrowDownLeft : ArrowUpRight;
  return (
    <section className="border border-charcoal/12 bg-white">
      <header className="flex items-center justify-between border-b border-charcoal/10 px-5 py-5 sm:px-7">
        <h2 className="font-serif text-3xl">{title}</h2>
        <Icon className="size-5 text-olive" aria-hidden="true" />
      </header>
      {items.length ? (
        <div className="divide-y divide-charcoal/10">
          {items.map((item) => (
            <article key={item.id} className="grid gap-3 px-5 py-5 sm:grid-cols-[1fr_auto] sm:items-center sm:px-7">
              <div>
                <p className="font-semibold">{item.guestName}</p>
                <p className="mt-1 text-xs leading-5 text-ink-soft">{item.propertyName} · {item.reference}</p>
              </div>
              <p className="text-sm font-semibold">{formatPmsDate(direction === "in" ? item.checkIn : item.checkOut)}</p>
            </article>
          ))}
        </div>
      ) : <p className="p-7 text-sm leading-7 text-ink-soft">Tidak ada {title.toLowerCase()} dalam tujuh hari ke depan.</p>}
    </section>
  );
}

export function PmsDashboardPage({
  dashboard,
  backendError,
  state,
  formAction,
}: {
  dashboard: PmsDashboard;
  backendError: boolean;
  state: PmsPageState;
  formAction: PmsFormAction;
}) {
  const m = dashboard.metrics;
  return (
    <div className="pb-20">
      <PageHeader
        eyebrow="Operations overview"
        title="Satu tempat untuk menjalankan setiap properti."
        description="Kelola inventori, reservasi, tamu, keuangan, dan tugas operasional dalam satu sistem yang siap digunakan oleh properti berikutnya."
        action={dashboard.properties.length === 0 ? (
          <form action={formAction}>
            <input type="hidden" name="operation" value="seed.ruma-kamyna" />
            <input type="hidden" name="returnTo" value="/admin" />
            <button type="submit" className="cta-solid">Siapkan Ruma Kamyna</button>
          </form>
        ) : undefined}
      />
      <div className="mx-auto max-w-[92rem] px-4 pt-8 sm:px-8 lg:px-12">
        <StatusBanner status={state.status} error={state.error || (backendError ? "service" : undefined)} />
        <section className="mt-8 grid gap-px border border-charcoal/12 bg-charcoal/12 sm:grid-cols-2 xl:grid-cols-4">
          <Metric label="Properti aktif" value={String(m.activeProperties)} detail="Portfolio yang sedang beroperasi" icon={House} />
          <Metric label="Reservasi mendatang" value={String(m.upcomingReservations)} detail={`${m.inHouse} tamu sedang menginap`} icon={BedDouble} />
          <Metric label="Tugas terbuka" value={String(m.openTasks)} detail={`${m.arrivalsNextSevenDays} kedatangan dalam 7 hari`} icon={ClipboardCheck} />
          <Metric
            label="Arus kas bulan ini"
            value={formatCurrency(m.incomeThisMonth - m.expensesThisMonth)}
            detail={`Belum dibayar ${formatCurrency(m.outstandingBalance)}`}
            icon={CircleDollarSign}
          />
        </section>

        <section className="mt-10 grid gap-6 xl:grid-cols-2">
          <BookingList title="Kedatangan" items={dashboard.arrivals} direction="in" />
          <BookingList title="Keberangkatan" items={dashboard.departures} direction="out" />
        </section>

        <section className="mt-10 grid gap-6 xl:grid-cols-[1.05fr_.95fr]">
          <div className="border border-charcoal/12 bg-white">
            <header className="border-b border-charcoal/10 px-5 py-5 sm:px-7">
              <p className="kicker text-umber">Portfolio</p>
              <h2 className="mt-3 font-serif text-3xl">Properti aktif</h2>
            </header>
            {dashboard.properties.length ? (
              <div className="divide-y divide-charcoal/10">
                {dashboard.properties.map((property) => (
                  <article key={property.id} className="grid gap-4 px-5 py-5 sm:grid-cols-[1fr_auto] sm:items-center sm:px-7">
                    <div>
                      <p className="font-semibold">{property.name}</p>
                      <p className="mt-1 text-xs text-ink-soft">/{property.slug}</p>
                    </div>
                    <p className="text-xs leading-6 text-ink-soft">
                      {property.bedroomCount ?? "Belum diisi"} kamar · {property.amenityCount} fasilitas
                    </p>
                  </article>
                ))}
              </div>
            ) : <p className="p-7 text-sm leading-7 text-ink-soft">Belum ada properti. Jalankan inisialisasi Ruma Kamyna.</p>}
          </div>

          <div className="border border-charcoal/12 bg-white">
            <header className="border-b border-charcoal/10 px-5 py-5 sm:px-7">
              <p className="kicker text-umber">To do</p>
              <h2 className="mt-3 font-serif text-3xl">Tugas prioritas</h2>
            </header>
            {dashboard.tasks.length ? (
              <div className="divide-y divide-charcoal/10">
                {dashboard.tasks.map((task) => (
                  <article key={task.id} className="px-5 py-5 sm:px-7">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <p className="font-semibold">{task.title}</p>
                      <span className="border border-charcoal/15 px-2 py-1 text-[.62rem] font-semibold tracking-[.08em] uppercase">
                        {humanize(task.priority)}
                      </span>
                    </div>
                    <p className="mt-2 text-xs leading-5 text-ink-soft">{task.propertyName}{task.dueOn ? ` · ${formatPmsDate(task.dueOn)}` : ""}</p>
                  </article>
                ))}
              </div>
            ) : <p className="p-7 text-sm leading-7 text-ink-soft">Tidak ada tugas terbuka.</p>}
          </div>
        </section>

        <section className="mt-10 border border-charcoal/12 bg-white">
          <header className="border-b border-charcoal/10 px-5 py-5 sm:px-7">
            <p className="kicker text-umber">Audit trail</p>
            <h2 className="mt-3 font-serif text-3xl">Aktivitas terbaru</h2>
          </header>
          {dashboard.activity.length ? (
            <ol className="divide-y divide-charcoal/10">
              {dashboard.activity.map((event) => (
                <li key={event.id} className="grid gap-3 px-5 py-4 sm:grid-cols-[1fr_auto] sm:items-center sm:px-7">
                  <div>
                    <p className="text-sm font-semibold">{event.summary}</p>
                    <p className="mt-1 text-xs text-ink-soft">{humanize(event.action)} · {event.resource}</p>
                  </div>
                  <time className="text-xs text-ink-soft">{formatPmsDateTime(event.createdAt)}</time>
                </li>
              ))}
            </ol>
          ) : <EmptyState>Belum ada aktivitas operasional.</EmptyState>}
        </section>
      </div>
    </div>
  );
}

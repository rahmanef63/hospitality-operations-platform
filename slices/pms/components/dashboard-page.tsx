import Link from "next/link";
import {
  ArrowDownLeft,
  ArrowUpRight,
  CalendarDays,
  CircleDollarSign,
  ClipboardCheck,
  House,
  MoveRight,
  Plus,
  UserRound,
} from "lucide-react";
import { formatCurrency, formatPmsDate, formatPmsDateTime, type PmsDashboard } from "@/shared/pms";
import type { PmsFormAction, PmsPageState } from "../types";
import { EmptyState } from "./manager-primitives";
import { PageHeader } from "./page-header";
import { PmsIcon } from "./pms-icon";
import { StatusBanner } from "./status-banner";
import { StatusPill } from "./status-pill";
import { reservationStatusOptions, taskPriorityOptions } from "./ui-options";

function Metric({ label, value, detail, icon, href }: { label: string; value: string; detail: string; icon: "house" | "booking" | "flag" | "wallet"; href: string }) {
  return (
    <Link href={href} className="group bg-white p-5 transition hover:bg-[#f8f8f5] sm:p-6">
      <span className="flex size-10 items-center justify-center rounded-full bg-olive/10 text-olive"><PmsIcon name={icon} /></span>
      <p className="kicker mt-6 text-umber">{label}</p>
      <p className="mt-2 font-serif text-4xl leading-none">{value}</p>
      <p className="mt-3 flex items-center justify-between gap-3 text-xs leading-6 text-ink-soft"><span>{detail}</span><MoveRight className="size-4 shrink-0 transition group-hover:translate-x-1" aria-hidden="true" /></p>
    </Link>
  );
}

function BookingList({ title, items, direction }: { title: string; items: PmsDashboard["arrivals"]; direction: "in" | "out" }) {
  const Icon = direction === "in" ? ArrowDownLeft : ArrowUpRight;
  return (
    <section className="overflow-hidden rounded-[.55rem] border border-charcoal/12 bg-white">
      <header className="flex items-center justify-between border-b border-charcoal/10 px-5 py-5 sm:px-7">
        <div><p className="kicker text-umber">7 hari ke depan</p><h2 className="mt-2 font-serif text-3xl">{title}</h2></div>
        <span className="flex size-10 items-center justify-center rounded-full bg-olive/10 text-olive"><Icon className="size-4" aria-hidden="true" /></span>
      </header>
      {items.length ? (
        <div className="divide-y divide-charcoal/10">
          {items.map((item) => (
            <Link key={item.id} href={`/admin/reservations#reservation-${item.id}`} className="grid min-h-20 grid-cols-[auto_1fr_auto] items-center gap-3 px-5 py-4 transition hover:bg-charcoal/[.025] sm:px-7">
              <time dateTime={direction === "in" ? item.checkIn : item.checkOut} className="flex size-11 flex-col items-center justify-center rounded-[.35rem] bg-charcoal text-center text-ivory">
                <span className="text-[.58rem] font-bold uppercase">{direction === "in" ? "In" : "Out"}</span><span className="font-serif text-lg leading-none">{Number((direction === "in" ? item.checkIn : item.checkOut).slice(-2))}</span>
              </time>
              <span className="min-w-0"><span className="block truncate text-sm font-bold">{item.guestName}</span><span className="mt-1 block truncate text-xs text-ink-soft">{item.propertyName} · {item.reference} · {item.nights} malam</span></span>
              <StatusPill value={item.status} options={reservationStatusOptions} />
            </Link>
          ))}
        </div>
      ) : <div className="p-5"><EmptyState title={`Tidak ada ${title.toLowerCase()}`}>Operasi tujuh hari ke depan belum memiliki item di kategori ini.</EmptyState></div>}
    </section>
  );
}

const quickActions = [
  { href: "/admin/reservations?new=1#new-reservation", label: "Reservasi", detail: "Buat booking dengan total otomatis", icon: Plus },
  { href: "/admin/calendar?new=1#new-block", label: "Blok tanggal", detail: "Owner use atau maintenance", icon: CalendarDays },
  { href: "/admin/guests?new=1#new-guest", label: "Tamu", detail: "Simpan profil kontak baru", icon: UserRound },
  { href: "/admin/tasks?new=1#new-task", label: "Tugas", detail: "Hubungkan pekerjaan ke stay", icon: ClipboardCheck },
] as const;

export function PmsDashboardPage({ dashboard, today, backendError, state, formAction }: {
  dashboard: PmsDashboard;
  today: string;
  backendError: boolean;
  state: PmsPageState;
  formAction: PmsFormAction;
}) {
  const m = dashboard.metrics;
  return (
    <div className="pb-20">
      <PageHeader
        eyebrow={`Operations overview · ${formatPmsDate(today)}`}
        title="Apa yang perlu diperhatikan hari ini."
        description="Ringkasan langsung menuju tindakan: kedatangan, keberangkatan, saldo, tugas, dan akses cepat untuk membuat data operasional baru."
        action={dashboard.properties.length === 0 ? (
          <form action={formAction}><input type="hidden" name="operation" value="seed.ruma-kamyna" /><input type="hidden" name="returnTo" value="/admin" /><button type="submit" className="cta-solid">Siapkan Ruma Kamyna</button></form>
        ) : <Link href="/admin/reservations?new=1#new-reservation" className="cta-solid"><Plus className="size-4" aria-hidden="true" />Reservasi baru</Link>}
      />
      <div className="mx-auto max-w-[92rem] space-y-8 px-4 pt-8 sm:px-8 lg:px-12">
        <StatusBanner status={state.status} error={state.error || (backendError ? "service" : undefined)} />

        <section className="grid gap-px overflow-hidden rounded-[.55rem] border border-charcoal/12 bg-charcoal/10 sm:grid-cols-2 xl:grid-cols-4">
          <Metric label="Properti aktif" value={String(m.activeProperties)} detail="Portfolio yang sedang beroperasi" icon="house" href="/admin/properties" />
          <Metric label="Reservasi mendatang" value={String(m.upcomingReservations)} detail={`${m.inHouse} sedang menginap`} icon="booking" href="/admin/reservations" />
          <Metric label="Tugas terbuka" value={String(m.openTasks)} detail={`${m.arrivalsNextSevenDays} kedatangan dalam 7 hari`} icon="flag" href="/admin/tasks" />
          <Metric label="Arus kas bulan ini" value={formatCurrency(m.incomeThisMonth - m.expensesThisMonth)} detail={`Belum dibayar ${formatCurrency(m.outstandingBalance)}`} icon="wallet" href="/admin/finance" />
        </section>

        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="Aksi cepat">
          {quickActions.map(({ href, label, detail, icon: Icon }) => (
            <Link key={href} href={href} className="group grid min-h-24 grid-cols-[auto_1fr_auto] items-center gap-3 rounded-[.5rem] border border-charcoal/12 bg-white p-4 transition hover:border-olive/40">
              <span className="flex size-10 items-center justify-center rounded-full bg-charcoal text-ivory"><Icon className="size-4" aria-hidden="true" /></span>
              <span><span className="block text-sm font-bold">{label}</span><span className="mt-1 block text-xs leading-5 text-ink-soft">{detail}</span></span>
              <MoveRight className="size-4 text-charcoal/35 transition group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-2"><BookingList title="Kedatangan" items={dashboard.arrivals} direction="in" /><BookingList title="Keberangkatan" items={dashboard.departures} direction="out" /></section>

        <section className="grid gap-6 xl:grid-cols-[1.05fr_.95fr]">
          <div className="overflow-hidden rounded-[.55rem] border border-charcoal/12 bg-white">
            <header className="border-b border-charcoal/10 px-5 py-5 sm:px-7"><p className="kicker text-umber">Portfolio</p><h2 className="mt-2 font-serif text-3xl">Properti aktif</h2></header>
            {dashboard.properties.length ? <div className="divide-y divide-charcoal/10">{dashboard.properties.map((property) => (
              <Link key={property.id} href={`/admin/properties#property-${property.id}`} className="grid min-h-20 grid-cols-[auto_1fr_auto] items-center gap-3 px-5 py-4 hover:bg-charcoal/[.025] sm:px-7">
                <span className="flex size-10 items-center justify-center rounded-full bg-olive/10 text-olive"><House className="size-4" aria-hidden="true" /></span>
                <span><span className="block text-sm font-bold">{property.name}</span><span className="mt-1 block text-xs text-ink-soft">/{property.slug} · {property.bedroomCount ?? "—"} kamar · {property.amenityCount} fasilitas</span></span><MoveRight className="size-4 text-charcoal/32" aria-hidden="true" />
              </Link>
            ))}</div> : <div className="p-5"><EmptyState title="Belum ada properti">Jalankan inisialisasi Ruma Kamyna.</EmptyState></div>}
          </div>

          <div className="overflow-hidden rounded-[.55rem] border border-charcoal/12 bg-white">
            <header className="border-b border-charcoal/10 px-5 py-5 sm:px-7"><p className="kicker text-umber">To do</p><h2 className="mt-2 font-serif text-3xl">Tugas prioritas</h2></header>
            {dashboard.tasks.length ? <div className="divide-y divide-charcoal/10">{dashboard.tasks.map((task) => (
              <Link key={task.id} href={`/admin/tasks#task-${task.id}`} className="grid min-h-20 grid-cols-[1fr_auto] items-center gap-3 px-5 py-4 hover:bg-charcoal/[.025] sm:px-7">
                <span className="min-w-0"><span className="block truncate text-sm font-bold">{task.title}</span><span className="mt-1 block truncate text-xs text-ink-soft">{task.propertyName}{task.dueOn ? ` · ${formatPmsDate(task.dueOn)}` : ""}</span></span><StatusPill value={task.priority} options={taskPriorityOptions} />
              </Link>
            ))}</div> : <div className="p-5"><EmptyState title="Tidak ada tugas terbuka">Board operasional sedang bersih.</EmptyState></div>}
          </div>
        </section>

        <section className="overflow-hidden rounded-[.55rem] border border-charcoal/12 bg-white">
          <header className="flex items-center justify-between border-b border-charcoal/10 px-5 py-5 sm:px-7"><div><p className="kicker text-umber">Audit trail</p><h2 className="mt-2 font-serif text-3xl">Aktivitas terbaru</h2></div><CircleDollarSign className="size-5 text-olive" aria-hidden="true" /></header>
          {dashboard.activity.length ? <ol className="divide-y divide-charcoal/10">{dashboard.activity.map((event) => (
            <li key={event.id} className="grid gap-3 px-5 py-4 sm:grid-cols-[1fr_auto] sm:items-center sm:px-7"><div><p className="text-sm font-semibold">{event.summary}</p><p className="mt-1 text-xs text-ink-soft">{event.action} · {event.resource}</p></div><time className="text-xs text-ink-soft">{formatPmsDateTime(event.createdAt)}</time></li>
          ))}</ol> : <div className="p-5"><EmptyState title="Belum ada aktivitas">Audit muncul setelah operasi pertama disimpan.</EmptyState></div>}
        </section>
      </div>
    </div>
  );
}

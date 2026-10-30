import Link from "next/link";
import { CalendarClock, MoveRight, Plus } from "lucide-react";
import { formatPmsDate, type PmsCatalog, type PmsReservation, type PmsTask } from "@/shared/pms";
import type { PmsFormAction, PmsPageState } from "../types";
import { CollectionSearch } from "./collection-search";
import { CreatePanel, EmptyState, RecordPanel } from "./manager-primitives";
import { PageHeader } from "./page-header";
import { PmsIcon } from "./pms-icon";
import { StatusBanner } from "./status-banner";
import { StatusPill } from "./status-pill";
import { TaskForm } from "./task-form";
import { taskCategoryOptions, taskPriorityOptions, taskStatusOptions } from "./ui-options";

const boardColumns = [
  { status: "open", label: "Terbuka", tone: "neutral" as const },
  { status: "in_progress", label: "Dikerjakan", tone: "blue" as const },
  { status: "done", label: "Selesai", tone: "green" as const },
  { status: "cancelled", label: "Dibatalkan", tone: "red" as const },
];

function TaskCard({ task }: { task: PmsTask }) {
  return (
    <Link href={`#task-${task.id}`} className="block rounded-[.4rem] border border-charcoal/10 bg-white p-3 shadow-[0_6px_24px_-20px_rgba(45,43,39,.5)] transition hover:border-olive/35">
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-bold leading-5">{task.title}</p>
        <StatusPill value={task.priority} options={taskPriorityOptions} />
      </div>
      <p className="mt-3 truncate text-[.64rem] text-ink-soft">{task.propertyName}{task.unitName ? ` · ${task.unitName}` : ""}</p>
      <div className="mt-3 flex items-center justify-between gap-2 text-[.62rem] text-ink-soft">
        <span>{task.dueOn ? formatPmsDate(task.dueOn) : "Tanpa tenggat"}</span><MoveRight className="size-3.5" aria-hidden="true" />
      </div>
    </Link>
  );
}

export function TaskManager({
  catalog,
  reservations,
  tasks,
  today,
  openCreate,
  state,
  backendError,
  formAction,
}: {
  catalog: PmsCatalog;
  reservations: PmsReservation[];
  tasks: PmsTask[];
  today: string;
  openCreate: boolean;
  state: PmsPageState;
  backendError: boolean;
  formAction: PmsFormAction;
}) {
  const urgent = tasks.filter((task) => task.priority === "urgent" && !["done", "cancelled"].includes(task.status)).length;
  const dueToday = tasks.filter((task) => task.dueOn === today && !["done", "cancelled"].includes(task.status)).length;
  return (
    <div className="pb-20">
      <PageHeader
        eyebrow="Operations"
        title="Tugas harian dengan konteks yang utuh."
        description="Relasikan pekerjaan ke reservasi, properti, atau unit. Board memberi gambaran cepat; ledger tetap menyediakan editor lengkap dan audit yang aman."
        action={<Link href="?new=1#new-task" className="cta-solid"><Plus className="size-4" aria-hidden="true" />Tugas baru</Link>}
      />
      <div className="mx-auto max-w-[92rem] space-y-8 px-4 pt-8 sm:px-8 lg:px-12">
        <StatusBanner status={state.status} error={state.error || (backendError ? "service" : undefined)} />
        <section className="grid gap-px overflow-hidden rounded-[.55rem] border border-charcoal/12 bg-charcoal/10 sm:grid-cols-3">
          <article className="bg-white p-5"><PmsIcon name="circle" className="size-5 text-olive" /><p className="kicker mt-5 text-umber">Aktif</p><p className="mt-2 font-serif text-4xl">{tasks.filter((task) => ["open", "in_progress"].includes(task.status)).length}</p></article>
          <article className="bg-white p-5"><CalendarClock className="size-5 text-olive" aria-hidden="true" /><p className="kicker mt-5 text-umber">Jatuh tempo hari ini</p><p className="mt-2 font-serif text-4xl">{dueToday}</p></article>
          <article className="bg-white p-5"><PmsIcon name="alert" className="size-5 text-[#833126]" /><p className="kicker mt-5 text-umber">Urgent</p><p className="mt-2 font-serif text-4xl">{urgent}</p></article>
        </section>

        <div id="new-task">
          {catalog.properties.length ? <CreatePanel title="Tambah tugas" description="Pilih reservasi untuk mengisi properti, unit, dan saran tenggat dari check-in." icon="flag" open={openCreate}><TaskForm catalog={catalog} reservations={reservations} action={formAction} today={today} /></CreatePanel> : <EmptyState title="Belum ada properti">Tugas operasional harus terhubung ke properti.</EmptyState>}
        </div>

        <section className="rounded-[.55rem] border border-charcoal/12 bg-white p-4 sm:p-5">
          <header className="mb-4"><p className="kicker text-umber">Task board</p><h2 className="mt-2 font-serif text-3xl">Status pekerjaan</h2></header>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {boardColumns.map((column) => {
              const items = tasks.filter((task) => task.status === column.status);
              return (
                <section key={column.status} className="rounded-[.45rem] border border-charcoal/10 bg-[#f8f8f5] p-3">
                  <header className="mb-3 flex items-center justify-between gap-2"><StatusPill value={column.tone} label={column.label} tone={column.tone} /><span className="text-xs font-bold text-ink-soft">{items.length}</span></header>
                  <div className="space-y-2">{items.length ? items.slice(0, 6).map((task) => <TaskCard key={task.id} task={task} />) : <p className="rounded-[.35rem] border border-dashed border-charcoal/14 p-4 text-center text-xs text-ink-soft">Kosong</p>}</div>
                  {items.length > 6 ? <p className="mt-3 text-center text-[.64rem] font-semibold text-ink-soft">+{items.length - 6} tugas lain</p> : null}
                </section>
              );
            })}
          </div>
        </section>

        <section className="overflow-hidden rounded-[.55rem] border border-charcoal/12 bg-white">
          <header className="border-b border-charcoal/10 px-5 py-5 sm:px-7"><p className="kicker text-umber">Task ledger</p><h2 className="mt-2 font-serif text-3xl">{tasks.length} tugas</h2></header>
          <div className="p-3 sm:p-4"><CollectionSearch targetId="task-ledger" placeholder="Cari tugas, properti, reservasi, atau assignee…" filters={taskStatusOptions} /></div>
          <div id="task-ledger" className="border-t border-charcoal/10">
            {tasks.length ? tasks.map((task) => (
              <RecordPanel
                key={task.id}
                id={`task-${task.id}`}
                title={task.title}
                meta={`${task.propertyName}${task.unitName ? ` · ${task.unitName}` : ""}${task.reservationReference ? ` · ${task.reservationReference}` : ""}${task.dueOn ? ` · ${formatPmsDate(task.dueOn)}` : ""}${task.assignee ? ` · ${task.assignee}` : ""}`}
                searchText={`${task.title} ${task.propertyName} ${task.unitName ?? ""} ${task.reservationReference ?? ""} ${task.assignee ?? ""} ${task.category} ${task.priority} ${task.status}`}
                status={task.status}
                leading={<PmsIcon name="flag" />}
                trailing={<div className="hidden items-center gap-2 sm:flex"><StatusPill value={task.priority} options={taskPriorityOptions} /><StatusPill value={task.status} options={taskStatusOptions} /></div>}
              >
                <TaskForm task={task} catalog={catalog} reservations={reservations} action={formAction} today={today} />
              </RecordPanel>
            )) : <div className="p-5"><EmptyState title="Belum ada tugas">Tambahkan pekerjaan hanya dari kebutuhan operasional nyata.</EmptyState></div>}
          </div>
        </section>

        <div className="flex flex-wrap gap-2">{taskCategoryOptions.map((option) => <StatusPill key={option.value} value={option.value} options={taskCategoryOptions} />)}</div>
      </div>
    </div>
  );
}

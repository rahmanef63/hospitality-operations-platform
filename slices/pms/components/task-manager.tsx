import {
  TASK_CATEGORIES,
  TASK_PRIORITIES,
  TASK_STATUSES,
  formatPmsDate,
  humanize,
  type PmsCatalog,
  type PmsReservation,
  type PmsTask,
} from "@/shared/pms";
import type { PmsFormAction, PmsPageState } from "../types";
import { Field, SelectInput, TextArea, TextInput } from "./form-controls";
import { CreatePanel, EmptyState, FormActions, RecordPanel } from "./manager-primitives";
import { PageHeader } from "./page-header";
import { StatusBanner } from "./status-banner";

function TaskForm({ task, catalog, reservations, action }: {
  task?: PmsTask; catalog: PmsCatalog; reservations: PmsReservation[]; action: PmsFormAction;
}) {
  const propertyId = task?.propertyId ?? catalog.properties[0]?.id ?? "";
  return (
    <form action={action}>
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <Field label="Properti">
          <SelectInput name="propertyId" defaultValue={propertyId} required>
            {catalog.properties.map((property) => <option key={property.id} value={property.id}>{property.name}</option>)}
          </SelectInput>
        </Field>
        <Field label="Unit (opsional)">
          <SelectInput name="unitId" defaultValue={task?.unitId ?? ""}>
            <option value="">Seluruh properti</option>
            {catalog.units.map((unit) => <option key={unit.id} value={unit.id}>{unit.propertyName} · {unit.name}</option>)}
          </SelectInput>
        </Field>
        <Field label="Reservasi (opsional)">
          <SelectInput name="reservationId" defaultValue={task?.reservationId ?? ""}>
            <option value="">Tidak terkait reservasi</option>
            {reservations.map((reservation) => <option key={reservation.id} value={reservation.id}>{reservation.reference} · {reservation.guestName}</option>)}
          </SelectInput>
        </Field>
        <Field label="Judul"><TextInput name="title" defaultValue={task?.title} required maxLength={140} /></Field>
        <Field label="Kategori">
          <SelectInput name="category" defaultValue={task?.category ?? "housekeeping"}>
            {TASK_CATEGORIES.map((item) => <option key={item} value={item}>{humanize(item)}</option>)}
          </SelectInput>
        </Field>
        <Field label="Prioritas">
          <SelectInput name="priority" defaultValue={task?.priority ?? "normal"}>
            {TASK_PRIORITIES.map((item) => <option key={item} value={item}>{humanize(item)}</option>)}
          </SelectInput>
        </Field>
        <Field label="Status">
          <SelectInput name="status" defaultValue={task?.status ?? "open"}>
            {TASK_STATUSES.map((item) => <option key={item} value={item}>{humanize(item)}</option>)}
          </SelectInput>
        </Field>
        <Field label="Jatuh tempo"><TextInput name="dueOn" type="date" defaultValue={task?.dueOn} /></Field>
        <Field label="Penanggung jawab"><TextInput name="assignee" defaultValue={task?.assignee} maxLength={100} /></Field>
        <Field label="Catatan" className="sm:col-span-2 xl:col-span-4"><TextArea name="notes" defaultValue={task?.notes} maxLength={2000} /></Field>
      </div>
      <FormActions action={action} operation="task.upsert" archiveOperation="task.archive" returnTo="/admin/tasks" id={task?.id} />
    </form>
  );
}

export function TaskManager({ catalog, reservations, tasks, state, backendError, formAction }: {
  catalog: PmsCatalog;
  reservations: PmsReservation[];
  tasks: PmsTask[];
  state: PmsPageState;
  backendError: boolean;
  formAction: PmsFormAction;
}) {
  return (
    <div className="pb-20">
      <PageHeader
        eyebrow="Operations"
        title="Tugas harian yang tidak hilang di percakapan."
        description="Housekeeping, maintenance, inspeksi, dan permintaan tamu dapat dihubungkan ke properti, unit, atau reservasi tertentu."
      />
      <div className="mx-auto max-w-[92rem] space-y-8 px-4 pt-8 sm:px-8 lg:px-12">
        <StatusBanner status={state.status} error={state.error || (backendError ? "service" : undefined)} />
        {catalog.properties.length ? <CreatePanel title="Tambah tugas"><TaskForm catalog={catalog} reservations={reservations} action={formAction} /></CreatePanel> : null}
        <section className="border border-charcoal/12 bg-white">
          <header className="border-b border-charcoal/12 px-5 py-5 sm:px-7"><p className="kicker text-umber">Task board</p><h2 className="mt-3 font-serif text-3xl">{tasks.length} tugas</h2></header>
          {tasks.length ? tasks.map((task) => (
            <RecordPanel
              key={task.id}
              title={task.title}
              meta={`${task.propertyName} · ${humanize(task.category)} · ${humanize(task.priority)} · ${humanize(task.status)}${task.dueOn ? ` · ${formatPmsDate(task.dueOn)}` : ""}`}
            >
              <TaskForm task={task} catalog={catalog} reservations={reservations} action={formAction} />
            </RecordPanel>
          )) : <EmptyState>Belum ada tugas operasional.</EmptyState>}
        </section>
      </div>
    </div>
  );
}

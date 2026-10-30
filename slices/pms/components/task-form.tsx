"use client";

import { CalendarClock, Link2, UserRound } from "lucide-react";
import { useMemo, useState } from "react";
import { type PmsCatalog, type PmsReservation, type PmsTask } from "@/shared/pms";
import type { PmsFormAction } from "../types";
import { Field, TextArea, TextInput } from "./form-controls";
import { FormSection } from "./form-section";
import { FormActions } from "./manager-primitives";
import { propertyOptions } from "./property-options";
import { TagSelect } from "./tag-select";
import {
  taskCategoryOptions,
  taskPriorityOptions,
  taskStatusOptions,
  type PmsSelectOption,
} from "./ui-options";

function reservationOptions(reservations: PmsReservation[]): PmsSelectOption[] {
  return [
    { value: "", label: "Tidak terkait reservasi", icon: "minus", tone: "neutral" },
    ...reservations.map((reservation) => ({
      value: reservation.id,
      label: `${reservation.reference} · ${reservation.guestName}`,
      description: `${reservation.propertyName}${reservation.unitName ? ` · ${reservation.unitName}` : ""} · check-in ${reservation.checkIn}`,
      icon: "booking" as const,
      tone: "blue" as const,
    })),
  ];
}

function unitOptions(catalog: PmsCatalog, propertyId: string): PmsSelectOption[] {
  return [
    { value: "", label: "Seluruh properti", icon: "house", tone: "neutral" },
    ...catalog.units
      .filter((unit) => unit.propertyId === propertyId)
      .map((unit) => ({
        value: unit.id,
        label: unit.name,
        description: `${unit.code} · ${unit.status.replaceAll("_", " ")}`,
        icon: unit.unitType === "room" ? "bed" as const : "house" as const,
        tone: unit.status === "active" ? "olive" as const : "neutral" as const,
      })),
  ];
}

export function TaskForm({
  task,
  catalog,
  reservations,
  action,
  today,
}: {
  task?: PmsTask;
  catalog: PmsCatalog;
  reservations: PmsReservation[];
  action: PmsFormAction;
  today: string;
}) {
  const [reservationId, setReservationId] = useState(task?.reservationId ?? "");
  const linked = reservations.find((reservation) => reservation.id === reservationId);
  const [propertyId, setPropertyId] = useState(task?.propertyId ?? linked?.propertyId ?? catalog.properties[0]?.id ?? "");
  const [unitId, setUnitId] = useState(task?.unitId ?? linked?.unitId ?? "");
  const [dueOn, setDueOn] = useState(task?.dueOn ?? linked?.checkIn ?? today);
  const [dueTouched, setDueTouched] = useState(Boolean(task?.dueOn));
  const units = useMemo(() => unitOptions(catalog, propertyId), [catalog, propertyId]);

  function chooseReservation(next: string) {
    setReservationId(next);
    const reservation = reservations.find((item) => item.id === next);
    if (!reservation) return;
    setPropertyId(reservation.propertyId);
    setUnitId(reservation.unitId ?? "");
    if (!dueTouched) setDueOn(reservation.checkIn);
  }

  function chooseProperty(next: string) {
    setPropertyId(next);
    setUnitId("");
    if (linked?.propertyId !== next) setReservationId("");
  }

  return (
    <form action={action} className="space-y-6">
      <FormSection title="Konteks pekerjaan" description="Hubungkan ke reservasi bila tugas dibuat untuk satu stay. Properti, unit, dan tenggat dapat mengikuti otomatis." icon="booking">
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          <Field label="Reservasi"><TagSelect name="reservationId" options={reservationOptions(reservations)} value={reservationId} onValueChange={chooseReservation} /></Field>
          <Field label="Properti" required><TagSelect name="propertyId" options={propertyOptions(catalog)} value={propertyId} onValueChange={chooseProperty} disabled={Boolean(linked)} required /></Field>
          <Field label="Unit"><TagSelect name="unitId" options={units} value={unitId} onValueChange={setUnitId} disabled={Boolean(linked?.unitId)} /></Field>
        </div>
      </FormSection>
      <FormSection title="Pekerjaan dan prioritas" description="Tag konsisten membuat board operasional lebih cepat dipindai." icon="flag">
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <Field label="Judul" className="sm:col-span-2" required><TextInput name="title" defaultValue={task?.title} required maxLength={140} placeholder="Contoh: Inspeksi area tamu sebelum check-in" /></Field>
          <Field label="Kategori"><TagSelect name="category" options={taskCategoryOptions} defaultValue={task?.category ?? "housekeeping"} /></Field>
          <Field label="Prioritas"><TagSelect name="priority" options={taskPriorityOptions} defaultValue={task?.priority ?? "normal"} /></Field>
          <Field label="Status"><TagSelect name="status" options={taskStatusOptions} defaultValue={task?.status ?? "open"} /></Field>
          <Field label="Jatuh tempo"><TextInput name="dueOn" type="date" value={dueOn} onChange={(event) => { setDueTouched(true); setDueOn(event.target.value); }} /></Field>
          <Field label="Penanggung jawab"><TextInput name="assignee" defaultValue={task?.assignee} maxLength={100} placeholder="Nama atau tim" /></Field>
        </div>
      </FormSection>
      <FormSection title="Detail pelaksanaan" description="Catat instruksi yang cukup untuk menyelesaikan tugas tanpa mencari konteks di percakapan lain." icon="message">
        <Field label="Catatan"><TextArea name="notes" defaultValue={task?.notes} maxLength={2000} placeholder="Checklist, akses, foto yang diperlukan, atau hasil pemeriksaan" /></Field>
        <div className="mt-4 grid gap-3 sm:grid-cols-3 text-xs text-ink-soft">
          <p className="flex items-start gap-2"><Link2 className="mt-0.5 size-3.5 shrink-0 text-olive" aria-hidden="true" />Relasi reservasi tersimpan untuk audit.</p>
          <p className="flex items-start gap-2"><CalendarClock className="mt-0.5 size-3.5 shrink-0 text-olive" aria-hidden="true" />Tenggat dapat mengikuti check-in.</p>
          <p className="flex items-start gap-2"><UserRound className="mt-0.5 size-3.5 shrink-0 text-olive" aria-hidden="true" />Assignee tetap opsional.</p>
        </div>
      </FormSection>
      <FormActions action={action} operation="task.upsert" archiveOperation="task.archive" returnTo="/admin/tasks" id={task?.id} />
    </form>
  );
}

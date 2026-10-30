"use client";

import { AlertTriangle, CalendarRange, Clock3 } from "lucide-react";
import { useMemo, useState } from "react";
import { addDays, daysBetween, type PmsAvailabilityBlock, type PmsCatalog } from "@/shared/pms";
import type { PmsFormAction } from "../types";
import { accommodationOptions, initialAccommodation, resolveAccommodation } from "./accommodation-options";
import { Field, TextArea, TextInput } from "./form-controls";
import { FormSection } from "./form-section";
import { FormActions } from "./manager-primitives";
import { TagSelect } from "./tag-select";
import { blockReasonOptions } from "./ui-options";

export function BlockForm({
  block,
  catalog,
  action,
  today,
  returnTo = "/admin/calendar",
}: {
  block?: PmsAvailabilityBlock;
  catalog: PmsCatalog;
  action: PmsFormAction;
  today: string;
  returnTo?: string;
}) {
  const options = useMemo(() => accommodationOptions(catalog, "Blok seluruh properti"), [catalog]);
  const [accommodation, setAccommodation] = useState(initialAccommodation(block, catalog));
  const selected = resolveAccommodation(accommodation, catalog);
  const [startDate, setStartDate] = useState(block?.startDate ?? today);
  const [endDate, setEndDate] = useState(block?.endDate ?? addDays(today, 1));
  const duration = daysBetween(startDate, endDate);

  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="propertyId" value={selected.propertyId} />
      <input type="hidden" name="unitId" value={selected.unitId} />
      <FormSection title="Inventori yang diblokir" description="Pilih whole property atau unit. Blok properti akan menutup seluruh unit di bawahnya." icon="calendar">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Akomodasi" required><TagSelect name="accommodation" options={options} value={accommodation} onValueChange={setAccommodation} required /></Field>
          <Field label="Alasan"><TagSelect name="reason" options={blockReasonOptions} defaultValue={block?.reason ?? "maintenance"} /></Field>
          <Field label="Judul" className="sm:col-span-2" required><TextInput name="title" defaultValue={block?.title} required maxLength={100} placeholder="Contoh: Perawatan kolam" /></Field>
        </div>
      </FormSection>
      <FormSection title="Rentang tanggal" description="Tanggal akhir menggunakan aturan checkout: hari terakhir tidak ikut diblokir." icon="clock">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Mulai" required><TextInput name="startDate" type="date" value={startDate} onChange={(event) => {
            const next = event.target.value;
            setStartDate(next);
            if (endDate <= next) setEndDate(addDays(next, 1));
          }} required /></Field>
          <Field label="Selesai" required><TextInput name="endDate" type="date" min={addDays(startDate, 1)} value={endDate} onChange={(event) => setEndDate(event.target.value)} required /></Field>
          <Field label="Catatan" className="sm:col-span-2"><TextArea name="notes" defaultValue={block?.notes} maxLength={1000} placeholder="Detail pekerjaan atau alasan penutupan" /></Field>
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <span className="inline-flex min-h-9 items-center gap-2 rounded-full bg-olive/10 px-3 text-xs font-semibold text-olive"><CalendarRange className="size-4" aria-hidden="true" />{duration} malam diblokir</span>
          <span className="inline-flex min-h-9 items-center gap-2 rounded-full bg-charcoal/[.05] px-3 text-xs font-semibold"><Clock3 className="size-4" aria-hidden="true" />{selected.unit?.name ?? selected.property?.name}</span>
          {duration > 31 ? <span className="inline-flex min-h-9 items-center gap-2 rounded-full bg-[#f1e4cb] px-3 text-xs font-semibold text-[#825912]"><AlertTriangle className="size-4" aria-hidden="true" />Blok lebih dari 31 malam</span> : null}
        </div>
      </FormSection>
      <FormActions action={action} operation="block.upsert" archiveOperation="block.archive" returnTo={returnTo} id={block?.id} />
    </form>
  );
}

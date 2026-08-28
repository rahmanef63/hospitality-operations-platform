import { Archive, ChevronDown, Plus, Save } from "lucide-react";
import type { ReactNode } from "react";
import type { PmsFormAction } from "../types";

export function CreatePanel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <details className="group border border-charcoal/14 bg-[#f8f8f5]">
      <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-5 text-sm font-semibold">
        <span className="flex items-center gap-3"><Plus className="size-4" aria-hidden="true" />{title}</span>
        <ChevronDown className="size-4 transition-transform group-open:rotate-180" aria-hidden="true" />
      </summary>
      <div className="border-t border-charcoal/12 p-5 sm:p-7">{children}</div>
    </details>
  );
}

export function RecordPanel({
  title,
  meta,
  children,
}: {
  title: string;
  meta?: string;
  children: ReactNode;
}) {
  return (
    <details className="group border-b border-charcoal/12 bg-white last:border-b-0">
      <summary className="grid min-h-16 cursor-pointer list-none grid-cols-[1fr_auto] items-center gap-5 px-5 py-4 sm:px-7">
        <div>
          <p className="font-semibold">{title}</p>
          {meta ? <p className="mt-1 text-xs leading-5 text-ink-soft">{meta}</p> : null}
        </div>
        <ChevronDown className="size-4 transition-transform group-open:rotate-180" aria-hidden="true" />
      </summary>
      <div className="border-t border-charcoal/10 bg-[#f8f8f5] p-5 sm:p-7">{children}</div>
    </details>
  );
}

export function FormActions({
  action,
  operation,
  returnTo,
  id,
  archiveOperation,
}: {
  action: PmsFormAction;
  operation: string;
  returnTo: string;
  id?: string;
  archiveOperation?: string;
}) {
  return (
    <div className="mt-7 flex flex-col gap-3 border-t border-charcoal/12 pt-5 sm:flex-row">
      <button type="submit" name="operation" value={operation} className="cta-solid flex-1"><Save className="size-4" aria-hidden="true" />Simpan</button>
      {id && archiveOperation ? (
        <button
          type="submit"
          formAction={action}
          name="operation"
          value={archiveOperation}
          className="cta-outline border-[#843f35] text-[#843f35] hover:bg-[#843f35] hover:text-white"
        >
          <Archive className="size-4" aria-hidden="true" />Arsipkan
        </button>
      ) : null}
      <input type="hidden" name="defaultOperation" value={operation} />
      <input type="hidden" name="returnTo" value={returnTo} />
      {id ? <input type="hidden" name="id" value={id} /> : null}
    </div>
  );
}

export function EmptyState({ children }: { children: ReactNode }) {
  return <p className="border border-charcoal/12 bg-[#f8f8f5] p-7 text-sm leading-7 text-ink-soft">{children}</p>;
}

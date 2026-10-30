"use client";

import { Archive, LoaderCircle, Save } from "lucide-react";
import { useFormStatus } from "react-dom";
import type { PmsFormAction } from "../types";

function SubmitButton({ operation }: { operation: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" name="operation" value={operation} disabled={pending} className="cta-solid min-w-0 flex-1 disabled:cursor-wait disabled:opacity-65">
      {pending ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : <Save className="size-4" aria-hidden="true" />}
      {pending ? "Menyimpan…" : "Simpan perubahan"}
    </button>
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
    <div className="sticky bottom-[calc(4.75rem+env(safe-area-inset-bottom))] z-20 -mx-5 mt-7 flex flex-col gap-3 border-t border-charcoal/12 bg-paper/96 px-5 py-4 shadow-[0_-12px_30px_rgba(45,43,39,.08)] backdrop-blur-xl sm:-mx-7 sm:flex-row sm:px-7 lg:bottom-0">
      <div className="min-w-0 flex-1">
        <SubmitButton operation={operation} />
        <p className="mt-2 text-[.64rem] leading-5 text-ink-soft">Validasi akhir tetap dilakukan di server sebelum data ditulis.</p>
      </div>
      {id && archiveOperation ? (
        <button
          type="submit"
          formAction={action}
          name="operation"
          value={archiveOperation}
          onClick={(event) => {
            if (!window.confirm("Arsipkan data ini? Riwayat tetap tersimpan dan tidak akan tampil pada daftar aktif.")) event.preventDefault();
          }}
          className="cta-outline border-[#843f35] text-[#843f35] hover:bg-[#843f35] hover:text-white sm:self-start"
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

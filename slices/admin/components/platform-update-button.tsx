"use client";

import { LoaderCircle, RefreshCw } from "lucide-react";
import { useFormStatus } from "react-dom";
import type { AdminFormAction } from "../types";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="cta-solid min-h-12 disabled:cursor-wait disabled:opacity-60">
      {pending ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : <RefreshCw className="size-4" aria-hidden="true" />}
      {pending ? "Memulai update…" : "Update now"}
    </button>
  );
}

export function PlatformUpdateButton({ action, prNumber, version }: { action: AdminFormAction; prNumber: number; version: string }) {
  return (
    <form action={action}>
      <input type="hidden" name="prNumber" value={prNumber} />
      <input type="hidden" name="expectedVersion" value={version} />
      <Submit />
    </form>
  );
}

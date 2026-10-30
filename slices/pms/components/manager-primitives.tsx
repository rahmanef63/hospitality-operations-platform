import { ChevronDown, Inbox, Plus } from "lucide-react";
import type { ReactNode } from "react";
import { PmsIcon, type PmsIconName } from "./pms-icon";

export { FormActions } from "./form-actions";

export function CreatePanel({
  title,
  description,
  icon = "circle",
  children,
  open = false,
}: {
  title: string;
  description?: string;
  icon?: PmsIconName;
  children: ReactNode;
  open?: boolean;
}) {
  return (
    <details open={open} className="group overflow-visible rounded-[.55rem] border border-charcoal/14 bg-[#f8f8f5] shadow-[0_8px_30px_-24px_rgba(45,43,39,.4)]">
      <summary className="grid min-h-16 cursor-pointer list-none grid-cols-[auto_1fr_auto] items-center gap-3 px-4 py-3 text-sm font-semibold sm:px-5">
        <span className="flex size-10 items-center justify-center rounded-full bg-charcoal text-ivory"><Plus className="size-4" aria-hidden="true" /></span>
        <span>
          <span className="block">{title}</span>
          {description ? <span className="mt-1 block text-xs font-normal leading-5 text-ink-soft">{description}</span> : null}
        </span>
        <span className="flex size-10 items-center justify-center rounded-full border border-charcoal/12 bg-white text-charcoal/60"><PmsIcon name={icon} /><ChevronDown className="ml-1 size-3.5 transition-transform group-open:rotate-180" aria-hidden="true" /></span>
      </summary>
      <div className="overflow-visible border-t border-charcoal/12 p-5 sm:p-7">{children}</div>
    </details>
  );
}

export function RecordPanel({
  id,
  title,
  meta,
  leading,
  trailing,
  searchText,
  status,
  children,
}: {
  id?: string;
  title: string;
  meta?: string;
  leading?: ReactNode;
  trailing?: ReactNode;
  searchText?: string;
  status?: string;
  children: ReactNode;
}) {
  return (
    <details
      id={id}
      data-search={searchText ?? `${title} ${meta ?? ""}`}
      data-status={status}
      className="group scroll-mt-24 overflow-visible border-b border-charcoal/10 bg-white last:border-b-0"
    >
      <summary className="grid min-h-18 cursor-pointer list-none grid-cols-[auto_1fr_auto] items-center gap-3 px-4 py-4 transition hover:bg-charcoal/[.025] sm:gap-5 sm:px-7">
        {leading ? <span className="flex size-10 items-center justify-center rounded-full border border-charcoal/10 bg-[#f8f8f5] text-olive">{leading}</span> : null}
        <span className="min-w-0">
          <span className="block truncate text-sm font-bold sm:text-base">{title}</span>
          {meta ? <span className="mt-1 block truncate text-xs leading-5 text-ink-soft">{meta}</span> : null}
        </span>
        <span className="flex items-center gap-2">
          {trailing}
          <ChevronDown className="size-4 text-charcoal/42 transition-transform group-open:rotate-180" aria-hidden="true" />
        </span>
      </summary>
      <div className="overflow-visible border-t border-charcoal/10 bg-[#f8f8f5] p-5 sm:p-7">{children}</div>
    </details>
  );
}

export function EmptyState({
  title = "Belum ada data",
  children,
  action,
}: {
  title?: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="grid min-h-44 place-items-center rounded-[.45rem] border border-dashed border-charcoal/18 bg-[#f8f8f5] p-7 text-center">
      <div className="max-w-md">
        <Inbox className="mx-auto size-6 text-olive" aria-hidden="true" />
        <p className="mt-4 font-serif text-2xl">{title}</p>
        <div className="mt-2 text-sm leading-7 text-ink-soft">{children}</div>
        {action ? <div className="mt-5">{action}</div> : null}
      </div>
    </div>
  );
}

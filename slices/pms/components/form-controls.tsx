import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { PmsIcon, type PmsIconName } from "./pms-icon";

const inputClass = "mt-2 min-h-12 w-full rounded-[.35rem] border border-charcoal/16 bg-white px-3 text-sm shadow-[0_1px_2px_rgba(45,43,39,.04)] outline-none transition placeholder:text-charcoal/34 hover:border-charcoal/26 focus:border-olive focus:ring-2 focus:ring-olive/20 disabled:cursor-not-allowed disabled:bg-charcoal/[.035] disabled:text-charcoal/55";

export function Field({
  label,
  hint,
  children,
  className = "",
  required = false,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
  className?: string;
  required?: boolean;
}) {
  return (
    <label className={`block min-w-0 ${className}`}>
      <span className="flex items-center gap-1.5 text-[.68rem] font-bold tracking-[.08em] text-charcoal/70 uppercase">
        {label}{required ? <span className="text-[#843f35]" aria-hidden="true">*</span> : null}
      </span>
      {children}
      {hint ? <span className="mt-2 block text-xs leading-5 text-ink-soft">{hint}</span> : null}
    </label>
  );
}

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${inputClass} ${props.className ?? ""}`} />;
}

export function SelectInput(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`${inputClass} ${props.className ?? ""}`} />;
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${inputClass} min-h-28 resize-y py-3 leading-6 ${props.className ?? ""}`} />;
}

export function Checkbox({
  name,
  label,
  description,
  icon,
  defaultChecked = false,
}: {
  name: string;
  label: string;
  description?: string;
  icon?: PmsIconName;
  defaultChecked?: boolean;
}) {
  return (
    <label className="grid min-h-16 cursor-pointer grid-cols-[auto_1fr_auto] items-center gap-3 rounded-[.4rem] border border-charcoal/12 bg-[#f8f8f5] px-4 py-3 transition hover:border-charcoal/24 has-[:checked]:border-olive/40 has-[:checked]:bg-olive/[.07]">
      {icon ? <span className="flex size-9 items-center justify-center rounded-full bg-white text-olive"><PmsIcon name={icon} /></span> : null}
      <span>
        <span className="block text-sm font-semibold">{label}</span>
        {description ? <span className="mt-1 block text-xs leading-5 text-ink-soft">{description}</span> : null}
      </span>
      <input name={name} type="checkbox" defaultChecked={defaultChecked} className="size-4 accent-[#66705c]" />
    </label>
  );
}

import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

const inputClass = "mt-2 min-h-12 w-full border border-charcoal/18 bg-white px-3 text-sm outline-none focus:border-olive focus:ring-2 focus:ring-olive/20";

export function Field({
  label,
  hint,
  children,
  className = "",
}: {
  label: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="text-xs font-semibold tracking-[.08em] text-charcoal/72 uppercase">{label}</span>
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

export function Checkbox({ name, label, defaultChecked = false }: { name: string; label: string; defaultChecked?: boolean }) {
  return (
    <label className="flex min-h-11 items-center gap-3 text-sm">
      <input name={name} type="checkbox" defaultChecked={defaultChecked} className="size-4 accent-[#66705c]" />
      <span>{label}</span>
    </label>
  );
}

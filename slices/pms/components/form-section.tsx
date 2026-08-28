import type { ReactNode } from "react";
import { PmsIcon, type PmsIconName } from "./pms-icon";

export function FormSection({
  title,
  description,
  icon,
  children,
  className = "",
}: {
  title: string;
  description?: string;
  icon?: PmsIconName;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-[.45rem] border border-charcoal/12 bg-white ${className}`}>
      <header className="grid gap-3 border-b border-charcoal/10 px-5 py-4 sm:grid-cols-[auto_1fr] sm:items-start sm:px-6">
        {icon ? <span className="flex size-9 items-center justify-center rounded-full bg-olive/10 text-olive"><PmsIcon name={icon} /></span> : null}
        <div>
          <h3 className="text-sm font-bold">{title}</h3>
          {description ? <p className="mt-1 text-xs leading-5 text-ink-soft">{description}</p> : null}
        </div>
      </header>
      <div className="p-5 sm:p-6">{children}</div>
    </section>
  );
}

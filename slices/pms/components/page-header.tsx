import type { ReactNode } from "react";

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <header className="border-b border-charcoal/12 bg-[#f8f8f5] px-4 py-10 sm:px-8 lg:px-12 lg:py-14">
      <div className="mx-auto flex max-w-[92rem] flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="kicker text-umber">{eyebrow}</p>
          <h1 className="mt-5 max-w-5xl font-serif text-5xl leading-[.9] tracking-[-.04em] sm:text-7xl">{title}</h1>
          <p className="mt-6 max-w-2xl text-sm leading-7 text-ink-soft sm:text-base">{description}</p>
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
    </header>
  );
}

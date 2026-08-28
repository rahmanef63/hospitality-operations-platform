import Link from "next/link";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { BrandLockup } from "@/shared/brand";
import type { SiteHeaderProps } from "../types";

export function SiteHeader({ navigation }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-charcoal/10 bg-ivory/90 backdrop-blur-xl">
      <div className="page-shell flex h-20 items-center justify-between gap-6">
        <Link href="/" aria-label="Kamyna Living home" className="shrink-0">
          <BrandLockup compact />
        </Link>

        <nav aria-label="Primary navigation" className="hidden items-center gap-8 lg:flex">
          {navigation.map((item, index) => {
            const isLast = index === navigation.length - 1;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={
                  isLast
                    ? "inline-flex items-center gap-2 rounded-full bg-charcoal px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-ivory transition-colors hover:bg-muted-brown"
                    : "text-xs font-semibold uppercase tracking-[0.16em] text-charcoal/75 transition-colors hover:text-charcoal"
                }
              >
                {item.label}
                {isLast ? <ArrowUpRight className="size-3.5" aria-hidden="true" /> : null}
              </Link>
            );
          })}
        </nav>

        <details className="group relative lg:hidden">
          <summary
            className="flex size-11 cursor-pointer list-none items-center justify-center rounded-full border border-charcoal/15 bg-paper transition-colors hover:bg-warm-sand/45"
            aria-label="Open navigation"
          >
            <Menu className="size-5 group-open:hidden" aria-hidden="true" />
            <X className="hidden size-5 group-open:block" aria-hidden="true" />
          </summary>
          <nav
            aria-label="Mobile navigation"
            className="soft-shadow absolute right-0 top-14 w-[min(20rem,calc(100vw-2rem))] rounded-3xl border border-charcoal/10 bg-paper p-3"
          >
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center justify-between rounded-2xl px-5 py-4 text-sm font-semibold transition-colors hover:bg-warm-sand/40"
              >
                {item.label}
                <ArrowUpRight className="size-4 text-earth-ink" aria-hidden="true" />
              </Link>
            ))}
          </nav>
        </details>
      </div>
    </header>
  );
}

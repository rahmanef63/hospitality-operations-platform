import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { BotanicalMark, BrandLockup } from "@/shared/brand";
import { COPYRIGHT_YEAR } from "@/shared/config/site";
import type { SiteFooterProps } from "../types";

export function SiteFooter({ footer }: SiteFooterProps) {
  return (
    <footer className="border-t border-ivory/10 bg-charcoal pb-[calc(4.75rem+env(safe-area-inset-bottom))] text-ivory md:pb-0">
      <div className="page-shell content-inset grid gap-16 py-16 lg:grid-cols-[1.3fr_.7fr] lg:gap-24 lg:py-24">
        <div className="scroll-reveal scroll-reveal-left">
          <BrandLockup compact inverse />
          <p className="text-balance mt-10 max-w-3xl font-serif text-5xl leading-[0.95] tracking-[-0.025em] text-ivory/95 sm:text-6xl lg:text-7xl">
            {footer.statement}
          </p>
        </div>

        <div className="scroll-reveal scroll-reveal-right flex flex-col justify-between gap-14 border-t border-ivory/15 pt-7 lg:border-l lg:border-t-0 lg:pl-12 lg:pt-0">
          <nav aria-label="Footer navigation" className="grid gap-1">
            {footer.links.map((item) => (
              <Link
                prefetch={false}
                key={item.href}
                href={item.href}
                className="group flex items-center justify-between border-b border-ivory/12 py-4 text-sm text-ivory/72 transition-colors hover:text-ivory"
              >
                {item.label}
                <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
              </Link>
            ))}
          </nav>
          <BotanicalMark className="size-16 text-warm-sand/70" />
        </div>
      </div>

      <div className="border-t border-ivory/10">
        <div className="page-shell content-inset flex flex-col gap-3 py-6 text-xs text-ivory/55 sm:flex-row sm:items-center sm:justify-between">
          <p>© {COPYRIGHT_YEAR} {footer.legal}</p>
          <p className="lowercase tracking-[0.18em]">return to stillness</p>
        </div>
      </div>
    </footer>
  );
}

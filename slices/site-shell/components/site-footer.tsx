import Link from "next/link";
import { BrandLockup, BotanicalMark } from "@/shared/brand";
import type { SiteFooterProps } from "../types";

export function SiteFooter({ footer }: SiteFooterProps) {
  return (
    <footer className="border-t border-ivory/10 bg-charcoal text-ivory">
      <div className="page-shell grid gap-14 py-16 lg:grid-cols-[1.3fr_.7fr] lg:py-20">
        <div>
          <BrandLockup compact inverse />
          <p className="mt-8 max-w-md font-serif text-3xl leading-tight text-ivory/90 sm:text-4xl">
            {footer.statement}
          </p>
        </div>
        <div className="grid content-between gap-12 sm:grid-cols-2 lg:grid-cols-1">
          <nav aria-label="Footer navigation" className="grid gap-3">
            {footer.links.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="w-fit text-sm text-ivory/70 transition-colors hover:text-ivory"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <BotanicalMark className="size-16 text-warm-sand/75" />
        </div>
      </div>
      <div className="border-t border-ivory/10">
        <div className="page-shell flex flex-col gap-2 py-6 text-xs text-ivory/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© {footer.legal}</p>
          <p>return to stillness</p>
        </div>
      </div>
    </footer>
  );
}

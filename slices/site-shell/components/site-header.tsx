import Link from "next/link";
import { Menu, X } from "lucide-react";
import { BrandLockup } from "@/shared/brand";
import type { NavigationItem } from "@/shared/content";

type SiteHeaderProps = { navigation: NavigationItem[] };

export function SiteHeader({ navigation }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-charcoal/12 bg-paper/95 backdrop-blur-md">
      <div className="page-shell flex min-h-18 items-center justify-between gap-6 py-3">
        <Link href="/" aria-label="Kamyna Living home" className="shrink-0">
          <BrandLockup compact />
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary navigation">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="relative py-3 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-charcoal/70 transition-colors hover:text-charcoal"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <details className="group relative md:hidden">
          <summary className="flex size-12 cursor-pointer list-none items-center justify-center border border-charcoal/16 bg-ivory text-charcoal transition-colors hover:bg-warm-sand/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive focus-visible:ring-offset-2 [&::-webkit-details-marker]:hidden">
            <span className="sr-only">Toggle navigation</span>
            <Menu className="size-5 group-open:hidden" aria-hidden="true" />
            <X className="hidden size-5 group-open:block" aria-hidden="true" />
          </summary>
          <nav
            className="absolute right-0 top-[calc(100%+0.75rem)] z-50 w-[min(20rem,calc(100vw-2rem))] border border-charcoal/12 bg-paper p-4 shadow-[0_24px_70px_rgba(45,43,39,0.16)]"
            aria-label="Mobile navigation"
          >
            {navigation.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex min-h-13 items-center justify-between border-b border-charcoal/12 px-2 text-sm font-semibold last:border-b-0"
              >
                <span>{item.label}</span>
                <span className="font-serif text-2xl text-charcoal/55" aria-hidden="true">
                  0{index + 1}
                </span>
              </Link>
            ))}
          </nav>
        </details>
      </div>
    </header>
  );
}

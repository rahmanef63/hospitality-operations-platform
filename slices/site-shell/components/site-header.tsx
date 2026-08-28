import Link from "next/link";
import { Menu, X } from "lucide-react";
import { BrandLockup } from "@/shared/brand";
import type { NavigationItem } from "@/shared/content";

type SiteHeaderProps = { navigation: NavigationItem[] };

export function SiteHeader({ navigation }: SiteHeaderProps) {
  return (
    <header className="relative sticky top-0 z-50 border-b border-charcoal/12 bg-paper/95 pt-[env(safe-area-inset-top)] backdrop-blur-md">
      <div className="page-shell content-inset flex min-h-18 items-center justify-between gap-6 py-3">
        <Link prefetch={false} href="/" aria-label="Kamyna Living home" className="shrink-0">
          <BrandLockup compact />
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary navigation">
          {navigation.map((item) => (
            <Link
              prefetch={false}
              key={item.href}
              href={item.href}
              className="relative py-3 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-charcoal/70 transition-colors hover:text-charcoal"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <details className="group md:hidden">
          <summary className="flex size-12 cursor-pointer list-none items-center justify-center border border-charcoal/16 bg-ivory text-charcoal transition-colors hover:bg-warm-sand/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive focus-visible:ring-offset-2 [&::-webkit-details-marker]:hidden">
            <span className="sr-only">Toggle navigation</span>
            <Menu className="size-5 group-open:hidden" aria-hidden="true" />
            <X className="hidden size-5 group-open:block" aria-hidden="true" />
          </summary>
          <nav
            className="fixed inset-x-0 top-[calc(4.5rem+env(safe-area-inset-top))] z-50 hidden w-full border-y border-charcoal/12 bg-paper shadow-[0_24px_70px_rgba(45,43,39,0.16)] group-open:block"
            aria-label="Mobile navigation"
          >
            <div className="content-inset divide-y divide-charcoal/12">
              {navigation.map((item) => (
                <Link
                  prefetch={false}
                  key={item.href}
                  href={item.href}
                  className="flex min-h-14 w-full items-center text-sm font-semibold"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>
        </details>
      </div>
      <span className="scroll-progress" aria-hidden="true" />
    </header>
  );
}

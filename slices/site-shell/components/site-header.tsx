import Link from "next/link";
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

      </div>
      <span className="scroll-progress" aria-hidden="true" />
    </header>
  );
}

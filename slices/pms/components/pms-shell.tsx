import Link from "next/link";
import { ArrowUpRight, LogOut, Plus } from "lucide-react";
import type { PmsShellProps } from "../types";
import { PmsDesktopNav, PmsMobileDock } from "./pms-nav";

export function PmsShell({ children, sessionEmail }: PmsShellProps) {
  return (
    <div className="min-h-screen bg-[#eceee9] text-charcoal lg:grid lg:grid-cols-[17rem_minmax(0,1fr)]">
      <aside className="sticky top-0 hidden h-screen flex-col bg-charcoal text-ivory lg:flex">
        <div className="flex min-h-24 items-center border-b border-ivory/12 px-7">
          <div>
            <p className="font-serif text-3xl leading-none">Hospitality</p>
            <p className="mt-1.5 text-[.58rem] font-semibold tracking-[.2em] text-warm-sand uppercase">Homestay OS</p>
          </div>
        </div>
        <div className="px-4 pt-5">
          <Link href="/admin/reservations?new=1#new-reservation" className="flex min-h-12 items-center justify-center gap-2 rounded-[.35rem] bg-ivory px-4 text-[.65rem] font-bold tracking-[.08em] text-charcoal uppercase transition hover:bg-warm-sand">
            <Plus className="size-4" aria-hidden="true" /> Reservasi baru
          </Link>
        </div>
        <PmsDesktopNav />
        <div className="border-t border-ivory/12 p-4">
          <p className="truncate px-3 text-xs text-ivory/52">{sessionEmail}</p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Link
              href="/"
              target="_blank"
              className="flex min-h-11 items-center justify-center gap-2 border border-ivory/18 text-[.62rem] font-semibold tracking-[.08em] uppercase hover:bg-ivory hover:text-charcoal"
            >
              Situs <ArrowUpRight className="size-3.5" aria-hidden="true" />
            </Link>
            <form action="/api/admin/session" method="post">
              <input type="hidden" name="intent" value="logout" />
              <button
                type="submit"
                className="flex min-h-11 w-full items-center justify-center gap-2 border border-ivory/18 text-[.62rem] font-semibold tracking-[.08em] uppercase hover:bg-ivory hover:text-charcoal"
              >
                Keluar <LogOut className="size-3.5" aria-hidden="true" />
              </button>
            </form>
          </div>
        </div>
      </aside>

      <div className="sticky top-0 z-40 flex min-h-16 items-center justify-between gap-4 border-b border-charcoal/12 bg-charcoal px-4 text-ivory lg:hidden">
        <div>
          <p className="font-serif text-2xl leading-none">Hospitality</p>
          <p className="mt-1 text-[.52rem] font-semibold tracking-[.18em] text-warm-sand uppercase">Homestay OS</p>
        </div>
        <Link href="/admin/reservations?new=1#new-reservation" className="flex min-h-11 items-center gap-2 rounded-[.3rem] border border-ivory/18 px-3 text-[.6rem] font-semibold tracking-[.08em] uppercase">
          <Plus className="size-3.5" aria-hidden="true" /> Reservasi
        </Link>
      </div>

      <main id="main-content" className="min-w-0 pb-[calc(5rem+env(safe-area-inset-bottom))] lg:pb-0">{children}</main>
      <PmsMobileDock sessionEmail={sessionEmail} />
    </div>
  );
}

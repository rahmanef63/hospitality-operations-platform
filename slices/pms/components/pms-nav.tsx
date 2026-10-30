"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BedDouble,
  Bot,
  BookOpenText,
  CalendarDays,
  ChevronUp,
  CircleDollarSign,
  ClipboardCheck,
  Gauge,
  House,
  LogOut,
  MoreHorizontal,
  PanelsTopLeft,
  Sparkles,
  Settings2,
  UserRound,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

const groups = [
  {
    label: "Operations",
    items: [
      { href: "/admin", label: "Dashboard", icon: Gauge },
      { href: "/admin/calendar", label: "Kalender", icon: CalendarDays },
      { href: "/admin/reservations", label: "Reservasi", icon: BookOpenText },
      { href: "/admin/guests", label: "Tamu", icon: UserRound },
    ],
  },
  {
    label: "Portfolio",
    items: [
      { href: "/admin/properties", label: "Properti", icon: House },
      { href: "/admin/units", label: "Unit", icon: BedDouble },
      { href: "/admin/amenities", label: "Fasilitas", icon: Sparkles },
    ],
  },
  {
    label: "Control",
    items: [
      { href: "/admin/finance", label: "Keuangan", icon: CircleDollarSign },
      { href: "/admin/tasks", label: "Tugas", icon: ClipboardCheck },
      { href: "/admin/welcome", label: "Sambutan", icon: BookOpenText },
      { href: "/admin/ai", label: "AI & Bahasa", icon: Bot },
      { href: "/admin/cms", label: "CMS", icon: PanelsTopLeft },
      { href: "/admin/settings", label: "Settings", icon: Settings2 },
    ],
  },
] as const;

const primaryDockItems = [
  groups[0].items[0],
  groups[0].items[1],
  groups[0].items[2],
  groups[2].items[1],
] as const;

const moreItems = [
  groups[0].items[3],
  ...groups[1].items,
  groups[2].items[0],
  groups[2].items[2],
  groups[2].items[3],
  groups[2].items[4],
  groups[2].items[5],
] as const;

function isCurrent(pathname: string, href: string) {
  return href === "/admin" ? pathname === href : pathname.startsWith(href);
}

export function PmsDesktopNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Admin navigation" className="hidden min-h-0 flex-1 overflow-y-auto px-4 py-6 lg:block">
      {groups.map((group) => (
        <section key={group.label} className="mb-7 last:mb-0">
          <p className="px-3 text-[0.58rem] font-bold tracking-[.18em] text-ivory/38 uppercase">{group.label}</p>
          <div className="mt-2 space-y-1">
            {group.items.map(({ href, label, icon: Icon }) => {
              const active = isCurrent(pathname, href);
              return (
                <Link
                  key={href}
                  href={href}
                  prefetch={false}
                  aria-current={active ? "page" : undefined}
                  className={`relative flex min-h-11 items-center gap-3 px-3 text-xs font-semibold tracking-[.06em] transition ${
                    active ? "bg-ivory text-charcoal" : "text-ivory/66 hover:bg-ivory/9 hover:text-ivory"
                  }`}
                >
                  <Icon className="size-4" aria-hidden="true" />
                  {label}
                  {active ? <span className="absolute inset-y-2 left-0 w-0.5 bg-olive" aria-hidden="true" /> : null}
                </Link>
              );
            })}
          </div>
        </section>
      ))}
    </nav>
  );
}

export function PmsMobileDock({ sessionEmail }: { sessionEmail: string }) {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);
  const moreActive = moreItems.some((item) => isCurrent(pathname, item.href));

  useEffect(() => {
    if (!moreOpen) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMoreOpen(false);
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [moreOpen]);

  return (
    <>
      {moreOpen ? (
        <>
          <button
            type="button"
            aria-label="Close admin menu"
            onClick={() => setMoreOpen(false)}
            className="fixed inset-0 z-[81] bg-charcoal/28 backdrop-blur-[2px] lg:hidden"
          />
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="pms-more-title"
            className="pms-more-panel fixed inset-x-0 z-[85] overflow-y-auto border-t border-charcoal/14 bg-paper shadow-[0_-24px_70px_rgba(45,43,39,0.24)] lg:hidden"
          >
            <header className="flex items-center justify-between gap-4 border-b border-charcoal/12 px-4 py-4">
              <div>
                <p className="text-[0.58rem] font-bold tracking-[.16em] text-umber uppercase">Hospitality Operations</p>
                <h2 id="pms-more-title" className="mt-1 font-serif text-2xl">Modul lainnya</h2>
              </div>
              <button type="button" onClick={() => setMoreOpen(false)} className="flex size-11 items-center justify-center border border-charcoal/16">
                <span className="sr-only">Close menu</span>
                <X className="size-4" aria-hidden="true" />
              </button>
            </header>
            <nav aria-label="More admin modules" className="grid grid-cols-2 gap-px bg-charcoal/10 p-px">
              {moreItems.map(({ href, label, icon: Icon }) => {
                const active = isCurrent(pathname, href);
                return (
                  <Link
                    key={href}
                    href={href}
                    prefetch={false}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setMoreOpen(false)}
                    className={`flex min-h-20 flex-col justify-between bg-paper p-4 text-xs font-semibold ${active ? "text-olive" : "text-charcoal"}`}
                  >
                    <Icon className="size-5" aria-hidden="true" />
                    {label}
                  </Link>
                );
              })}
            </nav>
            <div className="border-t border-charcoal/12 px-4 py-4">
              <p className="truncate text-xs text-ink-soft">{sessionEmail}</p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <Link href="/" target="_blank" className="flex min-h-11 items-center justify-center border border-charcoal/16 text-xs font-semibold">
                  Buka situs
                </Link>
                <form action="/api/admin/session" method="post">
                  <input type="hidden" name="intent" value="logout" />
                  <button type="submit" className="flex min-h-11 w-full items-center justify-center gap-2 border border-charcoal/16 text-xs font-semibold">
                    <LogOut className="size-4" aria-hidden="true" /> Keluar
                  </button>
                </form>
              </div>
            </div>
          </section>
        </>
      ) : null}

      <nav
        aria-label="Admin mobile navigation"
        className="fixed inset-x-0 bottom-0 z-[90] grid grid-cols-5 border-t border-charcoal/12 bg-paper/97 pt-1.5 shadow-[0_-16px_40px_rgba(45,43,39,0.14)] backdrop-blur-xl lg:hidden"
        style={{
          paddingBottom: "max(0.45rem, env(safe-area-inset-bottom))",
          paddingLeft: "max(0.25rem, env(safe-area-inset-left))",
          paddingRight: "max(0.25rem, env(safe-area-inset-right))",
        }}
      >
        {primaryDockItems.map(({ href, label, icon: Icon }) => {
          const active = isCurrent(pathname, href);
          return (
            <Link
              key={href}
              href={href}
              prefetch={false}
              aria-current={active ? "page" : undefined}
              onClick={() => setMoreOpen(false)}
              className={`flex min-h-14 flex-col items-center justify-center gap-1 px-1 text-[0.56rem] font-semibold ${
                active ? "text-charcoal" : "text-charcoal/56"
              }`}
            >
              <Icon className={`size-4.5 ${active ? "text-olive" : ""}`} aria-hidden="true" />
              {label}
            </Link>
          );
        })}
        <button
          type="button"
          onClick={() => setMoreOpen((current) => !current)}
          aria-expanded={moreOpen}
          className={`flex min-h-14 flex-col items-center justify-center gap-1 px-1 text-[0.56rem] font-semibold ${
            moreOpen || moreActive ? "text-charcoal" : "text-charcoal/56"
          }`}
        >
          {moreOpen ? <ChevronUp className="size-4.5 text-olive" aria-hidden="true" /> : <MoreHorizontal className={`size-4.5 ${moreActive ? "text-olive" : ""}`} aria-hidden="true" />}
          Lainnya
        </button>
      </nav>
    </>
  );
}

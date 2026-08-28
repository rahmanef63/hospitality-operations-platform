import { Check, CloudUpload, History } from "lucide-react";
import type { WelcomeAuditEvent } from "@/shared/welcome";

function formatDate(value: number) {
  return new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Jakarta" }).format(new Date(value));
}

export function ActivityPanel({ events }: { events: WelcomeAuditEvent[] }) {
  return (
    <section className="overflow-hidden rounded-[.55rem] border border-charcoal/14 bg-paper">
      <header className="flex items-center justify-between gap-4 border-b border-charcoal/10 p-5 sm:p-7"><div><p className="kicker text-umber">Recent activity</p><h2 className="mt-2 font-serif text-3xl">Publishing history</h2></div><History className="size-5 text-olive" aria-hidden="true" /></header>
      {events.length ? <ol className="divide-y divide-charcoal/10">{events.map((event, index) => (
        <li key={`${event.createdAt}-${index}`} className="grid min-h-18 grid-cols-[auto_1fr_auto] items-center gap-3 p-5 sm:p-6">
          <span className={`flex size-9 items-center justify-center rounded-full ${event.action === "publish" ? "bg-[#dfe9df] text-[#31533b]" : "bg-charcoal/[.05] text-charcoal/60"}`}>{event.action === "publish" ? <CloudUpload className="size-4" aria-hidden="true" /> : <Check className="size-4" aria-hidden="true" />}</span>
          <div><p className="text-sm font-semibold capitalize">{event.action} · {event.locale.toUpperCase()}</p><p className="mt-1 text-xs text-ink-soft">Version {event.version} · actor {event.actorEmailHash.slice(0, 10)}…</p></div>
          <time className="text-right text-xs text-ink-soft" dateTime={new Date(event.createdAt).toISOString()}>{formatDate(event.createdAt)} WIB</time>
        </li>
      ))}</ol> : <p className="p-7 text-sm leading-7 text-ink-soft">Belum ada aktivitas publishing.</p>}
    </section>
  );
}

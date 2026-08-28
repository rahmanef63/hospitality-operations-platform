import type { WelcomeAuditEvent } from "@/shared/welcome";

function formatDate(value: number) {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Jakarta",
  }).format(new Date(value));
}

export function ActivityPanel({ events }: { events: WelcomeAuditEvent[] }) {
  return (
    <section className="border border-charcoal/15 bg-paper">
      <header className="border-b border-charcoal/12 p-6 sm:p-8">
        <p className="kicker text-umber">Recent activity</p>
        <h2 className="mt-3 font-serif text-4xl leading-none">Publishing history</h2>
      </header>
      {events.length ? (
        <ol className="divide-y divide-charcoal/10">
          {events.map((event, index) => (
            <li key={`${event.createdAt}-${index}`} className="grid gap-4 p-6 sm:grid-cols-[1fr_auto] sm:items-center sm:p-8">
              <div>
                <p className="text-sm font-semibold capitalize">{event.action} · {event.locale.toUpperCase()}</p>
                <p className="mt-2 text-xs leading-6 text-ink-soft">Version {event.version} · actor {event.actorEmailHash.slice(0, 10)}…</p>
              </div>
              <time className="text-xs text-ink-soft" dateTime={new Date(event.createdAt).toISOString()}>
                {formatDate(event.createdAt)} WIB
              </time>
            </li>
          ))}
        </ol>
      ) : (
        <p className="p-8 text-sm leading-7 text-ink-soft">No publishing activity yet.</p>
      )}
    </section>
  );
}

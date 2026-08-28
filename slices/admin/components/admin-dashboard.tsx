import { Cloud, ExternalLink, Globe2, ShieldCheck } from "lucide-react";
import { ActivityPanel } from "./activity-panel";
import { WelcomeEditor } from "./welcome-editor";
import type { AdminDashboardProps } from "../types";

const statusMessages: Record<string, string> = {
  saved: "Draft saved to Convex Cloud.",
  published: "Welcome message published.",
};

const errorMessages: Record<string, string> = {
  locale: "Invalid language selection.",
  validation: "Check the field lengths and required values.",
  service: "Convex Cloud could not complete the request.",
};

export function AdminDashboard({
  overview,
  endpointUrl,
  previewUrl,
  backendError,
  status,
  error,
  selectedLocale,
  formAction,
}: AdminDashboardProps) {
  const publishedCount = Object.values(overview.configs).filter((config) => config.publishedAt).length;
  return (
    <div className="min-h-screen pb-20">
      <div className="mx-auto max-w-[96rem] px-4 pt-12 sm:px-8 lg:px-12 lg:pt-16">
        <div className="grid gap-10 xl:grid-cols-[1fr_auto] xl:items-end">
          <div>
            <p className="kicker text-umber">Ruma Kamyna</p>
            <h1 className="mt-5 max-w-5xl font-serif text-6xl leading-[.88] tracking-[-.045em] sm:text-8xl">Welcome guests with one clear voice.</h1>
          </div>
          <div className="flex items-center gap-3 text-xs leading-6 text-ink-soft">
            <ShieldCheck className="size-5 text-olive" aria-hidden="true" />
            Signed HttpOnly admin session
          </div>
        </div>

        {status || error || backendError ? (
          <div className={`mt-10 border-l-2 px-5 py-4 text-sm ${error || backendError ? "border-[#843f35] bg-[#f4e0db] text-[#6f2d25]" : "border-olive bg-[#dfe9df] text-[#31533b]"}`} role="status">
            {backendError
              ? "Convex Cloud is temporarily unreachable. The editor is showing safe defaults and saves are disabled until it recovers."
              : error
                ? errorMessages[error] ?? "The request could not be completed."
                : statusMessages[status ?? ""]}
            {selectedLocale ? ` (${selectedLocale.toUpperCase()})` : ""}
          </div>
        ) : null}

        <section className="mt-12 grid gap-px border border-charcoal/12 bg-charcoal/12 md:grid-cols-3">
          <div className="bg-paper p-6 sm:p-8">
            <Cloud className="size-5 text-olive" aria-hidden="true" />
            <p className="kicker mt-7 text-umber">Backend</p>
            <p className="mt-2 font-serif text-3xl">Convex Cloud</p>
            <p className="mt-3 text-xs leading-6 text-ink-soft">{backendError ? "Connection unavailable" : "Connected and editable"}</p>
          </div>
          <div className="bg-paper p-6 sm:p-8">
            <Globe2 className="size-5 text-olive" aria-hidden="true" />
            <p className="kicker mt-7 text-umber">Published</p>
            <p className="mt-2 font-serif text-3xl">{publishedCount}/2 languages</p>
            <p className="mt-3 text-xs leading-6 text-ink-soft">Draft changes remain private until Publish is pressed.</p>
          </div>
          <div className="bg-paper p-6 sm:p-8">
            <ExternalLink className="size-5 text-olive" aria-hidden="true" />
            <p className="kicker mt-7 text-umber">Public endpoint</p>
            <a href={endpointUrl} target="_blank" rel="noreferrer" className="mt-2 inline-flex min-h-11 items-center break-all font-mono text-sm underline underline-offset-4">
              {endpointUrl}
            </a>
            <p className="mt-3 text-xs leading-6 text-ink-soft">GET or POST JSON with optional name and locale.</p>
          </div>
        </section>

        <section className="mt-14 space-y-10" aria-label="Welcome message editors">
          {(["id", "en"] as const).map((locale) => (
            <WelcomeEditor
              key={locale}
              config={overview.configs[locale]}
              formAction={formAction}
              previewUrl={previewUrl}
              disabled={backendError}
            />
          ))}
        </section>

        <div className="mt-10">
          <ActivityPanel events={overview.events} />
        </div>
      </div>
    </div>
  );
}

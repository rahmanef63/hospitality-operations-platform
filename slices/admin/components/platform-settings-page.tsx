import { AlertTriangle, CheckCircle2, ExternalLink, GitPullRequest, RefreshCw, ServerCog, ShieldCheck } from "lucide-react";
import type { PlatformUpdateStatus } from "@/shared/platform";
import type { AdminFormAction } from "../types";
import { PlatformUpdateButton } from "./platform-update-button";

const stateLabel = {
  upstream: "Upstream",
  unconfigured: "Belum terhubung",
  current: "Terkini",
  checking: "Validasi",
  ready: "Siap",
  applying: "Updating",
  failed: "Gagal",
  blocked: "Blocked",
} as const;

function Metric({ label, value, detail }: { label: string; value: string; detail: string }) {
  return <article className="bg-white p-5"><p className="kicker text-umber">{label}</p><p className="mt-3 font-serif text-3xl">{value}</p><p className="mt-2 text-xs leading-5 text-ink-soft">{detail}</p></article>;
}

export function PlatformSettingsPage({ update, action, notice, error }: {
  update: PlatformUpdateStatus;
  action: AdminFormAction;
  notice?: string;
  error?: string;
}) {
  const pr = update.pullRequest;
  return (
    <div className="min-h-screen bg-[#eceee9]">
      <header className="border-b border-charcoal/12 bg-[#f8f8f5] px-4 py-10 sm:px-8 lg:px-12 lg:py-14">
        <div className="mx-auto max-w-[92rem]">
          <p className="kicker text-umber">Platform settings</p>
          <h1 className="mt-5 max-w-5xl font-serif text-5xl leading-[.9] tracking-[-.04em] sm:text-7xl">Update tanpa menimpa tenant.</h1>
          <p className="mt-6 max-w-2xl text-sm leading-7 text-ink-soft sm:text-base">Versi platform, CI, backend deployment, dan frontend promotion berjalan sebagai satu kontrak. Data, secrets, CMS, PMS, dan protected overlays tetap milik tenant.</p>
        </div>
      </header>
      <div className="mx-auto grid max-w-[92rem] gap-6 px-4 py-8 sm:px-8 lg:px-12 lg:py-10">
        {notice === "requested" ? <div role="status" className="rounded-[.4rem] border border-olive/25 bg-olive/8 p-4 text-sm font-semibold">Update workflow sudah diminta. Halaman ini akan menunjukkan status run pada refresh berikutnya.</div> : null}
        {error ? <div role="alert" className="rounded-[.4rem] border border-[#843f35]/25 bg-[#843f35]/7 p-4 text-sm font-semibold text-[#843f35]">Update tidak dapat dimulai: {error}.</div> : null}
        <section className="grid gap-px overflow-hidden rounded-[.5rem] border border-charcoal/12 bg-charcoal/10 sm:grid-cols-3">
          <Metric label="Installed" value={`v${update.installedVersion}`} detail={`Build ${update.buildVersion.slice(0, 16)}`} />
          <Metric label="Prepared update" value={update.latestVersion ? `v${update.latestVersion}` : "—"} detail={update.pullRequest ? `PR #${update.pullRequest.number}` : "Tidak ada update teruji yang menunggu"} />
          <Metric label="Status" value={stateLabel[update.state]} detail={update.checkState === "success" ? "Tenant CI checks lulus" : update.message} />
        </section>

        <section className="rounded-[.5rem] border border-charcoal/12 bg-white">
          <header className="flex flex-wrap items-start justify-between gap-4 border-b border-charcoal/10 p-5 sm:p-7">
            <div><p className="kicker text-umber">Update center</p><h2 className="mt-2 font-serif text-3xl">{update.message}</h2></div>
            <span className="inline-flex min-h-9 items-center gap-2 rounded-full border border-charcoal/12 px-3 text-xs font-semibold"><ShieldCheck className="size-4 text-olive" aria-hidden="true" />{update.mode === "tenant" ? "Tenant-owned" : "Canonical source"}</span>
          </header>
          <div className="grid gap-5 p-5 sm:p-7 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,.65fr)]">
            <div>
              <div className="flex items-start gap-3"><ServerCog className="mt-0.5 size-5 text-olive" aria-hidden="true" /><div><p className="text-sm font-bold">Deployment order</p><p className="mt-2 text-xs leading-6 text-ink-soft">Workflow mengulang full verify, deploy Convex, memastikan head SHA tidak berubah, merge exact PR, lalu menunggu `/api/health` melaporkan revision Vercel yang sama.</p></div></div>
              <div className="mt-5 flex items-start gap-3"><RefreshCw className="mt-0.5 size-5 text-olive" aria-hidden="true" /><div><p className="text-sm font-bold">PWA handoff</p><p className="mt-2 text-xs leading-6 text-ink-soft">Setelah frontend baru aktif, service worker publik menggunakan lifecycle update/cache cleanup yang terpisah dari sesi admin.</p></div></div>
              {update.majorUpgrade ? <div className="mt-5 flex items-start gap-3 rounded-[.4rem] border border-[#9b6a2f]/20 bg-[#9b6a2f]/7 p-4"><AlertTriangle className="mt-0.5 size-4 shrink-0 text-[#8a5c27]" aria-hidden="true" /><p className="text-xs leading-6">Major release tidak boleh dijalankan melalui one-click path tanpa migration contract khusus.</p></div> : null}
            </div>
            <aside className="rounded-[.45rem] border border-charcoal/10 bg-[#f8f8f5] p-5">
              <p className="text-xs font-bold uppercase tracking-[.12em]">Automation</p>
              <dl className="mt-4 grid gap-3 text-xs">
                <div className="flex justify-between gap-4"><dt className="text-ink-soft">Repository</dt><dd className="max-w-[12rem] truncate font-semibold">{update.repository ?? "not resolved"}</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-ink-soft">Branch</dt><dd className="font-semibold">{update.defaultBranch ?? "—"}</dd></div><div className="flex justify-between gap-4"><dt className="text-ink-soft">Checks</dt><dd className="font-semibold">{update.checkState}</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-ink-soft">Credential</dt><dd className="font-semibold">{update.configured ? "server-only" : "missing"}</dd></div>
              </dl>
              {pr ? <a href={pr.url} target="_blank" rel="noreferrer" className="cta-outline mt-5 w-full"><GitPullRequest className="size-4" aria-hidden="true" />Buka PR <ExternalLink className="size-3.5" aria-hidden="true" /></a> : null}
              {update.applyRun?.url ? <a href={update.applyRun.url} target="_blank" rel="noreferrer" className="cta-outline mt-2 w-full">Buka workflow <ExternalLink className="size-3.5" aria-hidden="true" /></a> : null}
            </aside>
          </div>
          {update.canApply && pr && update.latestVersion ? <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-charcoal/10 p-5 sm:p-7"><div className="flex items-center gap-2 text-xs font-semibold"><CheckCircle2 className="size-4 text-olive" aria-hidden="true" />Exact PR dan CI siap untuk coordinated apply.</div><PlatformUpdateButton action={action} prNumber={pr.number} version={update.latestVersion} /></footer> : null}
        </section>
      </div>
    </div>
  );
}

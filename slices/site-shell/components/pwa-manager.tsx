"use client";

import { Download, RefreshCw, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { PWA_BUILD_VERSION } from "@/shared/pwa/config";

type InstallChoice = { outcome: "accepted" | "dismissed"; platform: string };
type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<InstallChoice>;
};

const DISMISS_KEY = "kamyna:pwa-install-dismissed-at";
const INSTALL_REQUEST_EVENT = "kamyna:pwa-install-request";

function isInstalledMode() {
  return window.matchMedia("(display-mode: standalone)").matches
    || window.matchMedia("(display-mode: fullscreen)").matches
    || Boolean((navigator as Navigator & { standalone?: boolean }).standalone);
}

function readWorkerVersion(worker: ServiceWorker): Promise<string | undefined> {
  return new Promise((resolve) => {
    const channel = new MessageChannel();
    const timeout = window.setTimeout(() => resolve(undefined), 1800);
    channel.port1.onmessage = (event) => {
      window.clearTimeout(timeout);
      resolve(typeof event.data?.version === "string" ? event.data.version : undefined);
    };
    worker.postMessage({ type: "KAMYNA_GET_VERSION" }, [channel.port2]);
  });
}

export function PwaManager() {
  const [registration, setRegistration] = useState<ServiceWorkerRegistration>();
  const [updateReady, setUpdateReady] = useState(false);
  const [restarting, setRestarting] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<InstallPromptEvent>();
  const [installHelp, setInstallHelp] = useState(false);
  const [installDismissed, setInstallDismissed] = useState(true);
  const reloadingRef = useRef(false);
  const restartingRef = useRef(false);
  const installPromptRef = useRef<InstallPromptEvent | undefined>(undefined);

  const reloadLatest = useCallback(() => {
    if (!restartingRef.current || reloadingRef.current) return;
    reloadingRef.current = true;
    window.location.reload();
  }, []);

  const promptInstall = useCallback(async () => {
    const prompt = installPromptRef.current;
    if (!prompt) {
      setInstallHelp(true);
      return;
    }
    await prompt.prompt();
    const choice = await prompt.userChoice;
    if (choice.outcome === "accepted") {
      installPromptRef.current = undefined;
      setInstallPrompt(undefined);
    }
  }, []);

  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    const dismissedAt = Number(window.localStorage.getItem(DISMISS_KEY) ?? "0");
    window.setTimeout(() => setInstallDismissed(Date.now() - dismissedAt < 7 * 24 * 60 * 60 * 1000), 0);

    const beforeInstall = (event: Event) => {
      event.preventDefault();
      if (!isInstalledMode()) {
        installPromptRef.current = event as InstallPromptEvent;
        const autoPromptAllowed = !["/welcome", "/presentation"].includes(window.location.pathname)
          && !window.location.pathname.startsWith("/admin")
          && !document.querySelector("[data-kamyna-offline]");
        if (autoPromptAllowed) setInstallPrompt(event as InstallPromptEvent);
      }
    };
    const installed = () => {
      installPromptRef.current = undefined;
      setInstallPrompt(undefined);
      setInstallHelp(false);
      setInstallDismissed(true);
    };
    const activationMessage = (event: MessageEvent) => {
      if (event.data?.type !== "KAMYNA_SW_ACTIVATED") return;
      if (restartingRef.current) reloadLatest();
      else if (event.data.version !== PWA_BUILD_VERSION) setUpdateReady(true);
    };
    const installRequest = () => {
      if (installPromptRef.current) {
        setInstallPrompt(installPromptRef.current);
        void promptInstall();
      } else if (!isInstalledMode()) setInstallHelp(true);
    };

    window.addEventListener("beforeinstallprompt", beforeInstall);
    window.addEventListener("appinstalled", installed);
    window.addEventListener(INSTALL_REQUEST_EVENT, installRequest);
    navigator.serviceWorker?.addEventListener("message", activationMessage);
    navigator.serviceWorker?.addEventListener("controllerchange", reloadLatest);

    let disposed = false;
    let interval: number | undefined;
    let focusHandler: (() => void) | undefined;
    let visibilityHandler: (() => void) | undefined;

    void navigator.serviceWorker?.register("/sw.js", { scope: "/", updateViaCache: "none" })
      .then((nextRegistration) => {
        if (disposed) return;
        setRegistration(nextRegistration);
        if (nextRegistration.waiting && navigator.serviceWorker.controller) setUpdateReady(true);
        if (nextRegistration.active && navigator.serviceWorker.controller) {
          void readWorkerVersion(nextRegistration.active).then((version) => {
            if (version && version !== PWA_BUILD_VERSION) setUpdateReady(true);
          });
        }
        const inspectInstalling = () => {
          const worker = nextRegistration.installing;
          if (!worker) return;
          worker.addEventListener("statechange", () => {
            if (worker.state === "installed" && navigator.serviceWorker.controller) setUpdateReady(true);
          });
        };
        nextRegistration.addEventListener("updatefound", inspectInstalling);
        const check = () => void nextRegistration.update().catch(() => undefined);
        focusHandler = check;
        visibilityHandler = () => { if (document.visibilityState === "visible") check(); };
        window.addEventListener("focus", focusHandler);
        document.addEventListener("visibilitychange", visibilityHandler);
        interval = window.setInterval(check, 15 * 60 * 1000);
        check();
      })
      .catch(() => undefined);

    return () => {
      disposed = true;
      window.removeEventListener("beforeinstallprompt", beforeInstall);
      window.removeEventListener("appinstalled", installed);
      window.removeEventListener(INSTALL_REQUEST_EVENT, installRequest);
      navigator.serviceWorker?.removeEventListener("message", activationMessage);
      navigator.serviceWorker?.removeEventListener("controllerchange", reloadLatest);
      if (focusHandler) window.removeEventListener("focus", focusHandler);
      if (visibilityHandler) document.removeEventListener("visibilitychange", visibilityHandler);
      if (interval) window.clearInterval(interval);
    };
  }, [promptInstall, reloadLatest]);


  async function restartWithLatest() {
    setRestarting(true);
    restartingRef.current = true;
    const current = registration ?? await navigator.serviceWorker?.getRegistration("/");
    if (!current) {
      window.location.reload();
      return;
    }
    if (!current.waiting) await current.update().catch(() => undefined);
    if (current.waiting) {
      current.waiting.postMessage({ type: "KAMYNA_SKIP_WAITING" });
      window.setTimeout(reloadLatest, 5000);
      return;
    }
    window.location.reload();
  }

  function dismissInstall() {
    window.localStorage.setItem(DISMISS_KEY, String(Date.now()));
    setInstallDismissed(true);
    setInstallHelp(false);
  }

  const showInstall = !updateReady && !installDismissed && Boolean(installPrompt);
  const showManual = !updateReady && installHelp && !isInstalledMode();
  if (!updateReady && !showInstall && !showManual) return null;

  return (
    <aside className="fixed inset-x-3 top-[max(1rem,env(safe-area-inset-top))] z-[170] mx-auto max-w-xl rounded-[.55rem] border border-charcoal/15 bg-paper/97 p-4 text-charcoal shadow-[0_24px_80px_rgba(24,23,20,.28)] backdrop-blur-xl sm:inset-x-auto sm:right-5 sm:top-5 sm:w-[30rem]" role="status" aria-live={updateReady ? "assertive" : "polite"}>
      <div className="flex items-start gap-3">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-olive/10 text-olive">{updateReady ? <RefreshCw className={`size-5 ${restarting ? "animate-spin" : ""}`} aria-hidden="true" /> : <Download className="size-5" aria-hidden="true" />}</span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold">{updateReady ? "Versi baru Kamyna siap" : showManual ? "Pasang dari menu browser" : "Pasang Kamyna sebagai aplikasi"}</p>
          <p className="mt-1 text-xs leading-6 text-ink-soft">{updateReady ? "Restart akan mengaktifkan build terbaru dan menghapus hanya cache Kamyna dari versi lama." : showManual ? "Pilih Install app atau Add to Home screen. Dukungan pemasangan pada browser TV berbeda-beda." : "Dapatkan jendela standalone, launcher icon, offline fallback, dan pengalaman layar penuh yang lebih bersih."}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {updateReady ? <button type="button" onClick={restartWithLatest} disabled={restarting} className="cta-solid min-h-11 disabled:opacity-60">{restarting ? "Restarting…" : "Restart sekarang"}</button> : showInstall ? <button type="button" onClick={promptInstall} className="cta-solid min-h-11">Install app</button> : null}
            {!updateReady ? <button type="button" onClick={dismissInstall} className="cta-outline min-h-11">Nanti</button> : null}
          </div>
          <p className="mt-2 font-mono text-[.58rem] text-charcoal/38">build {PWA_BUILD_VERSION.slice(0, 14)}</p>
        </div>
        {!updateReady ? <button type="button" onClick={dismissInstall} className="flex size-11 shrink-0 items-center justify-center" aria-label="Close install message"><X className="size-4" aria-hidden="true" /></button> : null}
      </div>
    </aside>
  );
}

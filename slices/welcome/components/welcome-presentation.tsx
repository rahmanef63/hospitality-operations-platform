"use client";

import { ChevronLeft, ChevronRight, Download, Maximize, Minimize, MonitorPlay, Pause } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { getWelcomeLocaleMeta } from "@/shared/welcome";
import type { WelcomePageProps } from "../types";
import { WelcomeLanguagePicker } from "./welcome-language-picker";
import { WelcomeSlide } from "./welcome-slide";

type WakeLockSentinelLike = { released: boolean; release: () => Promise<void> };
type WakeLockNavigator = Navigator & { wakeLock?: { request: (type: "screen") => Promise<WakeLockSentinelLike> } };
type LockableOrientation = ScreenOrientation & { lock?: (orientation: "landscape") => Promise<void> };
type FullscreenTarget = HTMLElement & { requestFullscreen?: (options?: FullscreenOptions) => Promise<void> };

const SLIDE_INTERVAL = 10_000;
const INSTALL_EVENT = "kamyna:pwa-install-request";

function installedDisplayMode() {
  return window.matchMedia("(display-mode: standalone)").matches
    || window.matchMedia("(display-mode: fullscreen)").matches
    || Boolean((navigator as Navigator & { standalone?: boolean }).standalone);
}

export function WelcomePresentation(props: WelcomePageProps) {
  const { locale, slides, tvMode } = props;
  const meta = getWelcomeLocaleMeta(locale);
  const rootRef = useRef<HTMLElement>(null);
  const wakeLockRef = useRef<WakeLockSentinelLike | undefined>(undefined);
  const hideTimerRef = useRef<number | undefined>(undefined);
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(tvMode);
  const [fullscreen, setFullscreen] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [installed, setInstalled] = useState(false);

  const showControls = useCallback(() => {
    setControlsVisible(true);
    if (hideTimerRef.current) window.clearTimeout(hideTimerRef.current);
    if (playing) hideTimerRef.current = window.setTimeout(() => setControlsVisible(false), 5500);
  }, [playing]);

  const previous = useCallback(() => {
    setActive((current) => (current - 1 + slides.length) % slides.length);
    showControls();
  }, [showControls, slides.length]);

  const next = useCallback(() => {
    setActive((current) => (current + 1) % slides.length);
    showControls();
  }, [showControls, slides.length]);

  const releaseWakeLock = useCallback(async () => {
    const lock = wakeLockRef.current;
    wakeLockRef.current = undefined;
    if (lock && !lock.released) await lock.release().catch(() => undefined);
  }, []);

  const requestWakeLock = useCallback(async () => {
    if (document.visibilityState !== "visible") return;
    const wakeLock = (navigator as WakeLockNavigator).wakeLock;
    if (!wakeLock || wakeLockRef.current) return;
    wakeLockRef.current = await wakeLock.request("screen").catch(() => undefined);
  }, []);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotion = () => {
      setReducedMotion(query.matches);
      if (query.matches) setPlaying(false);
    };
    const initialSync = window.requestAnimationFrame(() => {
      syncMotion();
      setInstalled(installedDisplayMode());
    });
    query.addEventListener("change", syncMotion);
    const fullscreenChange = () => setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", fullscreenChange);
    return () => {
      window.cancelAnimationFrame(initialSync);
      query.removeEventListener("change", syncMotion);
      document.removeEventListener("fullscreenchange", fullscreenChange);
    };
  }, []);

  useEffect(() => {
    if (!playing || reducedMotion) {
      void releaseWakeLock();
      return;
    }
    void requestWakeLock();
    const interval = window.setInterval(() => {
      if (document.visibilityState === "visible") setActive((current) => (current + 1) % slides.length);
    }, SLIDE_INTERVAL);
    return () => window.clearInterval(interval);
  }, [playing, reducedMotion, releaseWakeLock, requestWakeLock, slides.length]);

  useEffect(() => {
    const visibility = () => {
      if (document.visibilityState === "visible" && playing) void requestWakeLock();
      else void releaseWakeLock();
    };
    document.addEventListener("visibilitychange", visibility);
    return () => {
      document.removeEventListener("visibilitychange", visibility);
      void releaseWakeLock();
    };
  }, [playing, releaseWakeLock, requestWakeLock]);

  const toggleFullscreen = useCallback(async () => {
    if (document.fullscreenElement) {
      await document.exitFullscreen().catch(() => undefined);
      return;
    }
    const target = rootRef.current as FullscreenTarget | null;
    if (!target?.requestFullscreen) return;
    await target.requestFullscreen({ navigationUI: "hide" }).catch(() => undefined);
    const orientation = screen.orientation as LockableOrientation | undefined;
    if (document.fullscreenElement && orientation?.lock) await orientation.lock("landscape").catch(() => undefined);
  }, []);

  useEffect(() => {
    const keydown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.matches("input, select, textarea")) return;
      if (["ArrowRight", "PageDown", "MediaTrackNext"].includes(event.key)) { event.preventDefault(); next(); }
      if (["ArrowLeft", "PageUp", "MediaTrackPrevious"].includes(event.key)) { event.preventDefault(); previous(); }
      if (event.key === "Home") { event.preventDefault(); setActive(0); }
      if (event.key === "End") { event.preventDefault(); setActive(slides.length - 1); }
      const actionElement = target?.matches("button, a");
      if (!actionElement && [" ", "MediaPlayPause", "Enter"].includes(event.key)) { event.preventDefault(); setPlaying((current) => !current); }
      if (event.key.toLowerCase() === "f") { event.preventDefault(); void toggleFullscreen(); }
      showControls();
    };
    window.addEventListener("keydown", keydown);
    return () => window.removeEventListener("keydown", keydown);
  }, [next, previous, showControls, slides.length, toggleFullscreen]);

  useEffect(() => {
    if (!playing) return;
    hideTimerRef.current = window.setTimeout(() => setControlsVisible(false), 5500);
    return () => { if (hideTimerRef.current) window.clearTimeout(hideTimerRef.current); };
  }, [playing]);


  function togglePlaying() {
    const nextPlaying = !playing;
    setPlaying(nextPlaying);
    setControlsVisible(true);
    if (hideTimerRef.current) window.clearTimeout(hideTimerRef.current);
    if (nextPlaying) hideTimerRef.current = window.setTimeout(() => setControlsVisible(false), 5500);
  }

  return (
    <main
      ref={rootRef}
      id="main-content"
      lang={meta.htmlLang}
      dir={meta.direction}
      tabIndex={-1}
      className="welcome-tv-root"
      data-playing={playing || undefined}
      data-reduced-motion={reducedMotion || undefined}
      onPointerMove={showControls}
      onPointerDown={showControls}
      role="region"
      aria-roledescription="slideshow"
      aria-label={`${props.propertyName} guest welcome presentation`}
    >
      {slides.map((slide, index) => <WelcomeSlide key={slide.id} slide={slide} index={index} active={active === index} localeMeta={meta} {...props} />)}

      <header className="welcome-tv-topbar">
        <div><p className="kicker text-warm-sand">{props.propertyName}</p><p className="mt-2 text-[.62rem] tracking-[.16em] text-ivory/52 uppercase">return to stillness.</p></div>
        <WelcomeLanguagePicker locale={locale} token={props.token} guestName={props.content.guestName} propertySlug={props.propertySlug} tvMode={tvMode} />
      </header>

      <div className="sr-only" aria-live="polite">Slide {active + 1} of {slides.length}</div>
      <nav className="welcome-tv-controls" data-hidden={!controlsVisible || undefined} aria-label="TV slideshow controls">
        <button type="button" onClick={previous} className="welcome-tv-control" aria-label="Previous slide"><ChevronLeft className="size-5" aria-hidden="true" /></button>
        <button type="button" onClick={togglePlaying} disabled={reducedMotion} title={reducedMotion ? "Autoplay is disabled by reduced-motion preference" : undefined} className="welcome-tv-control welcome-tv-control-primary disabled:cursor-not-allowed disabled:opacity-55" aria-pressed={playing}>{playing ? <Pause className="size-5" aria-hidden="true" /> : <MonitorPlay className="size-5" aria-hidden="true" />}<span>{playing ? "Pause" : "Slideshow"}</span></button>
        <button type="button" onClick={next} className="welcome-tv-control" aria-label="Next slide"><ChevronRight className="size-5" aria-hidden="true" /></button>
        <span className="welcome-tv-counter">{active + 1} / {slides.length}</span>
        {!installed ? <button type="button" onClick={() => window.dispatchEvent(new Event(INSTALL_EVENT))} className="welcome-tv-control"><Download className="size-5" aria-hidden="true" /><span>Install</span></button> : null}
        <button type="button" onClick={toggleFullscreen} className="welcome-tv-control">{fullscreen ? <Minimize className="size-5" aria-hidden="true" /> : <Maximize className="size-5" aria-hidden="true" />}<span>{fullscreen ? "Exit" : "Fullscreen"}</span></button>
      </nav>
    </main>
  );
}

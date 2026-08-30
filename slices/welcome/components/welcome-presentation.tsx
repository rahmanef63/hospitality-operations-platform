"use client";

import { ChevronLeft, ChevronRight, Download, Maximize, Minimize, MonitorPlay, Pause, Volume2, VolumeX } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { getWelcomeLocaleMeta } from "@/shared/welcome";
import type { WelcomePresentationProps } from "../types";
import { useAnnouncementExperience } from "../hooks/use-announcement-experience";
import { useLofiMusic } from "../hooks/use-lofi-music";
import { WelcomeLanguagePicker } from "./welcome-language-picker";
import { WelcomeSlide } from "./welcome-slide";

type WakeLockSentinelLike = { released: boolean; release: () => Promise<void> };
type WakeLockNavigator = Navigator & { wakeLock?: { request: (type: "screen") => Promise<WakeLockSentinelLike> } };
type LockableOrientation = ScreenOrientation & { lock?: (orientation: "landscape") => Promise<void> };
type FullscreenTarget = HTMLElement & { requestFullscreen?: (options?: FullscreenOptions) => Promise<void> };
const INSTALL_EVENT = "hospitality:pwa-install-request";

function installedDisplayMode() {
  return window.matchMedia("(display-mode: standalone)").matches
    || window.matchMedia("(display-mode: fullscreen)").matches
    || Boolean((navigator as Navigator & { standalone?: boolean }).standalone);
}

export function WelcomePresentation(props: WelcomePresentationProps) {
  const { locale, slides, tvMode } = props;
  const meta = getWelcomeLocaleMeta(locale);
  const settings = props.announcements.settings;
  const rootRef = useRef<HTMLElement>(null);
  const wakeLockRef = useRef<WakeLockSentinelLike | undefined>(undefined);
  const hideTimerRef = useRef<number | undefined>(undefined);
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(tvMode);
  const [fullscreen, setFullscreen] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [installed, setInstalled] = useState(false);
  const announcement = useAnnouncementExperience({
    program: props.announcements,
    guestName: props.content.guestName,
    propertyName: props.propertyName,
    locale,
    voiceLocale: meta.htmlLang,
    enabled: settings.presentationShowAnnouncement,
    speechEnabled: false,
  });
  const music = useLofiMusic({
    enabled: settings.musicEnabled,
    volume: settings.musicVolume,
    track: props.announcements.musicTrack,
  });
  const displayContent = announcement.active
    ? { ...props.content, headline: announcement.active.message }
    : props.content;

  const showControls = useCallback(() => {
    setControlsVisible(true);
    if (hideTimerRef.current) window.clearTimeout(hideTimerRef.current);
    if (playing) hideTimerRef.current = window.setTimeout(() => setControlsVisible(false), 5500);
  }, [playing]);
  const previous = useCallback(() => { setActive((current) => (current - 1 + slides.length) % slides.length); showControls(); }, [showControls, slides.length]);
  const next = useCallback(() => { setActive((current) => (current + 1) % slides.length); showControls(); }, [showControls, slides.length]);
  const releaseWakeLock = useCallback(async () => {
    const lock = wakeLockRef.current; wakeLockRef.current = undefined;
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
    const sync = () => { setReducedMotion(query.matches); if (query.matches) setPlaying(false); };
    const frame = window.requestAnimationFrame(() => { sync(); setInstalled(installedDisplayMode()); });
    const fullscreenChange = () => setFullscreen(Boolean(document.fullscreenElement));
    query.addEventListener("change", sync); document.addEventListener("fullscreenchange", fullscreenChange);
    return () => { window.cancelAnimationFrame(frame); query.removeEventListener("change", sync); document.removeEventListener("fullscreenchange", fullscreenChange); };
  }, []);

  useEffect(() => {
    if (!playing || reducedMotion) { void releaseWakeLock(); return; }
    void requestWakeLock();
    const delay = (slides[active]?.durationSeconds ?? 10) * 1000;
    const timer = window.setTimeout(() => setActive((current) => (current + 1) % slides.length), delay);
    return () => window.clearTimeout(timer);
  }, [active, playing, reducedMotion, releaseWakeLock, requestWakeLock, slides]);

  useEffect(() => {
    const visibility = () => document.visibilityState === "visible" && playing ? void requestWakeLock() : void releaseWakeLock();
    document.addEventListener("visibilitychange", visibility);
    return () => { document.removeEventListener("visibilitychange", visibility); void releaseWakeLock(); };
  }, [playing, releaseWakeLock, requestWakeLock]);

  const toggleFullscreen = useCallback(async () => {
    if (document.fullscreenElement) { await document.exitFullscreen().catch(() => undefined); return; }
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
      if (!target?.matches("button, a") && [" ", "MediaPlayPause", "Enter"].includes(event.key)) { event.preventDefault(); setPlaying((current) => !current); }
      if (event.key.toLowerCase() === "f") { event.preventDefault(); void toggleFullscreen(); }
      if (event.key.toLowerCase() === "m") { event.preventDefault(); void music.toggleMuted(); }
      showControls();
    };
    window.addEventListener("keydown", keydown);
    return () => window.removeEventListener("keydown", keydown);
  }, [music, next, previous, showControls, slides.length, toggleFullscreen]);

  useEffect(() => {
    if (!playing) return;
    hideTimerRef.current = window.setTimeout(() => setControlsVisible(false), 5500);
    return () => { if (hideTimerRef.current) window.clearTimeout(hideTimerRef.current); };
  }, [playing]);

  function togglePlaying() {
    const nextPlaying = !playing; setPlaying(nextPlaying); setControlsVisible(true);
    if (hideTimerRef.current) window.clearTimeout(hideTimerRef.current);
    if (nextPlaying) hideTimerRef.current = window.setTimeout(() => setControlsVisible(false), 5500);
  }

  const showTopbar = settings.presentationShowBrand || settings.presentationShowLanguage;
  return (
    <main ref={rootRef} id="main-content" lang={meta.htmlLang} dir={meta.direction} tabIndex={-1} className="welcome-tv-root" data-playing={playing || undefined} data-reduced-motion={reducedMotion || undefined} data-music-track={music.track.key} onPointerMove={showControls} onPointerDown={showControls} role="region" aria-roledescription="slideshow" aria-label={`${props.propertyName} guest welcome presentation`}>
      <h1 className="sr-only">{props.propertyName} guest welcome presentation</h1>
      {slides.map((slide, index) => <WelcomeSlide key={slide.id} slide={slide} index={index} active={active === index} localeMeta={meta} {...props} content={displayContent} />)}
      {showTopbar ? <header className="welcome-tv-topbar">{settings.presentationShowBrand ? <div><p className="kicker text-warm-sand">{props.propertyName}</p><p className="mt-2 text-[.62rem] tracking-[.16em] text-ivory/52 uppercase">return to stillness.</p></div> : <span />}{settings.presentationShowLanguage ? <WelcomeLanguagePicker locale={locale} token={props.token} guestName={props.content.guestName} propertySlug={props.propertySlug} tvMode={tvMode} routePath="/presentation" /> : null}</header> : null}
      <div className="sr-only" aria-live="polite">Slide {active + 1} of {slides.length}</div>
      <nav className="welcome-tv-controls" data-hidden={!controlsVisible || undefined} aria-label="TV slideshow controls">
        <button type="button" onClick={previous} className="welcome-tv-control" aria-label="Previous slide"><ChevronLeft className="size-5" aria-hidden="true" /></button>
        <button type="button" onClick={togglePlaying} disabled={reducedMotion} title={reducedMotion ? "Autoplay is disabled by reduced-motion preference" : undefined} className="welcome-tv-control welcome-tv-control-primary disabled:cursor-not-allowed disabled:opacity-55" aria-label={playing ? "Pause slideshow" : "Start slideshow"} aria-pressed={playing}>{playing ? <Pause className="size-5" aria-hidden="true" /> : <MonitorPlay className="size-5" aria-hidden="true" />}<span>{playing ? "Pause" : "Slideshow"}</span></button>
        <button type="button" onClick={next} className="welcome-tv-control" aria-label="Next slide"><ChevronRight className="size-5" aria-hidden="true" /></button>
        {settings.presentationShowCounter ? <span className="welcome-tv-counter">{active + 1} / {slides.length}</span> : null}
        {settings.presentationShowInstall && !installed ? <button type="button" onClick={() => window.dispatchEvent(new Event(INSTALL_EVENT))} className="welcome-tv-control" aria-label="Install presentation app"><Download className="size-5" aria-hidden="true" /><span>Install</span></button> : null}
        {settings.musicEnabled ? <button type="button" onClick={() => void music.toggleMuted()} disabled={!music.supported} className="welcome-tv-control" aria-label={music.muted ? `Play ${music.track.title}` : `Mute ${music.track.title}`} aria-pressed={!music.muted} title={music.muted ? `Play ${music.track.title}` : `Mute ${music.track.title}`}>{music.muted ? <VolumeX className="size-5" aria-hidden="true" /> : <Volume2 className="size-5" aria-hidden="true" />}</button> : null}
        <button type="button" onClick={toggleFullscreen} className="welcome-tv-control" aria-label={fullscreen ? "Exit fullscreen" : "Enter fullscreen"}>{fullscreen ? <Minimize className="size-5" aria-hidden="true" /> : <Maximize className="size-5" aria-hidden="true" />}<span>{fullscreen ? "Exit" : "Fullscreen"}</span></button>
      </nav>
    </main>
  );
}

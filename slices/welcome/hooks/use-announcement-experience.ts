"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { resolveActiveAnnouncement } from "@/shared/announcements/resolve";
import { dateKeyInTimezone } from "@/shared/announcements/time";
import type { AnnouncementProgram } from "@/shared/announcements/types";

function speechSupported() {
  return typeof window !== "undefined" && "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
}

export function useAnnouncementExperience(input: {
  program: AnnouncementProgram;
  guestName?: string;
  propertyName: string;
  locale: string;
  voiceLocale: string;
  enabled?: boolean;
  speechEnabled?: boolean;
}) {
  const router = useRouter();
  const [now, setNow] = useState(() => new Date(input.program.generatedAt));
  const [muted, setMuted] = useState(true);
  const [supported, setSupported] = useState(false);
  const spokenRef = useRef<string | undefined>(undefined);
  const storageKey = `hospitality:welcome-audio:${input.program.settings.propertySlug}`;
  const active = useMemo(() => input.enabled === false || !now ? undefined : resolveActiveAnnouncement(input.program, {
    now,
    guestName: input.guestName,
    propertyName: input.propertyName,
    locale: input.locale,
  }), [input.enabled, input.guestName, input.locale, input.program, input.propertyName, now]);

  const speak = useCallback((message: string, key: string) => {
    if (!supported || muted || spokenRef.current === key) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.lang = input.voiceLocale;
    utterance.rate = 0.92;
    utterance.pitch = 1;
    utterance.volume = input.program.settings.announcementVolume;
    const prefix = input.voiceLocale.toLowerCase().split("-")[0] ?? "";
    const voice = window.speechSynthesis.getVoices().find((item) => item.lang.toLowerCase().startsWith(prefix));
    if (voice) utterance.voice = voice;
    window.speechSynthesis.speak(utterance);
    spokenRef.current = key;
  }, [input.program.settings.announcementVolume, input.voiceLocale, muted, supported]);

  useEffect(() => {
    const initial = window.requestAnimationFrame(() => {
      setSupported(input.speechEnabled !== false && speechSupported());
      setMuted(window.sessionStorage.getItem(storageKey) !== "unmuted");
    });
    const interval = window.setInterval(() => {
      const next = new Date();
      setNow(next);
      if (dateKeyInTimezone(input.program.timezone, next) !== input.program.dateKey) router.refresh();
    }, 15_000);
    return () => {
      window.cancelAnimationFrame(initial);
      window.clearInterval(interval);
      window.speechSynthesis?.cancel();
    };
  }, [input.program.dateKey, input.program.timezone, input.speechEnabled, router, storageKey]);

  useEffect(() => {
    if (active?.speak) speak(active.message, active.key);
  }, [active, speak]);

  const toggleMuted = useCallback(() => {
    setMuted((current) => {
      const next = !current;
      window.sessionStorage.setItem(storageKey, next ? "muted" : "unmuted");
      if (next) window.speechSynthesis?.cancel();
      else if (active?.speak) {
        spokenRef.current = undefined;
        window.setTimeout(() => speak(active.message, active.key), 0);
      }
      return next;
    });
  }, [active, speak, storageKey]);

  return { active, muted, supported, toggleMuted };
}

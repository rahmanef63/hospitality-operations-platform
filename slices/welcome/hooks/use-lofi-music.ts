"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { LofiTrack } from "@/shared/announcements";

type MediaSessionNavigator = Navigator & {
  mediaSession?: MediaSession;
};

export function useLofiMusic(input: { enabled: boolean; volume: number; track: LofiTrack }) {
  const [muted, setMuted] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const prepare = useCallback(() => {
    if (audioRef.current) return audioRef.current;
    const audio = new Audio(input.track.src);
    audio.loop = true;
    audio.preload = "none";
    audio.volume = input.volume;
    audio.muted = true;
    audioRef.current = audio;
    const mediaSession = (navigator as MediaSessionNavigator).mediaSession;
    if (mediaSession && "MediaMetadata" in window) {
      mediaSession.metadata = new MediaMetadata({
        title: input.track.title,
        artist: input.track.artist,
        album: "Kamyna Lo-fi Collection",
      });
    }
    return audio;
  }, [input.track.artist, input.track.src, input.track.title, input.volume]);

  const toggleMuted = useCallback(async () => {
    if (!input.enabled) return;
    const audio = prepare();
    if (muted) {
      audio.muted = false;
      audio.volume = input.volume;
      try {
        await audio.play();
        setMuted(false);
      } catch {
        audio.muted = true;
      }
      return;
    }
    audio.muted = true;
    audio.pause();
    setMuted(true);
  }, [input.enabled, input.volume, muted, prepare]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) audio.volume = input.volume;
  }, [input.volume]);

  useEffect(() => () => {
    const audio = audioRef.current;
    audioRef.current = null;
    if (!audio) return;
    audio.pause();
    audio.removeAttribute("src");
    audio.load();
  }, []);

  return {
    muted,
    supported: input.enabled,
    toggleMuted,
    track: input.track,
  };
}

import { tenantBrandIdentity } from "@/tenant";
import type { LofiTrack, LofiTrackKey } from "./types";

export const LOFI_TRACKS = [
  {
    key: "still-morning",
    title: "Still Morning",
    artist: `${tenantBrandIdentity.masterName} Studio`,
    src: "/audio/still-morning.mp3",
    durationSeconds: 53.37,
    license: "CC0 1.0 Universal",
    licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
    provenance: "Original deterministic synthesis; no third-party samples.",
  },
  {
    key: "mountain-air",
    title: "Mountain Air",
    artist: `${tenantBrandIdentity.masterName} Studio`,
    src: "/audio/mountain-air.mp3",
    durationSeconds: 50.57,
    license: "CC0 1.0 Universal",
    licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
    provenance: "Original deterministic synthesis; no third-party samples.",
  },
  {
    key: "night-courtyard",
    title: "Night Courtyard",
    artist: `${tenantBrandIdentity.masterName} Studio`,
    src: "/audio/night-courtyard.mp3",
    durationSeconds: 56.5,
    license: "CC0 1.0 Universal",
    licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
    provenance: "Original deterministic synthesis; no third-party samples.",
  },
] as const satisfies readonly LofiTrack[];

export function isLofiTrackKey(value: unknown): value is LofiTrackKey {
  return typeof value === "string" && LOFI_TRACKS.some((track) => track.key === value);
}

export function getLofiTrack(value: unknown): LofiTrack {
  return LOFI_TRACKS.find((track) => track.key === value) ?? LOFI_TRACKS[0];
}

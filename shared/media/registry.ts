import { media } from "./assets";

export type MediaKey = keyof typeof media;
export const MEDIA_OPTIONS = Object.entries(media).map(([key, asset]) => ({ key: key as MediaKey, label: key.replace(/([A-Z])/g, " $1").replace(/^./, (value) => value.toUpperCase()), asset }));
export function mediaByKey(value: string) { return media[value as MediaKey] ?? media.livingCourtyard; }
export function mediaKeyForSrc(src: string): MediaKey { return MEDIA_OPTIONS.find((item) => item.asset.src === src)?.key ?? "livingCourtyard"; }

import type { ActiveAnnouncement, AnnouncementProgram, AnnouncementRule, PrayerName } from "./types";

function localClock(timezone: string, date: Date) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: timezone,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const read = (type: "hour" | "minute") => Number(parts.find((part) => part.type === type)?.value ?? 0);
  return read("hour") * 60 + read("minute");
}

function minutes(value: string | undefined) {
  if (!value) return undefined;
  const parts = value.split(":").map(Number);
  const hour = parts[0] ?? 0;
  const minute = parts[1] ?? 0;
  return hour * 60 + minute;
}

function inWindow(now: number, start: number, end: number) {
  return start < end ? now >= start && now < end : now >= start || now < end;
}

function elapsedMinutes(now: number, target: number) {
  return (now - target + 1440) % 1440;
}

const prayerLabels: Partial<Record<string, Record<PrayerName, string>>> = {
  id: { fajr: "Subuh", dhuhr: "Zuhur", asr: "Asar", maghrib: "Maghrib", isha: "Isya" },
  en: { fajr: "Fajr", dhuhr: "Dhuhr", asr: "Asr", maghrib: "Maghrib", isha: "Isha" },
};

export function renderAnnouncementMessage(
  template: string,
  input: { guestName?: string; propertyName: string; locale: string; prayer?: PrayerName },
) {
  const prayer = input.prayer
    ? prayerLabels[input.locale]?.[input.prayer] ?? input.prayer.charAt(0).toUpperCase() + input.prayer.slice(1)
    : "";
  return template
    .replaceAll("{{guest}}", input.guestName || input.propertyName)
    .replaceAll("{{tamu}}", input.guestName || input.propertyName)
    .replaceAll("{{property}}", input.propertyName)
    .replaceAll("{{prayer}}", prayer)
    .replace(/\s+/g, " ")
    .trim();
}

function activeForRule(rule: AnnouncementRule, program: AnnouncementProgram, now: Date) {
  const currentMinute = localClock(program.timezone, now);
  if (rule.kind === "time_window") {
    const start = minutes(rule.startTime);
    const end = minutes(rule.endTime);
    return start !== undefined && end !== undefined && inWindow(currentMinute, start, end)
      ? { key: `${rule.id}:${program.dateKey}` }
      : undefined;
  }
  if (rule.kind === "fixed_time") {
    const target = minutes(rule.fixedTime);
    const elapsed = target === undefined ? Infinity : elapsedMinutes(currentMinute, target);
    return elapsed < rule.displayMinutes ? { key: `${rule.id}:${program.dateKey}:${rule.fixedTime}` } : undefined;
  }
  const moment = program.prayerMoments.find((item) => item.prayer === rule.prayer);
  if (!moment) return undefined;
  const target = moment.at + rule.offsetMinutes * 60_000;
  const elapsed = now.getTime() - target;
  return elapsed >= 0 && elapsed < rule.displayMinutes * 60_000
    ? { key: `${rule.id}:${moment.prayer}:${target}`, prayer: moment.prayer }
    : undefined;
}

export function resolveActiveAnnouncement(
  program: AnnouncementProgram,
  input: { now?: Date; guestName?: string; propertyName: string; locale: string },
): ActiveAnnouncement | undefined {
  const now = input.now ?? new Date();
  const rules = program.rules.filter((rule) => rule.enabled).sort((left, right) => right.priority - left.priority);
  for (const rule of rules) {
    const state = activeForRule(rule, program, now);
    if (!state) continue;
    return {
      key: state.key,
      ruleId: rule.id,
      kind: rule.kind,
      message: renderAnnouncementMessage(rule.message, { ...input, prayer: state.prayer }),
      speak: rule.speak,
      prayer: state.prayer,
    };
  }
  return undefined;
}

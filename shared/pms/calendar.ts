import { addDays } from "./dates";

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function utcDate(value: string) {
  return new Date(`${value}T00:00:00Z`);
}

function validIsoDate(value: string | undefined): value is string {
  if (!value || !ISO_DATE.test(value)) return false;
  try {
    return utcDate(value).toISOString().slice(0, 10) === value;
  } catch {
    return false;
  }
}

export function normalizeMonth(value: string | undefined, fallback: string) {
  const candidate = value && /^\d{4}-\d{2}$/.test(value) ? `${value}-01` : value;
  if (validIsoDate(candidate)) return `${candidate.slice(0, 7)}-01`;
  return `${fallback.slice(0, 7)}-01`;
}

export function shiftMonth(monthStart: string, delta: number) {
  const date = utcDate(monthStart);
  date.setUTCMonth(date.getUTCMonth() + delta, 1);
  return date.toISOString().slice(0, 10);
}

export function monthGridRange(monthStart: string) {
  const date = utcDate(monthStart);
  const mondayOffset = (date.getUTCDay() + 6) % 7;
  const start = addDays(monthStart, -mondayOffset);
  return { start, end: addDays(start, 42) };
}

export function calendarDays(monthStart: string) {
  const range = monthGridRange(monthStart);
  return Array.from({ length: 42 }, (_, index) => addDays(range.start, index));
}

export function daysBetween(start: string, end: string) {
  if (!validIsoDate(start) || !validIsoDate(end)) return 0;
  return Math.max(0, Math.round((utcDate(end).getTime() - utcDate(start).getTime()) / 86_400_000));
}

export function isDateWithin(day: string, start: string, end: string) {
  return day >= start && day < end;
}

export function isSameMonth(day: string, monthStart: string) {
  return day.slice(0, 7) === monthStart.slice(0, 7);
}

export function monthLabel(monthStart: string) {
  return new Intl.DateTimeFormat("id-ID", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(utcDate(monthStart));
}

export function shortDayLabel(day: string) {
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  }).format(utcDate(day));
}

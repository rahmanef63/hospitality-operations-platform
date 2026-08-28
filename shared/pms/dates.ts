function dateParts(timeZone: string, value = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(value);
  const get = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value ?? "";
  return { year: Number(get("year")), month: Number(get("month")), day: Number(get("day")) };
}

function isoFromParts(year: number, month: number, day: number) {
  return `${year.toString().padStart(4, "0")}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
}

export function todayInTimeZone(timeZone = "Asia/Jakarta", value = new Date()): string {
  const { year, month, day } = dateParts(timeZone, value);
  return isoFromParts(year, month, day);
}

export function addDays(date: string, days: number): string {
  const instant = new Date(`${date}T00:00:00Z`);
  instant.setUTCDate(instant.getUTCDate() + days);
  return instant.toISOString().slice(0, 10);
}

export function monthBounds(date: string) {
  const [yearValue, monthValue] = date.split("-");
  const year = Number(yearValue);
  const month = Number(monthValue);
  const start = isoFromParts(year, month, 1);
  const nextYear = month === 12 ? year + 1 : year;
  const nextMonth = month === 12 ? 1 : month + 1;
  return { start, end: isoFromParts(nextYear, nextMonth, 1) };
}

export function monthCalendarRange(date: string) {
  const { start, end } = monthBounds(date);
  return { start, end: addDays(end, 7) };
}

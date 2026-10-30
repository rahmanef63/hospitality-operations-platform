import { CalculationMethod, Coordinates, Madhab, PrayerTimes } from "adhan";
import { datePartsInTimezone } from "./time";
import type { MadhabName, PrayerMethod, PrayerMoment, PrayerName } from "./types";

const methodFactories: Record<PrayerMethod, () => ReturnType<typeof CalculationMethod.Singapore>> = {
  singapore: CalculationMethod.Singapore,
  muslim_world_league: CalculationMethod.MuslimWorldLeague,
  egyptian: CalculationMethod.Egyptian,
  karachi: CalculationMethod.Karachi,
  umm_al_qura: CalculationMethod.UmmAlQura,
  dubai: CalculationMethod.Dubai,
  moonsighting_committee: CalculationMethod.MoonsightingCommittee,
  north_america: CalculationMethod.NorthAmerica,
  kuwait: CalculationMethod.Kuwait,
  qatar: CalculationMethod.Qatar,
  tehran: CalculationMethod.Tehran,
  turkey: CalculationMethod.Turkey,
};

const labels: Record<PrayerName, string> = {
  fajr: "Subuh",
  dhuhr: "Zuhur",
  asr: "Asar",
  maghrib: "Maghrib",
  isha: "Isya",
};

export function calculatePrayerMoments(input: {
  latitude: number;
  longitude: number;
  timezone: string;
  method: PrayerMethod;
  madhab: MadhabName;
  date?: Date;
}): PrayerMoment[] {
  const { year, month, day } = datePartsInTimezone(input.timezone, input.date ?? new Date());
  const calendarDate = new Date(year, month - 1, day, 12, 0, 0, 0);
  const params = methodFactories[input.method]();
  params.madhab = input.madhab === "hanafi" ? Madhab.Hanafi : Madhab.Shafi;
  const times = new PrayerTimes(new Coordinates(input.latitude, input.longitude), calendarDate, params);
  const values: Array<[PrayerName, Date]> = [
    ["fajr", times.fajr], ["dhuhr", times.dhuhr], ["asr", times.asr],
    ["maghrib", times.maghrib], ["isha", times.isha],
  ];
  return values.filter(([, at]) => Number.isFinite(at.getTime())).map(([prayer, at]) => ({
    prayer,
    at: at.getTime(),
    label: labels[prayer],
  }));
}

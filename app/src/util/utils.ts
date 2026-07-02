import { lighten } from "@mui/material";
import { differenceInDays, format, startOfDay } from "date-fns";
import { IDateConditions } from "../components/details/JournalContext";

export function round(n: number, decimals: number = 3): number {
  const x = Math.pow(10, decimals);
  return Math.round(n * x) / x;
}

export function getCoefficient(
  currentIndex: number,
  instanceCount: number,
): number {
  return currentIndex * (0.5 / Math.max(instanceCount - 1, 1));
}

export function getColorShades(length: number, color: string): string[] {
  const colors: string[] = [];
  for (let i = 0; i < length; i++) {
    colors.push(lighten(color, getCoefficient(i, length)));
  }
  return colors;
}

export function stripTime(date?: Date | null): Date | null {
  return date
    ? new Date(date.getFullYear(), date.getMonth(), date.getDate())
    : null;
}

// Maps a user's local calendar day to its canonical UTC-midnight instant, so a date-only value
// (e.g. a LogBook entry's day) is stored timezone-independently.
export function dateOnlyToUtc(local: Date): Date {
  return new Date(
    Date.UTC(local.getFullYear(), local.getMonth(), local.getDate()),
  );
}

// Inverse of dateOnlyToUtc: turns a stored UTC-midnight instant back into the local midnight of
// the same calendar day, so existing local-time display/picker code shows the correct day.
export function utcToDateOnly(utc: Date): Date {
  return new Date(utc.getUTCFullYear(), utc.getUTCMonth(), utc.getUTCDate());
}

export function formatDateOnly(date: Date): string {
  return format(date, "dd.MM.yyyy");
}

// Stable key identifying a single calendar day, used to compare/deduplicate dates.
export function getDayKey(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

export function isValidEmail(address: string): boolean {
  // https://stackoverflow.com/a/8829363/4092115
  return !!address.match(
    new RegExp(
      "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$",
    ),
  );
}

export function getNumberOfDays(
  allDates: (Date | string)[],
  overrides: IDateConditions = {},
) {
  const sorted = allDates.sort(
    (a, b) => ensureDate(a).getTime() - ensureDate(b).getTime(),
  );

  const earliest = overrides.from ?? sorted[0];
  const latest = overrides.to ?? new Date();

  return (
    differenceInDays(
      new Date(startOfDay(latest)),
      new Date(startOfDay(earliest)),
    ) + 1
  );
}

export function ensureDate(d: Date | string) {
  return typeof d === "string" ? new Date(d) : d;
}

import { lighten } from "@mui/material";
import { differenceInDays, format, startOfDay } from "date-fns";
import { IDateConditions } from "../components/details/JournalContext";

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

export function stripTime(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function formatDateOnly(date: Date): string {
  return format(date, "dd.MM.yyyy");
}

export function isValidEmail(address: string): boolean {
  // https://stackoverflow.com/a/8829363/4092115
  return !!address.match(
    new RegExp(
      "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$",
    ),
  );
}

export function getNumberOfDays(
  allDates: (Date | string)[],
  overrides: IDateConditions = {},
) {
  const sorted = allDates.sort();

  const earliest = overrides.from ?? sorted[0];
  const latest = overrides.to ?? sorted[sorted.length - 1];

  return (
    differenceInDays(
      new Date(startOfDay(latest)),
      new Date(startOfDay(earliest)),
    ) + 1
  );
}

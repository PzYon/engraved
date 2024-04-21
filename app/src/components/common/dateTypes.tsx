import { format, formatDistanceToNow, isToday } from "date-fns";

export enum DateFormat {
  relativeToNow,
  relativeToNowDayPlus,
  full,
  fullCompact,
  dateOnly,
  ticks,
  timeOnly,
}

export function getAsDate(value: string | number | Date): Date {
  if (typeof value === "string" || typeof value === "number") {
    return new Date(value);
  }

  if (value instanceof Date) {
    return value;
  }

  throw new Error(`'${value}' is an invalid date.`);
}

export const formatDate = (
  value: string | number | Date,
  dateFormat?: DateFormat,
): string => {
  const date = getAsDate(value);

  // https://date-fns.org/v3.6.0/docs/format

  switch (dateFormat) {
    case DateFormat.dateOnly:
      return format(date, "PPPP");
    case DateFormat.full:
      return format(date, "PPPP, HH:mm");
    case DateFormat.fullCompact:
      return format(date, "cccccc, dd.LL.yy, HH:mm");
    case DateFormat.ticks:
      return format(date, "T");
    case DateFormat.timeOnly:
      return format(date, "HH:mm:ss");
    case DateFormat.relativeToNowDayPlus:
      return isToday(date)
        ? "today"
        : formatDistanceToNow(date, {
            addSuffix: true,
            includeSeconds: true,
          });
    case DateFormat.relativeToNow:
    default:
      return formatDistanceToNow(date, {
        addSuffix: true,
        includeSeconds: true,
      });
  }
};

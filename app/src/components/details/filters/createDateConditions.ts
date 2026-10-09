import { IDateConditions } from "../JournalContext";
import {
  addDays,
  addMonths,
  differenceInCalendarDays,
  lastDayOfMonth,
  lastDayOfWeek,
  lastDayOfYear,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
  subDays,
} from "date-fns";
import { DateRange } from "./DateRange";

import { DateFilterConfig } from "../edit/DateFilterConfig";

export const createDateConditions = (
  dateFilterConfig: DateFilterConfig,
  date: Date,
): IDateConditions => {
  // "to" is the last day of a range, at midnight: the API includes that whole
  // day by adding one to it, so the end of the day would reach into the next.

  // Whole days for a relative filter as well, and not the time of day it was
  // created at: the conditions are part of the query key, so with the time in
  // them no two visits of a journal would ever share cached entries.
  if (dateFilterConfig.dateType === "relative") {
    const today = startOfDay(date);

    return {
      from: subDays(today, dateFilterConfig.value as number),
      to: today,
    };
  }

  switch (dateFilterConfig.value as DateRange) {
    case DateRange.Week:
      return {
        from: startOfWeek(date),
        to: lastDayOfWeek(date),
      };

    case DateRange.Month:
      return {
        from: startOfMonth(date),
        to: lastDayOfMonth(date),
      };

    case DateRange.Year:
      return { from: startOfYear(date), to: lastDayOfYear(date) };

    case DateRange.Custom:
      return {};

    case DateRange.All:
      return {};
  }
};

export function createNextDateConditions(
  direction: "previous" | "next",
  dateFilterConfig: DateFilterConfig,
  currentConditions: IDateConditions,
): IDateConditions {
  if (dateFilterConfig.dateType === "relative") {
    return {
      from:
        direction === "previous"
          ? subDays(currentConditions.from!, dateFilterConfig.value as number)
          : currentConditions.to,
      to:
        direction === "previous"
          ? currentConditions.from
          : addDays(currentConditions.to!, dateFilterConfig.value as number),
    };
  }

  switch (dateFilterConfig.value) {
    case DateRange.Month:
      return createDateConditions(
        {
          dateType: "range",
          value: DateRange.Month,
        },
        addMonths(currentConditions.from!, direction === "previous" ? -1 : 1),
      );

    case DateRange.Year: {
      const year =
        currentConditions.from!.getFullYear() +
        (direction === "previous" ? -1 : 1);

      return {
        from: new Date(year, 0, 1),
        to: new Date(year, 11, 31),
      };
    }

    case DateRange.All: {
      // do nothing, can't go to infinity ;)
      break;
    }

    case DateRange.Week:
    case DateRange.Custom: {
      // "to" is an inclusive day, so a range from Sunday to Saturday spans
      // seven days although the two dates are only six days apart.
      const numberOfDays =
        differenceInCalendarDays(
          currentConditions.to!,
          currentConditions.from!,
        ) + 1;

      const offsetInDays = numberOfDays * (direction === "previous" ? -1 : 1);

      return {
        from: addDays(currentConditions.from!, offsetInDays),
        to: addDays(currentConditions.to!, offsetInDays),
      };
    }
  }

  return {};
}

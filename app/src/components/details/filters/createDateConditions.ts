import { IDateConditions } from "../JournalContext";
import {
  addDays,
  differenceInDays,
  endOfMonth,
  endOfWeek,
  endOfYear,
  getDaysInMonth,
  startOfMonth,
  startOfWeek,
  startOfYear,
  subDays,
} from "date-fns";
import { DateRange } from "./DateRange";
import { DateFilterConfig } from "../edit/IJournalUiSettings";

export const createDateConditions = (
  dateFilterConfig: DateFilterConfig,
  date: Date,
): IDateConditions => {
  if (dateFilterConfig.dateType === "relative") {
    return {
      from: subDays(date, dateFilterConfig.value as number),
      to: date,
    };
  }

  switch (dateFilterConfig.value as DateRange) {
    case DateRange.Week:
      return {
        from: startOfWeek(date),
        to: endOfWeek(date),
      };

    case DateRange.Month:
      return {
        from: startOfMonth(date),
        to: endOfMonth(date),
      };

    case DateRange.Year:
      return { from: startOfYear(date), to: endOfYear(date) };

    case DateRange.Custom:
      return null;

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
          ? subDays(currentConditions.from, dateFilterConfig.value as number)
          : currentConditions.to,
      to:
        direction === "previous"
          ? currentConditions.from
          : addDays(currentConditions.to, dateFilterConfig.value as number),
    };
  }

  switch (dateFilterConfig.value) {
    case DateRange.Month: {
      const offset = getDaysInMonth(currentConditions.from.getFullYear());

      const newDate = addDays(
        currentConditions.from,
        offset * (direction === "previous" ? -1 : 1),
      );

      return createDateConditions(
        {
          dateType: "range",
          value: DateRange.Month,
        },
        newDate,
      );
    }

    case DateRange.Year: {
      const year =
        currentConditions.from.getFullYear() +
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
      const diffInDays =
        differenceInDays(currentConditions.to, currentConditions.from) *
        (direction === "previous" ? -1 : 1);

      return {
        from: addDays(currentConditions.from, diffInDays),
        to: addDays(currentConditions.to, diffInDays),
      };
    }
  }
}

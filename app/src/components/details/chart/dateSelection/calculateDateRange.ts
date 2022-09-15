import { DateRange } from "./DateConditions";
import { IDateConditions } from "../../MetricDetailsContext";
import {
  endOfMonth,
  endOfWeek,
  endOfYear,
  startOfMonth,
  startOfWeek,
  startOfYear,
} from "date-fns";

export const calculateDateRange = (
  dateRange: DateRange,
  date: Date
): IDateConditions => {
  switch (dateRange) {
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

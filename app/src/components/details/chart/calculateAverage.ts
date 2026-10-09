import { getNumberOfDays, getNumberOfMonths } from "../../../util/utils";
import { AggregationMode } from "../edit/IJournalUiSettings";
import { GroupByTime } from "./consolidation/GroupByTime";
import { ITransformedEntry } from "./transformation/ITransformedEntry";

export function calculateAverage(
  values: ITransformedEntry[],
  aggregationMode: AggregationMode,
  groupByTime: GroupByTime,
): number {
  const total = values.reduce((sum, value) => sum + value.y, 0);

  const divisor =
    aggregationMode === "average-by-occurrence"
      ? values.flatMap((v) => v.entries).length
      : getNumberOfPeriods(
          values.map((v) => v.x),
          groupByTime,
        );

  return total / divisor;
}

// the average is drawn across the bars of the chart, so it needs to
// be per bar (i.e. per period the entries are grouped by).
function getNumberOfPeriods(
  dates: (Date | string)[],
  groupByTime: GroupByTime,
): number {
  return groupByTime === GroupByTime.Month
    ? getNumberOfMonths(dates)
    : getNumberOfDays(dates);
}

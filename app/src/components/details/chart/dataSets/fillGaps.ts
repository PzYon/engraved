import { addDays, addMonths, isBefore } from "date-fns";
import { ITransformedEntry } from "../transformation/ITransformedEntry";
import { GroupByTime } from "../consolidation/GroupByTime";
import { JournalType } from "../../../../serverApi/JournalType";

// a missing group is only semantically zero for journals where the
// value is an amount per period (counts, tracked minutes). for gauges
// a gap means "no measurement", so inserting zeros would distort the chart.
const zeroFillableJournalTypes = [JournalType.Counter, JournalType.Timer];

export function fillGaps(
  entries: ITransformedEntry[],
  journalType: JournalType,
  groupByTime: GroupByTime,
): ITransformedEntry[] {
  if (
    groupByTime === GroupByTime.None ||
    !zeroFillableJournalTypes.includes(journalType) ||
    entries.length < 2
  ) {
    return entries;
  }

  const sorted = [...entries].sort(
    (a, b) => new Date(a.x).getTime() - new Date(b.x).getTime(),
  );

  const filled: ITransformedEntry[] = [sorted[0]];

  for (let i = 1; i < sorted.length; i++) {
    const nextDate = new Date(sorted[i].x);
    let gapDate = addPeriod(new Date(filled[filled.length - 1].x), groupByTime);

    while (isBefore(gapDate, nextDate)) {
      filled.push({ x: gapDate, y: 0, entries: [] });
      gapDate = addPeriod(gapDate, groupByTime);
    }

    filled.push(sorted[i]);
  }

  return filled;
}

function addPeriod(date: Date, groupByTime: GroupByTime): Date {
  return groupByTime === GroupByTime.Day
    ? addDays(date, 1)
    : addMonths(date, 1);
}

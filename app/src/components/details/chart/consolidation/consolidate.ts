import { IEntry } from "../../../../serverApi/IEntry";
import { ConsolidationKey } from "./ConsolidationKey";
import { GroupByTime } from "./GroupByTime";
import { IConsolidatedEntries } from "./IConsolidatedEntries";
import { ITimerEntry } from "../../../../serverApi/ITimerEntry";
import { differenceInMinutes } from "date-fns";
import { IGaugeEntry } from "../../../../serverApi/IGaugeEntry";

export function consolidate(
  entries: IEntry[],
  groupByTime: GroupByTime,
): IConsolidatedEntries[] {
  const valuesByGroupKey = entries.reduce(
    (previousValue: Record<string, IEntry[]>, entry: IEntry) => {
      const key = ConsolidationKey.build(entry.dateTime, groupByTime);
      const keyAsString = key.serialize();

      if (!previousValue[keyAsString]) {
        previousValue[keyAsString] = [];
      }

      previousValue[keyAsString].push(entry);

      return previousValue;
    },
    {},
  );

  return Object.keys(valuesByGroupKey).map((keyAsString) => {
    const entries = valuesByGroupKey[keyAsString];

    return {
      value: entries
        .map(getValue)
        .reduce((total, current) => total + current, 0),
      groupKey: ConsolidationKey.deserialize(keyAsString),
      entries: entries,
    };
  });
}

export function getValue(m: IEntry) {
  // at the moment we use the number of entries as
  // this is only called when counter and there the value
  // is always one.
  // i guess that's correct, however this should also be
  // possible for other journal types i suppose?

  const timerEntry = m as ITimerEntry;
  if (timerEntry.startDate) {
    return getTimerEntryValue(timerEntry);
  }

  return (m as IGaugeEntry).value ?? 1;
}

export function getTimerEntryValue(timerEntry: ITimerEntry) {
  if (!timerEntry.startDate) {
    return 0;
  }

  return differenceInMinutes(
    timerEntry.endDate ? new Date(timerEntry.endDate) : new Date(),
    new Date(timerEntry.startDate),
  );
}

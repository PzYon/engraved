import { IEntry } from "../../../../serverApi/IEntry";
import { IJournal } from "../../../../serverApi/IJournal";
import { consolidate, getValue } from "../consolidation/consolidate";
import { GroupByTime } from "../consolidation/GroupByTime";
import { ITransformedEntry } from "./ITransformedEntry";
import { JournalTypeFactory } from "../../../../journalTypes/JournalTypeFactory";

export function transform(
  measurements: IEntry[],
  metric: IJournal,
  groupBy: GroupByTime,
): ITransformedEntry[] {
  if (
    JournalTypeFactory.create(metric.type).isGroupable &&
    groupBy !== GroupByTime.None
  ) {
    return consolidate(measurements, groupBy).map((m) => {
      const month = m.groupKey.month - 1;
      const day = m.groupKey.day || 1;

      return {
        x: new Date(m.groupKey.year, month, day),
        y: m.value,
        measurements: m.entries,
      };
    });
  }

  return measurements.map((m) => {
    return {
      x: new Date(m.dateTime),
      y: getValue(m),
      measurements: [m],
    };
  });
}

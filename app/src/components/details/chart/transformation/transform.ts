import { IEntry } from "../../../../serverApi/IEntry";
import { IJournal } from "../../../../serverApi/IJournal";
import { consolidate, getValue } from "../consolidation/consolidate";
import { GroupByTime } from "../consolidation/GroupByTime";
import { ITransformedEntry } from "./ITransformedEntry";
import { getUiSettings } from "../../../../util/journalUtils";

export function transform(
  entries: IEntry[],
  journal: IJournal,
  isGroupable: boolean,
  groupBy: GroupByTime,
): ITransformedEntry[] {
  if (isGroupable && groupBy !== GroupByTime.None) {
    return consolidate(entries, groupBy).map((m) => {
      const month = m.groupKey.month - 1;
      const day = m.groupKey.day || 1;

      return {
        x: new Date(m.groupKey.year, month, day),
        y:
          getUiSettings(journal).aggregationMode === "average"
            ? m.value / m.entries.length
            : m.value,
        entries: m.entries,
      };
    });
  }

  return entries.map((m) => {
    return {
      x: new Date(m.dateTime),
      y: getValue(m),
      entries: [m],
    };
  });
}

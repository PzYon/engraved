import { IEntry } from "../../../../serverApi/IEntry";
import { IJournal } from "../../../../serverApi/IJournal";
import { consolidate, getValue } from "../consolidation/consolidate";
import { GroupByTime } from "../consolidation/GroupByTime";
import { ITransformedEntry } from "./ITransformedEntry";
import { JournalTypeFactory } from "../../../../journalTypes/JournalTypeFactory";
import { getUiSettings } from "../../../../util/journalUtils";

export function transform(
  entries: IEntry[],
  journal: IJournal,
  groupBy: GroupByTime,
): ITransformedEntry[] {
  if (
    JournalTypeFactory.create(journal.type).isGroupable &&
    groupBy !== GroupByTime.None
  ) {
    return consolidate(entries, groupBy).map((consolidated) => {
      const month = consolidated.groupKey.month - 1;
      const day = consolidated.groupKey.day || 1;

      const aggregationMode = getUiSettings(journal).aggregationMode;

      return {
        x: new Date(consolidated.groupKey.year, month, day),
        y:
          aggregationMode === "sum"
            ? consolidated.value
            : consolidated.value / consolidated.entries.length,
        entries: consolidated.entries,
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

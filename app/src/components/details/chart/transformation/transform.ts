import { IEntry } from "../../../../serverApi/IEntry";
import { IJournal } from "../../../../serverApi/IJournal";
import { consolidate, getValue } from "../consolidation/consolidate";
import { GroupByTime } from "../consolidation/GroupByTime";
import { ITransformedEntry } from "./ITransformedEntry";
import { JournalTypeFactory } from "../../../../journalTypes/JournalTypeFactory";
import { getUiSettings } from "../../../../util/journalUtils";
import { IConsolidatedEntries } from "../consolidation/IConsolidatedEntries";
import { AggregationMode } from "../../edit/IJournalUiSettings";

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
        y: getGroupedValue(aggregationMode, consolidated),
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

function getGroupedValue(
  aggregationMode: AggregationMode,
  consolidated: IConsolidatedEntries,
) {
  if (
    aggregationMode === "average" ||
    aggregationMode === "average-by-occurrence" ||
    aggregationMode === "average-by-time"
  ) {
    return consolidated.value / consolidated.entries.length;
  }

  return consolidated.value;
}

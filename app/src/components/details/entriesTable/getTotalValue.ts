import { IEntriesTableGroup } from "./IEntriesTableGroup";
import { AggregationMode } from "../edit/IJournalUiSettings";
import { IDateConditions } from "../JournalContext";
import { IEntry } from "../../../serverApi/IEntry";
import { getNumberOfDays } from "../../../util/utils";

export function getTotalValue(
  tableGroups: IEntriesTableGroup[],
  aggregationMode: AggregationMode,
  dateConditions: IDateConditions,
): { value: number; label: string } {
  const totalValue = tableGroups
    .map((g) => g.totalValue)
    .reduce((total, current) => total + current, 0);

  if (aggregationMode === "sum") {
    return { value: totalValue, label: "Sum" };
  }

  const divisor = getDivisor(
    aggregationMode,
    tableGroups.flatMap((g) => g.entries),
    dateConditions,
  );

  return {
    value: divisor.value === 0 ? 0 : totalValue / divisor.value,
    label: divisor.label,
  };
}

function getDivisor(
  aggregationMode: AggregationMode,
  entries: IEntry[],
  dateConditions: IDateConditions,
): { value: number; label: string } {
  switch (aggregationMode) {
    case "average":
    case "average-by-occurrence": {
      return {
        value: entries.length,
        label: `Average from ${entries.length} occurrences`,
      };
    }

    case "average-by-time": {
      const allDates = entries.flatMap((e) => e.dateTime);
      const divisor = getNumberOfDays(allDates, dateConditions);
      return {
        value: divisor,
        label: `Average over ${divisor} days`,
      };
    }

    default: {
      throw new Error(
        `Aggregation mode "${aggregationMode}" is not supported.`,
      );
    }
  }
}

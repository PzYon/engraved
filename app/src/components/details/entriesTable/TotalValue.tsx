import { IJournalType } from "../../../journalTypes/IJournalType";
import { IEntriesTableGroup } from "./IEntriesTableGroup";
import { AggregationMode } from "../edit/IJournalUiSettings";
import { IDateConditions } from "../JournalContext";
import { IEntry } from "../../../serverApi/IEntry";
import { getNumberOfDays, round } from "../../../util/utils";
import { styled } from "@mui/material";

export const TotalValue: React.FC<{
  journalType?: IJournalType;
  tableGroups: IEntriesTableGroup[];
  aggregationMode: AggregationMode;
  setAggregationMode: (mode: AggregationMode) => void;
  dateConditions: IDateConditions;
}> = ({
  journalType,
  tableGroups,
  aggregationMode,
  setAggregationMode,
  dateConditions,
}) => {
  const value = getTotalValue(tableGroups, aggregationMode, dateConditions);

  return (
    <Host onClick={setNextAggregationMode}>
      <Light>{value.label}</Light>
      <span>
        {journalType.formatTotalValue?.(value.value) ?? round(value.value)}
      </span>
    </Host>
  );

  function setNextAggregationMode() {
    switch (aggregationMode) {
      case "sum":
        setAggregationMode("average-by-occurrence");
        break;
      case "average":
      case "average-by-occurrence":
        setAggregationMode("average-by-time");
        break;
      case "average-by-time":
        setAggregationMode("sum");
        break;
      default:
        throw new Error(
          `Aggregation mode "${aggregationMode}" is not supported.`,
        );
    }
  }
};

const Host = styled("div")`
  cursor: pointer;
  display: flex;
  flex-direction: column;
`;

const Light = styled("span")`
  opacity: 0.5;
`;

function getTotalValue(
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
    value: totalValue / divisor.value,
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
        label: `Average from ${divisor} days`,
      };
    }

    default: {
      throw new Error(
        `Aggregation mode "${aggregationMode}" is not supported.`,
      );
    }
  }
}

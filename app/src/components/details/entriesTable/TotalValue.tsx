import { IJournalType } from "../../../journalTypes/IJournalType";
import { IEntriesTableGroup } from "./IEntriesTableGroup";
import { AggregationMode } from "../edit/IJournalUiSettings";
import { IDateConditions } from "../JournalContext";
import { round } from "../../../util/utils";
import { styled } from "@mui/material";
import { getTotalValue } from "./getTotalValue";

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

  return (
    <Host onClick={setNextAggregationMode}>
      <Light>{value.label}</Light>
      <span>
        {journalType?.formatTotalValue?.(value.value) ?? round(value.value)}
      </span>
    </Host>
  );
};

const Host = styled("div")`
  cursor: pointer;
  display: flex;
  flex-direction: column;
  font-size: 0.75rem;
`;

const Light = styled("span")`
  opacity: 0.5;
`;

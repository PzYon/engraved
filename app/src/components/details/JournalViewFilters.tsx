import React from "react";
import { EntryFilters } from "./filters/EntryFilters";
import { IJournal } from "../../serverApi/IJournal";
import { GroupByTime } from "./chart/consolidation/GroupByTime";
import { MyChartType } from "./chart/grouping/ChartTypeSelector";
import { DateFilterConfig } from "./edit/DateFilterConfig";

export const JournalViewFilters: React.FC<{
  journal: IJournal;
  groupByTime: GroupByTime;
  setGroupByTime: (value: GroupByTime) => void;
  attributeKey: string;
  setAttributeKey: (value: string) => void;
  chartType: MyChartType;
  setChartType: (value: MyChartType) => void;
  dateFilter: DateFilterConfig;
}> = ({
  journal,
  groupByTime,
  setGroupByTime,
  attributeKey,
  setAttributeKey,
  chartType,
  setChartType,
  dateFilter,
}) => {
  return (
    <EntryFilters
      journal={journal}
      groupByTime={groupByTime}
      setGroupByTime={setGroupByTime}
      attributeKey={attributeKey}
      setAttributeKey={setAttributeKey}
      chartType={chartType}
      setChartType={setChartType}
      dateFilter={dateFilter}
    />
  );
};

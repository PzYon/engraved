import React, { Suspense } from "react";
import { PageSection } from "../layout/pages/PageSection";
import { Chart } from "./chart/Chart";
import { IJournal } from "../../serverApi/IJournal";
import { IEntry } from "../../serverApi/IEntry";
import { IDateConditions } from "./JournalContext";
import { GroupByTime } from "./chart/consolidation/GroupByTime";
import { MyChartType } from "./chart/grouping/ChartTypeSelector";
import { AggregationMode } from "./edit/IJournalUiSettings";

export const JournalViewChart: React.FC<{
  entries: IEntry[];
  dateConditions: IDateConditions;
  journal: IJournal;
  groupByTime: GroupByTime;
  attributeKey: string;
  chartType: MyChartType;
  aggregationMode: AggregationMode;
}> = ({
  entries,
  dateConditions,
  journal,
  groupByTime,
  attributeKey,
  chartType,
  aggregationMode,
}) => {
  return (
    <Suspense fallback={<div />}>
      <PageSection>
        <Chart
          entries={entries}
          dateConditions={dateConditions}
          journal={journal}
          groupByTime={groupByTime}
          groupByAttribute={attributeKey}
          chartType={chartType}
          chartUiProps={{}}
          aggregationMode={aggregationMode}
        />
      </PageSection>
    </Suspense>
  );
};

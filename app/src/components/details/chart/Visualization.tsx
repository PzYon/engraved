import React, { Suspense, useState } from "react";
import { IVisualizationProps } from "./IVisualizationProps";
import { GroupBySelector } from "./GroupBySelector";
import { GroupBy } from "./consolidation/GroupBy";
import { MetricType } from "../../../serverApi/MetricType";

const ChartJs = React.lazy(() => import("./LazyChartJs"));

export const Visualization: React.FC<IVisualizationProps> = (
  props: IVisualizationProps
) => {
  const [groupBy, setGroupBy] = useState(GroupBy.Month);

  return (
    <Suspense fallback={<div />}>
      {props.metric.type === MetricType.Counter ? (
        <GroupBySelector groupBy={groupBy} onGroupingChange={setGroupBy} />
      ) : null}
      <ChartJs {...props} groupBy={groupBy} />
    </Suspense>
  );
};

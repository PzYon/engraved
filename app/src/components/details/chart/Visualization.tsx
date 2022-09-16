import React, { Suspense, useState } from "react";
import { IVisualizationProps } from "./IVisualizationProps";
import { GroupByTime } from "./consolidation/GroupByTime";
import { Filters } from "./Filters";

const ChartJs = React.lazy(() => import("./LazyChartJs"));

export const Visualization: React.FC<IVisualizationProps> = (
  props: IVisualizationProps
) => {
  const [groupByTime, setGroupByTime] = useState(GroupByTime.Day);
  const [attributeKey, setAttributeKey] = useState("-");
  const [chartType, setChartType] = useState("bar");

  return (
    <Suspense fallback={<div />}>
      <Filters
        metric={props.metric}
        groupByTime={groupByTime}
        setGroupByTime={setGroupByTime}
        attributeKey={attributeKey}
        setAttributeKey={setAttributeKey}
        chartType={chartType}
        setChartType={setChartType}
      />
      <ChartJs
        {...props}
        groupByTime={groupByTime}
        groupByAttribute={attributeKey}
        chartType={chartType}
      />
    </Suspense>
  );
};

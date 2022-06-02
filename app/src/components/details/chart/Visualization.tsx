import React, { Suspense, useState } from "react";
import { IVisualizationProps } from "./IVisualizationProps";
import { GroupByTimeSelector } from "./grouping/GroupByTimeSelector";
import { GroupByTime } from "./consolidation/GroupByTime";
import { MetricTypeFactory } from "../../../metricTypes/MetricTypeFactory";
import { GroupByAttributeSelector } from "./grouping/GroupByAttributeSelector";

const ChartJs = React.lazy(() => import("./LazyChartJs"));

export const Visualization: React.FC<IVisualizationProps> = (
  props: IVisualizationProps
) => {
  const [groupByTime, setGroupByTime] = useState(GroupByTime.Month);
  const [attributeKey, setAttributeKey] = useState("");
  return (
    <Suspense fallback={<div />}>
      {MetricTypeFactory.create(props.metric.type).isGroupable ? (
        <GroupByTimeSelector
          groupByTime={groupByTime}
          onChange={setGroupByTime}
        />
      ) : null}
      {Object.keys(props.metric.attributes).length > 0 ? (
        <GroupByAttributeSelector
          attributes={props.metric.attributes}
          selectedAttributeKey={attributeKey}
          onChange={setAttributeKey}
        />
      ) : null}
      <ChartJs
        {...props}
        groupByTime={groupByTime}
        groupByAttribute={attributeKey}
      />
    </Suspense>
  );
};

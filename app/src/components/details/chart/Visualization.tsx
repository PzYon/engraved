import React, { Suspense, useState } from "react";
import { IVisualizationProps } from "./IVisualizationProps";
import { GroupByTimeSelector } from "./grouping/GroupByTimeSelector";
import { GroupByTime } from "./consolidation/GroupByTime";
import { MetricTypeFactory } from "../../../metricTypes/MetricTypeFactory";
import { GroupByAttributeSelector } from "./grouping/GroupByAttributeSelector";
import { ChartTypeSelector } from "./grouping/ChartTypeSelector";
import { styled } from "@mui/material";
import { DateConditions } from "./dateSelection/DateConditions";

const ChartJs = React.lazy(() => import("./LazyChartJs"));

export const Visualization: React.FC<IVisualizationProps> = (
  props: IVisualizationProps
) => {
  const [groupByTime, setGroupByTime] = useState(GroupByTime.Day);
  const [attributeKey, setAttributeKey] = useState("-");
  const [chartType, setChartType] = useState("bar");

  return (
    <Suspense fallback={<div />}>
      <Selectors>
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
        <ChartTypeSelector chartType={chartType} onChange={setChartType} />
        <DateConditions />
        <ChartJs
          {...props}
          groupByTime={groupByTime}
          groupByAttribute={attributeKey}
          chartType={chartType}
        />
      </Selectors>
    </Suspense>
  );
};

const Selectors = styled("div")`
  .MuiFormControl-root {
    margin-right: 20px;
    min-width: 160px;
  }
`;

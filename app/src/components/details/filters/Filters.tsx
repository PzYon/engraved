import { DateFilters } from "./DateFilters";
import { MetricTypeFactory } from "../../../metricTypes/MetricTypeFactory";
import { GroupByTimeSelector } from "../chart/grouping/GroupByTimeSelector";
import { GroupByAttributeSelector } from "../chart/grouping/GroupByAttributeSelector";
import { ChartTypeSelector } from "../chart/grouping/ChartTypeSelector";
import React from "react";
import { styled } from "@mui/material";
import { GroupByTime } from "../chart/consolidation/GroupByTime";
import { IMetric } from "../../../serverApi/IMetric";
import { AttributeFilters } from "./AttributeFilters";
import { translations } from "../../../i18n/translations";

export const Filters: React.FC<{
  metric: IMetric;
  groupByTime: GroupByTime;
  setGroupByTime: (g: GroupByTime) => void;
  attributeKey: string;
  setAttributeKey: (k: string) => void;
  chartType: string;
  setChartType: (t: string) => void;
}> = ({
  metric,
  groupByTime,
  setGroupByTime,
  attributeKey,
  setAttributeKey,
  chartType,
  setChartType,
}) => {
  return (
    <>
      <Row>
        <DateFilters />
      </Row>
      <Row>
        <AttributeFilters />
      </Row>
      <Row>
        {MetricTypeFactory.create(metric.type).isGroupable ? (
          <GroupByTimeSelector
            groupByTime={groupByTime}
            onChange={setGroupByTime}
          />
        ) : null}
        {Object.keys(metric.attributes).length > 0 ? (
          <GroupByAttributeSelector
            attributes={metric.attributes}
            selectedAttributeKey={attributeKey}
            onChange={setAttributeKey}
            label={translations.label_groupBy_attribute}
          />
        ) : null}
        <ChartTypeSelector chartType={chartType} onChange={setChartType} />
      </Row>
    </>
  );
};

const Row = styled("div")`
  display: flex;
  justify-items: center;
  margin-bottom: ${(p) => p.theme.spacing(2)};

  & > * {
    display: flex;
    flex-basis: 0;
    flex-grow: 1;
    margin-right: ${(p) => p.theme.spacing(2)} !important;

    &:last-of-type {
      margin-right: 0 !important;
    }
  }
`;

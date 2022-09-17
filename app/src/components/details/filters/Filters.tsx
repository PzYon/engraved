import { DateFilters } from "./DateFilters";
import { MetricTypeFactory } from "../../../metricTypes/MetricTypeFactory";
import { GroupByTimeSelector } from "../chart/grouping/GroupByTimeSelector";
import { GroupByAttributeSelector } from "../chart/grouping/GroupByAttributeSelector";
import { ChartTypeSelector } from "../chart/grouping/ChartTypeSelector";
import React, { useState } from "react";
import { styled } from "@mui/material";
import { GroupByTime } from "../chart/consolidation/GroupByTime";
import { IMetric } from "../../../serverApi/IMetric";
import { IconButtonWrapper } from "../../common/IconButtonWrapper";
import { FilterAltOutlined } from "@mui/icons-material";
import { AttributeFilters } from "./AttributeFilters";

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
  const [isVisible, setIsVisible] = useState(false);

  if (!isVisible) {
    return (
      <ButtonContainer>
        <IconButtonWrapper
          action={{
            key: "collapse",
            icon: <FilterAltOutlined />,
            label: "Expand filters",
            onClick: () => setIsVisible(true),
          }}
        />
      </ButtonContainer>
    );
  }

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
          />
        ) : null}
        <ChartTypeSelector chartType={chartType} onChange={setChartType} />
      </Row>
    </>
  );
};

const ButtonContainer = styled("div")`
  display: flex;
  justify-content: end; ;
`;

const Row = styled("div")`
  display: flex;
  justify-items: center;
  margin-bottom: 20px;

  & > * {
    display: flex;
    flex-basis: 0;
    flex-grow: 1;
    margin-right: 20px !important;

    &:last-of-type {
      margin-right: 0 !important;
    }
  }
`;

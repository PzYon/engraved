import React from "react";
import { MetricType } from "../../serverApi/MetricType";
import { MetricTypeFactory } from "../../metricTypes/MetricTypeFactory";
import { Icon, IconStyle } from "./Icon";

export const MetricTypeIcon: React.FC<{
  type: MetricType;
  style: IconStyle;
}> = ({ type, style }) => (
  <Icon style={style}>{MetricTypeFactory.create(type).getIcon()}</Icon>
);

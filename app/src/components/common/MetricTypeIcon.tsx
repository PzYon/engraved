import React from "react";
import { MetricType } from "../../serverApi/MetricType";
import { MetricTypeFactory } from "../../metricTypes/MetricTypeFactory";
import { Icon } from "./Icon";

export enum MetricTypeIconStyle {
  Overview,
  PageTitle,
}

export const MetricTypeIcon: React.FC<{
  type: MetricType;
  style: MetricTypeIconStyle;
}> = ({ type, style }) => {
  return <Icon style={style}>{MetricTypeFactory.create(type).getIcon()}</Icon>;
};

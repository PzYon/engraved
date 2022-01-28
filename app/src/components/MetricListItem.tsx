import React from "react";
import { IMetric } from "../serverApi/IMetric";

export const MetricListItem: React.FC<{ metric: IMetric }> = ({ metric }) => {
  return <div>{metric.name}</div>;
};

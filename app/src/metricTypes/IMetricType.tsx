import { MetricType } from "../serverApi/MetricType";
import React from "react";

// todo:
// - AddMeasurement contains lots MetricType-checks -> improve!
// - Table props
// - Props in over
// - Details or introduction
// - ...

export interface IMetricType {
  type: MetricType;

  isGroupable?: boolean;

  getIcon(): React.ReactNode;
}

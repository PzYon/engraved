import { MetricType } from "../serverApi/MetricType";
import React from "react";
import { IMeasurement } from "../serverApi/IMeasurement";

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

  getMeasurementsListColumns(): IMeasurementsListColumnDefinition[];
}

export interface IMeasurementsListColumnDefinition {
  key: string;
  header: string;
  getValue: (measurement: IMeasurement) => React.ReactNode;
}

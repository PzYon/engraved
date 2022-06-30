import { MetricType } from "../serverApi/MetricType";
import React from "react";
import { IMeasurement } from "../serverApi/IMeasurement";
import { IMetric } from "../serverApi/IMetric";

// todo:
// - AddMeasurement contains lots MetricType-checks -> improve!
// - Table props
// - Props in over
// - Details or introduction
// - ...

export interface IMetricType {
  type: MetricType;

  // consider: removing isGroupable as currently it is true everywhere.
  isGroupable?: boolean;

  getIcon(): React.ReactNode;

  getMeasurementsListColumns(): IMeasurementsListColumnDefinition[];

  hideDateColumnInMeasurementsList?: boolean;

  getOverviewProperties(metric: IMetric): IMetricOverviewPropertyDefinition[];

  getYAxisLabel(metric: IMetric): string;
}

export interface IMetricOverviewPropertyDefinition {
  node: React.ReactNode;
  label: string;
  key: string;
}

export interface IMeasurementsListColumnDefinition {
  key: string;
  header: string;
  getValue: (measurement: IMeasurement) => React.ReactNode;
}

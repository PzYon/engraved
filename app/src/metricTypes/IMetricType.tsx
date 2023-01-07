import { MetricType } from "../serverApi/MetricType";
import React from "react";
import { IMetric } from "../serverApi/IMetric";
import { IDataTableColumnDefinition } from "../components/details/dataTable/IDataTableColumnDefinition";
import { IMeasurement } from "../serverApi/IMeasurement";

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

  getMeasurementsListColumns(): IDataTableColumnDefinition[];

  hideDateColumnInMeasurementsList?: boolean;

  getOverviewProperties(metric: IMetric): IMetricOverviewPropertyDefinition[];

  getYAxisLabel(metric: IMetric): string;

  getValueLabel?(value: number): string;

  getValue(measurement: IMeasurement): number;

  formatTotalValue?(totalValue: number): string;
}

export interface IMetricOverviewPropertyDefinition {
  node: React.ReactNode;
  label: string;
  key: string;
}

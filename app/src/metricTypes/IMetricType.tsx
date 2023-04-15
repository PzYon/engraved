import { MetricType } from "../serverApi/MetricType";
import React from "react";
import { IMetric } from "../serverApi/IMetric";
import { IMeasurementsTableColumnDefinition } from "../components/details/measurementsTable/IMeasurementsTableColumnDefinition";
import { IMeasurement } from "../serverApi/IMeasurement";

// consider: introducing generics here

export interface IMetricType {
  type: MetricType;

  isGroupable?: boolean;

  getIcon(): React.ReactNode;

  getActivity(metric: IMetric, measurement: IMeasurement): React.ReactNode;

  getMeasurementsTableColumns(): IMeasurementsTableColumnDefinition[];

  getYAxisLabel(metric: IMetric): string;

  getValueLabel?(value: number): string;

  getValue(measurement: IMeasurement): number;

  formatTotalValue?(totalValue: number): string;
}

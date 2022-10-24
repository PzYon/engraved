import { IMetricOverviewPropertyDefinition, IMetricType } from "./IMetricType";
import { IDataTableColumnDefinition } from "../components/details/dataTable/IDataTableColumnDefinition";
import { MetricType } from "../serverApi/MetricType";
import React from "react";

export class NotesMetricType implements IMetricType {
  type: MetricType;

  getIcon(): React.ReactNode {
    return undefined;
  }

  getMeasurementsListColumns(): IDataTableColumnDefinition[] {
    return [];
  }

  getOverviewProperties(): IMetricOverviewPropertyDefinition[] {
    return [];
  }

  getYAxisLabel(): string {
    return "";
  }
}

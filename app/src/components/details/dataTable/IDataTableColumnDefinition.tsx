import { IMeasurement } from "../../../serverApi/IMeasurement";
import React from "react";
import { IMetric } from "../../../serverApi/IMetric";

export interface IDataTableColumnDefinition {
  key: string;
  header: string;
  getValueReactNode: (measurement: IMeasurement) => React.ReactNode;
  getRawValue?: (measurement: IMeasurement) => number;
  isSummable?: boolean;
  doHide?: (metric: IMetric) => boolean;
  getGroupKey?: (measurement: IMeasurement) => string;
}

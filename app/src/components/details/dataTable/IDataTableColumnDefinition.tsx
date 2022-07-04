import { IMeasurement } from "../../../serverApi/IMeasurement";
import React from "react";

export interface IDataTableColumnDefinition {
  key: string;
  header: string;
  getValueReactNode: (measurement: IMeasurement) => React.ReactNode;
  getRawValue?: (measurement: IMeasurement) => number;
  isSummable?: boolean;
}

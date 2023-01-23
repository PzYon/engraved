import { IMeasurement } from "../../../serverApi/IMeasurement";
import React from "react";
import { IMetric } from "../../../serverApi/IMetric";
import { IMeasurementsTableGroup } from "./IMeasurementsListGroup";

export interface IMeasurementsListColumnDefinition {
  key: string;
  header: string;
  getValueReactNode: (
    measurement: IMeasurement,
    isFirstRowOfGroup: boolean,
    onClick?: () => void
  ) => React.ReactNode;

  // todo:
  // -  how to deal with injecting setIsCollapsible
  // - clean up the whole mess - it's terrible
  // - implement below method where required
  getGroupReactNode?: (
    group: IMeasurementsTableGroup,
    onClick?: () => void
  ) => React.ReactNode;

  getRawValue?: (measurement: IMeasurement) => number;
  isSummable?: boolean;
  doHide?: (metric: IMetric) => boolean;
  getGroupKey?: (measurement: IMeasurement) => string;
  width?: string;
}

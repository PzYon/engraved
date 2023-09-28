import { IMeasurement } from "../../../serverApi/IMeasurement";
import React from "react";
import { IMetric } from "../../../serverApi/IMetric";
import { IMeasurementsTableGroup } from "./IMeasurementsTableGroup";

export interface IMeasurementsTableColumnDefinition {
  key: string;

  getHeaderReactNode: (onClick: () => void) => React.ReactNode;

  getValueReactNode: (
    group: IMeasurementsTableGroup,
    measurement: IMeasurement,
    isFirstRowOfGroup: boolean,
    onClick?: () => void,
  ) => React.ReactNode;

  getGroupReactNode?: (
    group: IMeasurementsTableGroup,
    onClick?: () => void,
  ) => React.ReactNode;

  getRawValue?: (measurement: IMeasurement) => number;

  isSummable?: boolean;

  doHide?: (metric: IMetric) => boolean;

  getGroupKey?: (measurement: IMeasurement) => string;

  width?: string;
}

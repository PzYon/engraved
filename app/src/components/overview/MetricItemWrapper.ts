import { IMetric } from "../../serverApi/IMetric";
import React from "react";
import { BaseItemWrapper } from "../common/wrappers/BaseItemWrapper";

export class MetricItemWrapper extends BaseItemWrapper<IMetric> {
  constructor(
    ref: React.MutableRefObject<HTMLDivElement>,
    metric: IMetric,
    public addMeasurement: () => void,
    public visit: () => void
  ) {
    super(ref, metric);
  }
}

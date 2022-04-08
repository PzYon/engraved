import { MetricType } from "./MetricType";
import { IMetricFlags } from "./IMetricFlags";

export interface IMetric {
  flags: IMetricFlags;
  key: string;
  name: string;
  description: string;
  type: MetricType;
  lastMeasurementDate: string;
}

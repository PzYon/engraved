import { MetricType } from "./MetricType";
import { IMetricFlags } from "./IMetricFlags";

export interface IMetric {
  id: string;
  flags: IMetricFlags;
  name: string;
  description: string;
  type: MetricType;
  lastMeasurementDate: string;
}

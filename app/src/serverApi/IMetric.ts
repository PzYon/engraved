import { MetricType } from "./MetricType";
import { IMetricAttributes } from "./IMetricAttributes";

export interface IMetric {
  id?: string;
  attributes?: IMetricAttributes;
  name?: string;
  description?: string;
  type: MetricType;
  lastMeasurementDate?: string;
}

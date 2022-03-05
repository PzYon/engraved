import { MetricType } from "./MetricType";

export interface IMetric {
  key: string;
  name: string;
  description: string;
  type: MetricType;
}

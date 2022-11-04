import { IMetricAttributes } from "../IMetricAttributes";
import { IMetricThresholds } from "../IMetricThresholds";

export interface IEditMetricCommand {
  metricId: string;
  name: string;
  description: string;
  notes: string;
  attributes: IMetricAttributes;
  thresholds: IMetricThresholds;
}

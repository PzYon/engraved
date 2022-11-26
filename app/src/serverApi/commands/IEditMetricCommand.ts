import { IMetricAttributes } from "../IMetricAttributes";
import { IMetricThresholds } from "../IMetricThresholds";
import { IMetricCustomProps } from "../IMetricCustomProps";

export interface IEditMetricCommand {
  metricId: string;
  name: string;
  description: string;
  notes: string;
  attributes: IMetricAttributes;
  thresholds: IMetricThresholds;
  customProps: IMetricCustomProps;
}

import { IMetricAttributeValues } from "../IMetricAttributeValues";

export interface IAddMeasurementCommand {
  metricId: string;
  metricAttributeValues?: IMetricAttributeValues;
  notes?: string;
}

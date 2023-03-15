import { IMetricAttributeValues } from "./IMetricAttributeValues";

export interface IMeasurement {
  id?: string;
  notes?: string;
  dateTime: string;
  metricAttributeValues?: IMetricAttributeValues;
  metricId?: string;
}

import { IMetricAttributeValues } from "./IMetricAttributeValues";

export interface IMeasurement {
  id?: string;
  value: number;
  notes?: string;
  dateTime: string;
  metricAttributeValues?: IMetricAttributeValues;
}

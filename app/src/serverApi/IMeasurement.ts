import { IMetricAttributeValues } from "./IMetricAttributeValues";

export interface IMeasurement {
  value: number;
  notes?: string;
  dateTime: string;
  metricAttributeValues?: IMetricAttributeValues;
}

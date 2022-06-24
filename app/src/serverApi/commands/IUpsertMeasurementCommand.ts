import { IMetricAttributeValues } from "../IMetricAttributeValues";

export interface IUpsertMeasurementCommand {
  id?: string;
  metricId: string;
  metricAttributeValues?: IMetricAttributeValues;
  notes?: string;
  dateTime?: Date;
}

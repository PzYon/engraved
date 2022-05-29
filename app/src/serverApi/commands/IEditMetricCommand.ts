import { IMetricAttributes } from "../IMetricAttributes";

export interface IEditMetricCommand {
  metricId: string;
  name: string;
  description: string;
  flags: IMetricAttributes;
}

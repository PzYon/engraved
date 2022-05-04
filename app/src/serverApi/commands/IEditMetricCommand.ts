import { IMetricFlags } from "../IMetricFlags";

export interface IEditMetricCommand {
  metricId: string;
  name: string;
  description: string;
  flags: IMetricFlags;
}

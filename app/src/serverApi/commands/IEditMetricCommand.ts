import { IMetricFlags } from "../IMetricFlags";

export interface IEditMetricCommand {
  metricKey: string;
  name: string;
  flags: IMetricFlags;
}

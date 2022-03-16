import { IMetricFlags } from "../IMetricFlags";

export interface IEditMetricCommand {
  metricKey: string;
  flags: IMetricFlags;
}

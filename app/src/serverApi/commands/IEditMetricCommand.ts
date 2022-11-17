import { IMetricAttributes } from "../IMetricAttributes";
import { IMetricThresholds } from "../IMetricThresholds";
import { IMetricUiSettings } from "../../components/details/edit/MetricUiSettings";

export interface IEditMetricCommand {
  metricId: string;
  name: string;
  description: string;
  notes: string;
  attributes: IMetricAttributes;
  thresholds: IMetricThresholds;
  uiSettings: IMetricUiSettings;
}

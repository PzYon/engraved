import { MetricType } from "./MetricType";
import { IMetricAttributes } from "./IMetricAttributes";
import { IUserPermissions } from "./IUserPermissions";
import { IMetricThresholds } from "./IMetricThresholds";
import { IMetricCustomProps } from "./IMetricCustomProps";

export interface IMetric {
  id?: string;
  attributes?: IMetricAttributes;
  name?: string;
  description?: string;
  notes?: string;
  type: MetricType;
  editedOn?: string;
  thresholds?: IMetricThresholds;
  permissions?: IUserPermissions;
  customProps?: IMetricCustomProps;
}

import { MetricType } from "./MetricType";
import { IMetricAttributes } from "./IMetricAttributes";
import { IUserPermissions } from "./IUserPermissions";

export interface IMetric {
  id?: string;
  attributes?: IMetricAttributes;
  name?: string;
  description?: string;
  notes?: string;
  type: MetricType;
  editedOn?: string;
  permissions?: IUserPermissions;
}

import { MetricType } from "./MetricType";
import { IMetricAttributes } from "./IMetricAttributes";
import { IPermissions } from "./IPermissions";

export interface IMetric {
  id?: string;
  attributes?: IMetricAttributes;
  name?: string;
  description?: string;
  notes?: string;
  type: MetricType;
  lastMeasurementDate?: string;
  permissions?: IPermissions;
}

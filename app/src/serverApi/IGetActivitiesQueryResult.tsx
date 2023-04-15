import { IMeasurement } from "./IMeasurement";
import { IMetric } from "./IMetric";

export interface IGetActivitiesQueryResult {
  metrics: IMetric[];
  measurements: IMeasurement[];
}

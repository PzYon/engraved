import { IMeasurement } from "../../../serverApi/IMeasurement";
import { IMetric } from "../../../serverApi/IMetric";
import { GroupBy } from "./consolidation/GroupBy";

export interface IVisualizationProps {
  measurements: IMeasurement[];
  metric: IMetric;
  groupBy?: GroupBy;
}

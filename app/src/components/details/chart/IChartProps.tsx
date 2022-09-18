import { IMeasurement } from "../../../serverApi/IMeasurement";
import { IMetric } from "../../../serverApi/IMetric";
import { GroupByTime } from "./consolidation/GroupByTime";

export interface IChartProps {
  measurements: IMeasurement[];
  metric: IMetric;
  groupByTime?: GroupByTime;
  groupByAttribute?: string;
  chartType?: string;
}

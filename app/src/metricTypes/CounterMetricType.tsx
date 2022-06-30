import { MetricType } from "../serverApi/MetricType";
import { PlusOneSharp } from "@mui/icons-material";
import {
  IMeasurementsListColumnDefinition,
  IMetricOverviewPropertyDefinition,
  IMetricType,
} from "./IMetricType";
import { IMetric } from "../serverApi/IMetric";

// consider: introducing generics here
export class CounterMetricType implements IMetricType {
  type = MetricType.Counter;

  isGroupable = true;

  getIcon() {
    return <PlusOneSharp />;
  }

  getMeasurementsListColumns(): IMeasurementsListColumnDefinition[] {
    return [];
  }

  getOverviewProperties(): IMetricOverviewPropertyDefinition[] {
    return [];
  }

  getYAxisLabel(metric: IMetric): string {
    return "Count";
  }
}

import { MetricType } from "../serverApi/MetricType";
import { PlusOneSharp } from "@mui/icons-material";
import { IMeasurementsListColumnDefinition, IMetricType } from "./IMetricType";

export class CounterMetricType implements IMetricType {
  type = MetricType.Counter;

  isGroupable = true;

  getIcon() {
    return <PlusOneSharp />;
  }

  getMeasurementsListColumns(): IMeasurementsListColumnDefinition[] {
    return [];
  }
}

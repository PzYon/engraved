import { MetricType } from "../serverApi/MetricType";
import { PlusOneSharp } from "@mui/icons-material";
import { IMetricOverviewPropertyDefinition, IMetricType } from "./IMetricType";
import { IMeasurementsListColumnDefinition } from "../components/details/list/IMeasurementsListColumnDefinition";

// consider: introducing generics here

export class CounterMetricType implements IMetricType {
  type = MetricType.Counter;

  isGroupable = true;

  getIcon() {
    return <PlusOneSharp style={{ backgroundColor: "#DFFFE3" }} />;
  }

  getMeasurementsListColumns(): IMeasurementsListColumnDefinition[] {
    return [];
  }

  getOverviewProperties(): IMetricOverviewPropertyDefinition[] {
    return [];
  }

  getYAxisLabel(): string {
    return "Count";
  }

  getValue(): number {
    return 1;
  }
}

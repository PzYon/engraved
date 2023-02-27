import { MetricType } from "../serverApi/MetricType";
import { PlusOneSharp } from "@mui/icons-material";
import { IMetricType } from "./IMetricType";
import { IMeasurementsTableColumnDefinition } from "../components/details/measurementsTable/IMeasurementsTableColumnDefinition";

// consider: introducing generics here

export class CounterMetricType implements IMetricType {
  type = MetricType.Counter;

  isGroupable = true;

  getIcon() {
    return <PlusOneSharp style={{ backgroundColor: "#DFFFE3" }} />;
  }

  getMeasurementsTableColumns(): IMeasurementsTableColumnDefinition[] {
    return [];
  }

  getYAxisLabel(): string {
    return "Count";
  }

  getValue(): number {
    return 1;
  }
}

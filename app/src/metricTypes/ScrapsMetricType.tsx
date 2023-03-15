import { MetricType } from "../serverApi/MetricType";
import { DynamicFeedOutlined } from "@mui/icons-material";
import { IMetricType } from "./IMetricType";
import { IMeasurementsTableColumnDefinition } from "../components/details/measurementsTable/IMeasurementsTableColumnDefinition";

export class ScrapsMetricType implements IMetricType {
  type = MetricType.Scraps;

  getIcon() {
    return <DynamicFeedOutlined style={{ backgroundColor: "E6CCFF" }} />;
  }

  getMeasurementsTableColumns(): IMeasurementsTableColumnDefinition[] {
    return [];
  }

  getValue(): number {
    throw new Error("getValue is currently not supported for Scraps.");
  }

  getYAxisLabel(): string {
    throw new Error("getYAxisLabel is currently not supported for Scraps.");
  }
}

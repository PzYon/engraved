import { MetricType } from "../serverApi/MetricType";
import { BarChartSharp } from "@mui/icons-material";
import { IMetricOverviewPropertyDefinition, IMetricType } from "./IMetricType";
import { IGaugeMeasurement } from "../serverApi/ITimerMeasurement";
import { IMeasurement } from "../serverApi/IMeasurement";
import { IDataTableColumnDefinition } from "../components/details/dataTable/IDataTableColumnDefinition";

export class GaugeMetricType implements IMetricType {
  type = MetricType.Gauge;

  isGroupable = true;

  getIcon() {
    return <BarChartSharp />;
  }

  getMeasurementsListColumns(): IDataTableColumnDefinition[] {
    return [
      {
        key: "_value",
        header: "Value",
        isSummable: true,
        getRawValue: (measurement: IMeasurement) =>
          (measurement as IGaugeMeasurement).value,
        getValueReactNode: (measurement: IMeasurement) =>
          (measurement as IGaugeMeasurement).value,
      },
    ];
  }

  getOverviewProperties(): IMetricOverviewPropertyDefinition[] {
    return [];
  }

  getYAxisLabel(): string {
    return "Unit [todo]";
  }
}

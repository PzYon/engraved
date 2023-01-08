import { MetricType } from "../serverApi/MetricType";
import { BarChartSharp } from "@mui/icons-material";
import { IMetricOverviewPropertyDefinition, IMetricType } from "./IMetricType";
import { IGaugeMeasurement } from "../serverApi/ITimerMeasurement";
import { IMeasurement } from "../serverApi/IMeasurement";
import { IMeasurementsListColumnDefinition } from "../components/details/list/IMeasurementsListColumnDefinition";
import { getValue } from "../components/details/chart/consolidation/consolidate";

export class GaugeMetricType implements IMetricType {
  type = MetricType.Gauge;

  isGroupable = true;

  getIcon() {
    return <BarChartSharp />;
  }

  getMeasurementsListColumns(): IMeasurementsListColumnDefinition[] {
    return [
      {
        key: "_value",
        header: "Value",
        isSummable: true,
        getRawValue: (measurement: IMeasurement) => getValue(measurement),
        getValueReactNode: (measurement: IMeasurement) => getValue(measurement),
      },
    ];
  }

  getValue(measurement: IMeasurement): number {
    return (measurement as IGaugeMeasurement).value;
  }

  getOverviewProperties(): IMetricOverviewPropertyDefinition[] {
    return [];
  }

  getYAxisLabel(): string {
    return "Unit [todo]";
  }
}

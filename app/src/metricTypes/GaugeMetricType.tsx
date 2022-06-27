import { MetricType } from "../serverApi/MetricType";
import { BarChartSharp } from "@mui/icons-material";
import {
  IMeasurementsListColumnDefinition,
  IMetricOverviewPropertyDefinition,
  IMetricType,
} from "./IMetricType";
import { IGaugeMeasurement } from "../serverApi/ITimerMeasurement";
import { IMeasurement } from "../serverApi/IMeasurement";
import { IMetric } from "../serverApi/IMetric";

export class GaugeMetricType implements IMetricType {
  type = MetricType.Gauge;

  getIcon() {
    return <BarChartSharp />;
  }

  getMeasurementsListColumns(): IMeasurementsListColumnDefinition[] {
    return [
      {
        key: "_value",
        header: "Value",
        getValue: (measurement: IMeasurement) =>
          (measurement as IGaugeMeasurement).value,
      },
    ];
  }

  getOverviewProperties(metric: IMetric): IMetricOverviewPropertyDefinition[] {
    return [];
  }
}

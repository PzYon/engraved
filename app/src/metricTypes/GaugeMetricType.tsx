import { MetricType } from "../serverApi/MetricType";
import { BarChartSharp } from "@mui/icons-material";
import { IMetricType } from "./IMetricType";

export class GaugeMetricType implements IMetricType {
  type = MetricType.Gauge;

  getIcon() {
    return <BarChartSharp />;
  }
}

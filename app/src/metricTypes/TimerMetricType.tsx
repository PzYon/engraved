import { MetricType } from "../serverApi/MetricType";
import { TimerSharp } from "@mui/icons-material";
import { IMetricType } from "./IMetricType";

export class TimerMetricType implements IMetricType {
  type = MetricType.Timer;

  getIcon() {
    return <TimerSharp />;
  }
}

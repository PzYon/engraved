import { MetricType } from "../serverApi/MetricType";
import { TimerSharp } from "@mui/icons-material";
import { IMeasurementsListColumnDefinition, IMetricType } from "./IMetricType";
import { ITimerMeasurement } from "../serverApi/ITimerMeasurement";
import { FormatDate } from "../components/common/FormatDate";
import { differenceInHours } from "date-fns";
import { IMeasurement } from "../serverApi/IMeasurement";

export class TimerMetricType implements IMetricType {
  type = MetricType.Timer;

  getIcon() {
    return <TimerSharp />;
  }

  getMeasurementsListColumns(): IMeasurementsListColumnDefinition[] {
    return [
      {
        key: "_start",
        header: "Start",
        getValue: (measurement: IMeasurement) => (
          <FormatDate value={(measurement as ITimerMeasurement).startDate} />
        ),
      },
      {
        key: "_end",
        header: "End",
        getValue: (measurement: IMeasurement) => (
          <FormatDate value={(measurement as ITimerMeasurement).endDate} />
        ),
      },
      {
        key: "_duration",
        header: "Duration",
        getValue: (measurement: IMeasurement) =>
          differenceInHours(
            new Date((measurement as ITimerMeasurement).endDate),
            new Date((measurement as ITimerMeasurement).startDate)
          ),
      },
    ];
  }
}

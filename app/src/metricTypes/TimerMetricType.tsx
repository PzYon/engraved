import { MetricType } from "../serverApi/MetricType";
import { TimerSharp } from "@mui/icons-material";
import { IMeasurementsListColumnDefinition, IMetricType } from "./IMetricType";
import { ITimerMeasurement } from "../serverApi/ITimerMeasurement";
import { DateFormat, FormatDate } from "../components/common/FormatDate";
import { IMeasurement } from "../serverApi/IMeasurement";
import { formatDistanceStrict } from "date-fns";

export class TimerMetricType implements IMetricType {
  type = MetricType.Timer;

  hideDateColumnInMeasurementsList = true;

  getIcon() {
    return <TimerSharp />;
  }

  getMeasurementsListColumns(): IMeasurementsListColumnDefinition[] {
    return [
      {
        key: "_start",
        header: "Start",
        getValue: (measurement: IMeasurement) => (
          <FormatDate
            value={(measurement as ITimerMeasurement).startDate}
            dateFormat={DateFormat.numerical}
          />
        ),
      },
      {
        key: "_end",
        header: "End",
        getValue: (measurement: IMeasurement) => (
          <FormatDate
            value={(measurement as ITimerMeasurement).endDate}
            dateFormat={DateFormat.numerical}
          />
        ),
      },
      {
        key: "_duration",
        header: "Duration",
        getValue: (measurement: IMeasurement) => {
          const timerMeasurement = measurement as ITimerMeasurement;

          return formatDistanceStrict(
            timerMeasurement.endDate
              ? new Date(timerMeasurement.endDate)
              : new Date(),
            new Date(timerMeasurement.startDate)
          );
        },
      },
    ];
  }
}

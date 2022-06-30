import { MetricType } from "../serverApi/MetricType";
import { TimerSharp } from "@mui/icons-material";
import {
  IMeasurementsListColumnDefinition,
  IMetricOverviewPropertyDefinition,
  IMetricType,
} from "./IMetricType";
import { ITimerMeasurement } from "../serverApi/ITimerMeasurement";
import { DateFormat, FormatDate } from "../components/common/FormatDate";
import { IMeasurement } from "../serverApi/IMeasurement";
import { formatDistanceStrict } from "date-fns";
import { IMetric } from "../serverApi/IMetric";
import { ITimerMetric } from "../serverApi/ITimerMetric";

export class TimerMetricType implements IMetricType {
  type = MetricType.Timer;

  isGroupable = true;

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

  getOverviewProperties(metric: IMetric): IMetricOverviewPropertyDefinition[] {
    const timerMetric = metric as ITimerMetric;

    if (timerMetric.startDate) {
      return [
        {
          node: <FormatDate key="start-date" value={timerMetric.startDate} />,
          key: "start-date",
          label: "Start date",
        },
      ];
    }

    return [];
  }
}

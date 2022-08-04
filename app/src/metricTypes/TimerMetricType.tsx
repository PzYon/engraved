import { MetricType } from "../serverApi/MetricType";
import { TimerSharp } from "@mui/icons-material";
import { IMetricOverviewPropertyDefinition, IMetricType } from "./IMetricType";
import { ITimerMeasurement } from "../serverApi/ITimerMeasurement";
import { DateFormat, FormatDate } from "../components/common/FormatDate";
import { IMeasurement } from "../serverApi/IMeasurement";
import { differenceInMinutes, formatDistanceStrict } from "date-fns";
import { IMetric } from "../serverApi/IMetric";
import { ITimerMetric } from "../serverApi/ITimerMetric";
import { IDataTableColumnDefinition } from "../components/details/dataTable/IDataTableColumnDefinition";

export class TimerMetricType implements IMetricType {
  type = MetricType.Timer;

  isGroupable = true;

  hideDateColumnInMeasurementsList = true;

  getIcon() {
    return <TimerSharp />;
  }

  getMeasurementsListColumns(): IDataTableColumnDefinition[] {
    return [
      {
        key: "_start",
        header: "Start",
        getValueReactNode: (measurement: IMeasurement) => (
          <FormatDate
            value={(measurement as ITimerMeasurement).startDate}
            dateFormat={DateFormat.timeOnly}
          />
        ),
      },
      {
        key: "_end",
        header: "End",
        getValueReactNode: (measurement: IMeasurement) => (
          <FormatDate
            value={(measurement as ITimerMeasurement).endDate}
            dateFormat={DateFormat.timeOnly}
          />
        ),
      },
      {
        key: "_duration",
        header: "Duration",
        getValueReactNode: (measurement: IMeasurement) => {
          const timerMeasurement = measurement as ITimerMeasurement;

          const endDate = timerMeasurement.endDate
            ? new Date(timerMeasurement.endDate)
            : new Date();
          const startDate = new Date(timerMeasurement.startDate);

          const totalMinutes = differenceInMinutes(endDate, startDate);

          if (totalMinutes < 60 || totalMinutes > 1440) {
            return formatDistanceStrict(endDate, startDate);
          }

          const hours = Math.floor(totalMinutes / 60);
          const minutes = totalMinutes % 60;

          return `${hours}:${minutes < 10 ? "0" + minutes : minutes}h`;
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

  getYAxisLabel(): string {
    return "Hours";
  }

  getValueLabel(value: number): string {
    return Math.round((value as number) / 60).toString();
  }
}

import { MetricType } from "../serverApi/MetricType";
import { TimerSharp } from "@mui/icons-material";
import { IMetricOverviewPropertyDefinition, IMetricType } from "./IMetricType";
import { ITimerMeasurement } from "../serverApi/ITimerMeasurement";
import { DateFormat, FormatDate } from "../components/common/FormatDate";
import { IMeasurement } from "../serverApi/IMeasurement";
import {
  differenceInMinutes,
  differenceInSeconds,
  formatDistanceStrict,
} from "date-fns";
import { IMeasurementsListColumnDefinition } from "../components/details/dataTable/IMeasurementsListColumnDefinition";

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
        isSummable: true,
        getRawValue: (measurement: IMeasurement) => this.getValue(measurement),
        getValueReactNode: (measurement: IMeasurement) => {
          const timerMeasurement = measurement as ITimerMeasurement;
          return TimerMetricType.getDuration(
            timerMeasurement.startDate,
            timerMeasurement.endDate
          );
        },
      },
    ];
  }

  getOverviewProperties(): IMetricOverviewPropertyDefinition[] {
    return [];
  }

  getYAxisLabel(): string {
    return "Hours";
  }

  getValueLabel(value: number): string {
    return Math.round((value as number) / 60).toString();
  }

  getValue(measurement: IMeasurement): number {
    const m = measurement as ITimerMeasurement;

    return differenceInSeconds(
      m.endDate ? new Date(m.endDate) : new Date(),
      new Date(m.startDate)
    );
  }

  formatTotalValue(totalValue: number): string {
    const hours = Math.floor(totalValue / 60);
    const minutes = totalValue % 60;

    return `${hours}:${minutes < 10 ? "0" + minutes : minutes}h`;
  }

  public static getDuration(start: string, end: string): string {
    const endDate = end ? new Date(end) : new Date();
    const startDate = new Date(start);

    const totalMinutes = differenceInMinutes(endDate, startDate);

    if (totalMinutes < 60 || totalMinutes > 1440) {
      return formatDistanceStrict(endDate, startDate);
    }

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return `${hours}:${minutes < 10 ? "0" + minutes : minutes}h`;
  }
}

import { MetricType } from "../serverApi/MetricType";
import { TimerSharp } from "@mui/icons-material";
import { IMetricOverviewPropertyDefinition, IMetricType } from "./IMetricType";
import { ITimerMeasurement } from "../serverApi/ITimerMeasurement";
import { DateFormat, FormatDate } from "../components/common/FormatDate";
import { IMeasurement } from "../serverApi/IMeasurement";
import { differenceInSeconds } from "date-fns";
import { IMeasurementsListColumnDefinition } from "../components/details/list/IMeasurementsListColumnDefinition";
import { getDurationAsHhMmSsFromSeconds } from "../util/getDurationAsHhMmSs";
import { FormatDuration } from "../components/common/FormatDuration";

export class TimerMetricType implements IMetricType {
  type = MetricType.Timer;

  isGroupable = true;

  hideDateColumnInMeasurementsList = true;

  getIcon() {
    return <TimerSharp style={{ backgroundColor: "#FFDFEC" }} />;
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

          return (
            <FormatDuration
              start={timerMeasurement.startDate}
              end={timerMeasurement.endDate}
            />
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
    return getDurationAsHhMmSsFromSeconds(totalValue);
  }
}

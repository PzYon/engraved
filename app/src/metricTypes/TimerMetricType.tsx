import { MetricType } from "../serverApi/MetricType";
import { TimerSharp } from "@mui/icons-material";
import { IMetricType } from "./IMetricType";
import { ITimerMeasurement } from "../serverApi/ITimerMeasurement";
import { DateFormat, FormatDate } from "../components/common/FormatDate";
import { IMeasurement } from "../serverApi/IMeasurement";
import { differenceInSeconds } from "date-fns";
import { IMeasurementsTableColumnDefinition } from "../components/details/measurementsTable/IMeasurementsTableColumnDefinition";
import { getDurationAsHhMmSsFromSeconds } from "../util/getDurationAsHhMmSs";
import { FormatDuration } from "../components/common/FormatDuration";
import { IMeasurementsTableGroup } from "../components/details/measurementsTable/IMeasurementsTableGroup";
import { IMetric } from "../serverApi/IMetric";
import React from "react";

export class TimerMetricType implements IMetricType {
  type = MetricType.Timer;

  isGroupable = true;

  getIcon() {
    return <TimerSharp style={{ backgroundColor: "#FFDFEC" }} />;
  }

  getActivity(metric: IMetric, measurement: IMeasurement): React.ReactNode {
    return <>{metric.name}</>;
  }

  getMeasurementsTableColumns(): IMeasurementsTableColumnDefinition[] {
    return [
      {
        key: "_start",
        getHeaderReactNode: () => "Start",
        getValueReactNode: (
          _: IMeasurementsTableGroup,
          measurement: IMeasurement
        ) => (
          <FormatDate
            value={(measurement as ITimerMeasurement).startDate}
            dateFormat={DateFormat.timeOnly}
          />
        ),
      },
      {
        key: "_end",
        getHeaderReactNode: () => "End",
        getValueReactNode: (
          _: IMeasurementsTableGroup,
          measurement: IMeasurement
        ) => (
          <FormatDate
            value={(measurement as ITimerMeasurement).endDate}
            dateFormat={DateFormat.timeOnly}
          />
        ),
      },
      {
        key: "_duration",
        getHeaderReactNode: () => "Duration",
        isSummable: true,
        getRawValue: (measurement: IMeasurement) => this.getValue(measurement),
        getValueReactNode: (
          group: IMeasurementsTableGroup,
          measurement: IMeasurement
        ) => {
          const timerMeasurement = measurement as ITimerMeasurement;

          return (
            <FormatDuration
              start={timerMeasurement.startDate}
              end={timerMeasurement.endDate}
            />
          );
        },
        getGroupReactNode: (group) => group.totalString,
      },
    ];
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

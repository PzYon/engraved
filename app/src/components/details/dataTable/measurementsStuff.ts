import { IMeasurement } from "../../../serverApi/IMeasurement";
import { MetricTypeFactory } from "../../../metricTypes/MetricTypeFactory";
import { MetricType } from "../../../serverApi/MetricType";
import { ITimerMeasurement } from "../../../serverApi/ITimerMeasurement";
import { format } from "date-fns";

export interface IMeasurementsTableGroup {
  measurements: IMeasurement[];
  total: number;
  label: string;
}

export function getMeasurementsTableGroups(
  measurements: IMeasurement[],
  metricType: MetricType
): IMeasurementsTableGroup[] {
  const type = MetricTypeFactory.create(metricType);

  const groupsByKey: { [groupKey: string]: IMeasurementsTableGroup } = {};

  for (const measurement of measurements) {
    const groupKey = getGroupKey(metricType, measurement);

    if (!groupsByKey[groupKey]) {
      groupsByKey[groupKey] = { measurements: [], label: groupKey, total: 0 };
    }

    groupsByKey[groupKey].measurements.push(measurement);
    groupsByKey[groupKey].total += type.getValue(measurement);
  }

  return Object.values(groupsByKey);
}

export function getGroupKey(metricType: MetricType, measurement: IMeasurement) {
  return format(
    new Date(
      metricType === MetricType.Timer
        ? (measurement as ITimerMeasurement).startDate
        : measurement.dateTime
    ),
    "u-LL-dd"
  );
}

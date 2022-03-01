import { IMeasurement } from "../../../../serverApi/IMeasurement";

export enum GroupBy {
  Day,
  Month,
}

export interface IGroupedMeasurment {
  value: number;
  label: string;
  rawValues: IMeasurement[];
}

export function consolidate(
  measurements: IMeasurement[],
  groupBy: GroupBy
): IGroupedMeasurment[] {
  const valuesByGroup: { [groupKey: string]: IMeasurement[] } = {};

  for (const measurement of measurements) {
    const groupKey = getGroupKey(measurement, groupBy);

    if (!valuesByGroup[groupKey]) {
      valuesByGroup[groupKey] = [];
    }

    valuesByGroup[groupKey].push(measurement);
  }

  return Object.keys(valuesByGroup).map((groupKey) => {
    const measurements = valuesByGroup[groupKey];

    return {
      value: measurements
        .map((m) => m.value)
        .reduce((total, current) => total + current, 0),
      label: groupKey,
      rawValues: measurements,
    };
  });
}

function getGroupKey(measurement: IMeasurement, groupBy: GroupBy) {
  switch (groupBy) {
    case GroupBy.Day:
      return new Date(measurement.dateTime).getDate();
    case GroupBy.Month:
      return new Date(measurement.dateTime).getMonth() + 1;
    default:
      throw new Error(`GroupBy ${groupBy} is not yet supported.`);
  }
}

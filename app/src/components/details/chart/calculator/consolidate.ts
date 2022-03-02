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

class GroupKey {
  public uniqueKey: string;
  public label: string;

  public static getGroupKey(dateTime: string, groupBy: GroupBy): GroupKey {
    const date = new Date(dateTime);

    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDay();

    switch (groupBy) {
      case GroupBy.Day:
        return {
          label: `${day} (${year}-${month})`,
          uniqueKey: GroupKey.concatKey(year, month, day),
        };
      case GroupBy.Month:
        return {
          label: `${month} (${year})`,
          uniqueKey: GroupKey.concatKey(year, month),
        };
      default:
        throw new Error(`GroupBy ${groupBy} is not yet supported.`);
    }
  }

  private static concatKey(...values: number[]): string {
    return values.join("::");
  }
}

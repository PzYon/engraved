import { IMeasurement } from "../../../../serverApi/IMeasurement";

export enum GroupBy {
  Day,
  Month,
}

export interface IGroupedMeasurment {
  value: number;
  groupKey: GroupKey;
  rawValues: IMeasurement[];
}

export function consolidate(
  measurements: IMeasurement[],
  groupBy: GroupBy
): IGroupedMeasurment[] {
  const valuesByGroup: { [groupKey: string]: IMeasurement[] } = {};

  for (const measurement of measurements) {
    const groupKey = GroupKey.build(measurement.dateTime, groupBy);

    const keyAsString = groupKey.serialize();
    if (!valuesByGroup[keyAsString]) {
      valuesByGroup[keyAsString] = [];
    }

    valuesByGroup[keyAsString].push(measurement);
  }

  return Object.keys(valuesByGroup).map((keyAsString) => {
    const measurements = valuesByGroup[keyAsString];

    return {
      value: measurements
        .map((m) => m.value)
        .reduce((total, current) => total + current, 0),
      groupKey: GroupKey.deserialize(keyAsString),
      rawValues: measurements,
    };
  });
}

export class GroupKey {
  private static readonly separator = "::";

  private constructor(
    public year: number,
    public month: number,
    public day: number
  ) {}

  static build(dateTime: string, groupBy: GroupBy): GroupKey {
    const date = new Date(dateTime);

    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    switch (groupBy) {
      case GroupBy.Day:
        return new GroupKey(year, month, day);
      case GroupBy.Month:
        return new GroupKey(year, month, 0);
      default:
        throw new Error(`GroupBy ${groupBy} is not yet supported.`);
    }
  }

  static deserialize(s: string): GroupKey {
    const segments = s.split(GroupKey.separator);
    if (segments.length !== 3) {
      throw new Error(`${s} is not a valid GroupKey.`);
    }

    return new GroupKey(
      parseInt(segments[0]),
      parseInt(segments[1]),
      parseInt(segments[2])
    );
  }

  serialize(): string {
    return [this.year, this.month, this.day].join(GroupKey.separator);
  }
}

import { IMeasurement } from "../../../../serverApi/IMeasurement";
import { GroupKey } from "./GroupKey";
import { GroupBy } from "./GroupBy";

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

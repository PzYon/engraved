import { IMeasurement } from "../../../../serverApi/IMeasurement";
import { ConsolidationKey } from "./ConsolidationKey";
import { GroupBy } from "./GroupBy";
import { IConsolidatedMeasurements } from "./IConsolidatedMeasurements";

export function consolidate(
  measurements: IMeasurement[],
  groupBy: GroupBy
): IConsolidatedMeasurements[] {
  const valuesByGroup = measurements.reduce(
    (
      previousValue: { [groupKey: string]: IMeasurement[] },
      measurement: IMeasurement
    ) => {
      const groupKey = ConsolidationKey.build(measurement.dateTime, groupBy);

      const keyAsString = groupKey.serialize();
      if (!previousValue[keyAsString]) {
        previousValue[keyAsString] = [];
      }

      previousValue[keyAsString].push(measurement);

      return previousValue;
    },
    {}
  );

  return Object.keys(valuesByGroup).map((keyAsString) => {
    const measurements = valuesByGroup[keyAsString];

    return {
      value: measurements
        .map((m) => m.value)
        .reduce((total, current) => total + current, 0),
      groupKey: ConsolidationKey.deserialize(keyAsString),
      measurements: measurements,
    };
  });
}

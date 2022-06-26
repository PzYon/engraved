import { IMeasurement } from "../../../../serverApi/IMeasurement";
import { ConsolidationKey } from "./ConsolidationKey";
import { GroupByTime } from "./GroupByTime";
import { IConsolidatedMeasurements } from "./IConsolidatedMeasurements";
import {
  IGaugeMeasurement,
  ITimerMeasurement,
} from "../../../../serverApi/ITimerMeasurement";
import { differenceInHours } from "date-fns";

export function consolidate(
  measurements: IMeasurement[],
  groupByTime: GroupByTime
): IConsolidatedMeasurements[] {
  const valuesByGroupKey = measurements.reduce(
    (
      previousValue: { [groupKey: string]: IMeasurement[] },
      measurement: IMeasurement
    ) => {
      const key = ConsolidationKey.build(measurement.dateTime, groupByTime);
      const keyAsString = key.serialize();

      if (!previousValue[keyAsString]) {
        previousValue[keyAsString] = [];
      }

      previousValue[keyAsString].push(measurement);

      return previousValue;
    },
    {}
  );

  return Object.keys(valuesByGroupKey).map((keyAsString) => {
    const measurements = valuesByGroupKey[keyAsString];

    return {
      value: measurements
        .map(getValue)
        .reduce((total, current) => total + current, 0),
      groupKey: ConsolidationKey.deserialize(keyAsString),
      measurements: measurements,
    };
  });
}

export function getValue(m: IMeasurement) {
  // at the moment we use the number of measurements as
  // this is only called when counter and there the value
  // is always one.
  // i guess that's correct, however this should also be
  // possible for other metric types i suppose?

  const timerMeasurement = m as ITimerMeasurement;
  if (timerMeasurement.startDate) {
    return differenceInHours(
      timerMeasurement.endDate
        ? new Date(timerMeasurement.endDate)
        : new Date(),
      new Date(timerMeasurement.startDate)
    );
  }

  return (m as IGaugeMeasurement).value ?? 1;
}

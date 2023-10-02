import { IEntry } from "../../../../serverApi/IEntry";
import { ConsolidationKey } from "./ConsolidationKey";
import { GroupByTime } from "./GroupByTime";
import { IConsolidatedEntries } from "./IConsolidatedEntries";
import { ITimerEntry } from "../../../../serverApi/ITimerEntry";
import { differenceInMinutes } from "date-fns";
import { IGaugeEntry } from "../../../../serverApi/IGaugeEntry";

export function consolidate(
  measurements: IEntry[],
  groupByTime: GroupByTime,
): IConsolidatedEntries[] {
  const valuesByGroupKey = measurements.reduce(
    (previousValue: Record<string, IEntry[]>, measurement: IEntry) => {
      const key = ConsolidationKey.build(measurement.dateTime, groupByTime);
      const keyAsString = key.serialize();

      if (!previousValue[keyAsString]) {
        previousValue[keyAsString] = [];
      }

      previousValue[keyAsString].push(measurement);

      return previousValue;
    },
    {},
  );

  return Object.keys(valuesByGroupKey).map((keyAsString) => {
    const measurements = valuesByGroupKey[keyAsString];

    return {
      value: measurements
        .map(getValue)
        .reduce((total, current) => total + current, 0),
      groupKey: ConsolidationKey.deserialize(keyAsString),
      entries: measurements,
    };
  });
}

export function getValue(m: IEntry) {
  // at the moment we use the number of measurements as
  // this is only called when counter and there the value
  // is always one.
  // i guess that's correct, however this should also be
  // possible for other metric types i suppose?

  const timerMeasurement = m as ITimerEntry;
  if (timerMeasurement.startDate) {
    return getTimerMeasurementValue(timerMeasurement);
  }

  return (m as IGaugeEntry).value ?? 1;
}

export function getTimerMeasurementValue(timerMeasurement: ITimerEntry) {
  if (!timerMeasurement.startDate) {
    return 0;
  }

  return differenceInMinutes(
    timerMeasurement.endDate ? new Date(timerMeasurement.endDate) : new Date(),
    new Date(timerMeasurement.startDate),
  );
}

import { IMeasurement } from "../../../../serverApi/IMeasurement";
import { IMetric } from "../../../../serverApi/IMetric";
import { MetricType } from "../../../../serverApi/MetricType";
import { consolidate } from "../consolidation/consolidate";
import { GroupBy } from "../consolidation/GroupBy";
import { ITransformedMeasurement } from "./ITransformedMeasurement";

export function transform(
  measurements: IMeasurement[],
  metric: IMetric
): ITransformedMeasurement[] {
  if (metric.type === MetricType.Counter) {
    return consolidate(measurements, GroupBy.Month).map((m) => {
      return {
        x: new Date(m.groupKey.year, m.groupKey.month - 1, m.groupKey.day),
        y: m.value,
      };
    });
  }

  return measurements.map((m) => {
    return {
      x: new Date(m.dateTime),
      y: m.value,
    };
  });
}

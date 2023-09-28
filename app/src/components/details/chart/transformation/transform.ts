import { IMeasurement } from "../../../../serverApi/IMeasurement";
import { IMetric } from "../../../../serverApi/IMetric";
import { consolidate, getValue } from "../consolidation/consolidate";
import { GroupByTime } from "../consolidation/GroupByTime";
import { ITransformedMeasurement } from "./ITransformedMeasurement";
import { MetricTypeFactory } from "../../../../metricTypes/MetricTypeFactory";

export function transform(
  measurements: IMeasurement[],
  metric: IMetric,
  groupBy: GroupByTime,
): ITransformedMeasurement[] {
  if (
    MetricTypeFactory.create(metric.type).isGroupable &&
    groupBy !== GroupByTime.None
  ) {
    return consolidate(measurements, groupBy).map((m) => {
      const month = m.groupKey.month - 1;
      const day = m.groupKey.day || 1;

      return {
        x: new Date(m.groupKey.year, month, day),
        y: m.value,
        measurements: m.measurements,
      };
    });
  }

  return measurements.map((m) => {
    return {
      x: new Date(m.dateTime),
      y: getValue(m),
      measurements: [m],
    };
  });
}

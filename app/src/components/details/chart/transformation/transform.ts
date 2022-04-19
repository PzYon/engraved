import { IMeasurement } from "../../../../serverApi/IMeasurement";
import { IMetric } from "../../../../serverApi/IMetric";
import { consolidate } from "../consolidation/consolidate";
import { GroupBy } from "../consolidation/GroupBy";
import { ITransformedMeasurement } from "./ITransformedMeasurement";
import { MetricTypeFactory } from "../../../../metricTypes/MetricTypeFactory";

export function transform(
  measurements: IMeasurement[],
  metric: IMetric,
  groupBy: GroupBy
): ITransformedMeasurement[] {
  if (MetricTypeFactory.create(metric.type).isGroupable) {
    return consolidate(measurements, groupBy).map((m) => {
      const month = m.groupKey.month - 1;
      const day = m.groupKey.day || 1;

      return {
        x: new Date(m.groupKey.year, month, day),
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

import { IMetric } from "../../../../serverApi/IMetric";
import { IMeasurement } from "../../../../serverApi/IMeasurement";
import { GroupByTime } from "../consolidation/GroupByTime";
import { transform } from "../transformation/transform";
import { IDataSet } from "./IDataSet";
import { IMetricAttributes } from "../../../../serverApi/IMetricAttributes";

export function createDataSets(
  allMeasurements: IMeasurement[],
  metric: IMetric,
  groupByTime: GroupByTime,
  attributeKey: string
) {
  return getMeasurementsPerAttribute(
    allMeasurements,
    metric.attributes,
    attributeKey
  )
    .filter((measurementsByAttribute) => measurementsByAttribute.length)
    .map((measurements) =>
      measurementsToDataSet(measurements, metric, groupByTime, attributeKey)
    );
}

function measurementsToDataSet(
  measurements: IMeasurement[],
  metric: IMetric,
  groupByTime: GroupByTime,
  attributeKey: string
): IDataSet {
  const data = transform(measurements, metric, groupByTime);

  // todo: we use indexer here to get (only) the first item. what if there's more?
  const valueKey = measurements[0]?.metricAttributeValues?.[attributeKey]?.[0];

  return {
    label: valueKey
      ? metric.attributes[attributeKey].values[valueKey]
      : metric.name,
    data: data,
  };
}

function getMeasurementsPerAttribute(
  allMeasurements: IMeasurement[],
  metricAttributes: IMetricAttributes,
  attributeKey: string
) {
  const allValueKeys = [
    ...Object.keys(metricAttributes[attributeKey]?.values || {}),
    null, // null is for measurements without a flag
  ];

  return allValueKeys.map((valueKey) =>
    allMeasurements.filter(filterByAttribute(attributeKey, valueKey))
  );
}

function filterByAttribute(attributeKey: string, valueKey: string) {
  return (m: IMeasurement) =>
    valueKey
      ? m.metricAttributeValues[attributeKey]?.indexOf(valueKey) > -1
      : !m.metricAttributeValues[attributeKey]?.length;
}

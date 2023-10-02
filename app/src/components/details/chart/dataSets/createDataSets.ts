import { IJournal } from "../../../../serverApi/IJournal";
import { IEntry } from "../../../../serverApi/IEntry";
import { GroupByTime } from "../consolidation/GroupByTime";
import { transform } from "../transformation/transform";
import { IDataSet } from "./IDataSet";
import { IJournalAttributes } from "../../../../serverApi/IJournalAttributes";

export function createDataSets(
  allMeasurements: IEntry[],
  metric: IJournal,
  groupByTime: GroupByTime,
  attributeKey: string,
) {
  return getMeasurementsPerAttribute(
    allMeasurements,
    metric.attributes,
    attributeKey,
  )
    .filter((measurementsByAttribute) => measurementsByAttribute.length)
    .map((measurements) =>
      measurementsToDataSet(measurements, metric, groupByTime, attributeKey),
    );
}

function measurementsToDataSet(
  measurements: IEntry[],
  metric: IJournal,
  groupByTime: GroupByTime,
  attributeKey: string,
): IDataSet {
  const data = transform(measurements, metric, groupByTime);

  // todo: we use indexer here to get (only) the first item. what if there's more?
  const valueKey = measurements[0]?.journalAttributeValues?.[attributeKey]?.[0];

  return {
    label: valueKey
      ? metric.attributes[attributeKey].values[valueKey]
      : metric.name,
    data: data,
  };
}

function getMeasurementsPerAttribute(
  allMeasurements: IEntry[],
  metricAttributes: IJournalAttributes,
  attributeKey: string,
) {
  const allValueKeys = [
    ...Object.keys(metricAttributes[attributeKey]?.values || {}),
    null, // null is for measurements without a flag
  ];

  return allValueKeys.map((valueKey) =>
    allMeasurements.filter(filterByAttribute(attributeKey, valueKey)),
  );
}

function filterByAttribute(attributeKey: string, valueKey: string) {
  return (m: IEntry) =>
    valueKey
      ? m.journalAttributeValues[attributeKey]?.indexOf(valueKey) > -1
      : !m.journalAttributeValues[attributeKey]?.length;
}

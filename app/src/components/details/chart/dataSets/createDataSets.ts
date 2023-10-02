import { IJournal } from "../../../../serverApi/IJournal";
import { IEntry } from "../../../../serverApi/IEntry";
import { GroupByTime } from "../consolidation/GroupByTime";
import { transform } from "../transformation/transform";
import { IDataSet } from "./IDataSet";
import { IJournalAttributes } from "../../../../serverApi/IJournalAttributes";

export function createDataSets(
  allEntries: IEntry[],
  journal: IJournal,
  groupByTime: GroupByTime,
  attributeKey: string,
) {
  return getMeasurementsPerAttribute(
    allEntries,
    journal.attributes,
    attributeKey,
  )
    .filter((entriesByAttribute) => entriesByAttribute.length)
    .map((entries) =>
      measurementsToDataSet(entries, journal, groupByTime, attributeKey),
    );
}

function measurementsToDataSet(
  entries: IEntry[],
  journal: IJournal,
  groupByTime: GroupByTime,
  attributeKey: string,
): IDataSet {
  const data = transform(entries, journal, groupByTime);

  // todo: we use indexer here to get (only) the first item. what if there's more?
  const valueKey = entries[0]?.journalAttributeValues?.[attributeKey]?.[0];

  return {
    label: valueKey
      ? journal.attributes[attributeKey].values[valueKey]
      : journal.name,
    data: data,
  };
}

function getMeasurementsPerAttribute(
  allEntries: IEntry[],
  journalAttributes: IJournalAttributes,
  attributeKey: string,
) {
  const allValueKeys = [
    ...Object.keys(journalAttributes[attributeKey]?.values || {}),
    null, // null is for measurements without a flag
  ];

  return allValueKeys.map((valueKey) =>
    allEntries.filter(filterByAttribute(attributeKey, valueKey)),
  );
}

function filterByAttribute(attributeKey: string, valueKey: string) {
  return (m: IEntry) =>
    valueKey
      ? m.journalAttributeValues[attributeKey]?.indexOf(valueKey) > -1
      : !m.journalAttributeValues[attributeKey]?.length;
}

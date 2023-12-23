import { IJournal } from "../../../../serverApi/IJournal";
import { IEntry } from "../../../../serverApi/IEntry";
import { GroupByTime } from "../consolidation/GroupByTime";
import { transform } from "../transformation/transform";
import { IDataSet } from "./IDataSet";
import { IJournalAttributes } from "../../../../serverApi/IJournalAttributes";

export function createDataSets(
  entries: IEntry[],
  journal: IJournal,
  groupByTime: GroupByTime,
  attributeKey: string,
) {
  return getEntriesPerAttribute(entries, journal.attributes, attributeKey)
    .filter((entriesByAttribute) => entriesByAttribute.length)
    .map((entries) =>
      entriesToDataSet(entries, journal, groupByTime, attributeKey),
    );
}

function entriesToDataSet(
  entries: IEntry[],
  journal: IJournal,
  groupByTime: GroupByTime,
  attributeKey: string,
): IDataSet {
  const data = transform(entries, journal, groupByTime);

  // todo: we use indexer here to get (only) the first item. what if there's more?
  const valueKey = entries[0]?.journalAttributeValues?.[attributeKey]?.[0];

  // dataSet.data = movingAverage(dataSet.data, 9);

  return {
    data,
    label: valueKey
      ? journal.attributes[attributeKey].values[valueKey]
      : journal.name,
  };
}

function getEntriesPerAttribute(
  entries: IEntry[],
  journalAttributes: IJournalAttributes,
  attributeKey: string,
) {
  const allValueKeys = [
    ...Object.keys(journalAttributes[attributeKey]?.values || {}),
    null, // null is for entries without a flag
  ];

  return allValueKeys.map((valueKey) =>
    entries.filter(filterByAttribute(attributeKey, valueKey)),
  );
}

function filterByAttribute(attributeKey: string, valueKey: string) {
  return (m: IEntry) =>
    valueKey
      ? m.journalAttributeValues[attributeKey]?.indexOf(valueKey) > -1
      : !m.journalAttributeValues[attributeKey]?.length;
}

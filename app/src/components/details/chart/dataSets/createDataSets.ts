import { IJournal } from "../../../../serverApi/IJournal";
import { IEntry } from "../../../../serverApi/IEntry";
import { GroupByTime } from "../consolidation/GroupByTime";
import { transform } from "../transformation/transform";
import { IDataSet } from "./IDataSet";
import { IJournalAttributes } from "../../../../serverApi/IJournalAttributes";
import { IChartUiProps } from "../IChartProps";
import { movingAverage } from "./movingAverage";

export function createDataSets(
  entries: IEntry[],
  journal: IJournal,
  groupByTime: GroupByTime,
  attributeKey: string,
  chartUiProps: IChartUiProps,
) {
  return getEntriesPerAttribute(entries, journal.attributes, attributeKey)
    .filter((entriesByAttribute) => entriesByAttribute.length)
    .map((entries) =>
      entriesToDataSet(
        entries,
        journal,
        groupByTime,
        attributeKey,
        chartUiProps,
      ),
    );
}

function entriesToDataSet(
  entries: IEntry[],
  journal: IJournal,
  groupByTime: GroupByTime,
  attributeKey: string,
  chartUiProps: IChartUiProps,
): IDataSet {
  let data = transform(entries, journal, groupByTime);

  if (chartUiProps?.rollingAverage > 0) {
    data = movingAverage(data, chartUiProps.rollingAverage);
  }

  // todo: we use indexer here to get (only) the first item. what if there's more?
  const valueKey = entries[0]?.journalAttributeValues?.[attributeKey]?.[0];

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

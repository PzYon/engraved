import { JournalType } from "../../../serverApi/JournalType";
import { IJournalThresholds } from "../../../serverApi/IJournalThresholds";
import { IEntry } from "../../../serverApi/IEntry";
import { IThresholdValues } from "../../../serverApi/IThresholdValues";
import { JournalTypeFactory } from "../../../journalTypes/JournalTypeFactory";
import { IJournalType } from "../../../journalTypes/IJournalType";

export const calculateThresholds = (
  journalType: JournalType,
  thresholds: IJournalThresholds,
  entries: IEntry[],
): IThresholdValues => {
  const thresholdValues: IThresholdValues = {};

  const type = JournalTypeFactory.create(journalType);

  for (const attributeKey of Object.keys(thresholds ?? {})) {
    for (const attributeValueKey of Object.keys(thresholds[attributeKey])) {
      const definition = thresholds[attributeKey][attributeValueKey];

      if (!thresholdValues[attributeKey]) {
        thresholdValues[attributeKey] = {};
      }

      thresholdValues[attributeKey][attributeValueKey] = {
        thresholdDefinition: definition,
        actualValue: getActualValue(
          attributeKey,
          type,
          entries,
          attributeValueKey,
        ),
      };
    }
  }

  return thresholdValues;
};

function getActualValue(
  attributeKey: string,
  type: IJournalType,
  entries: IEntry[],
  attributeValueKey: string,
) {
  if (attributeKey === "-") {
    return getSumUnfiltered(type, entries);
  }

  return getSumFilteredByAttributeValue(
    type,
    entries,
    attributeKey,
    attributeValueKey,
  );
}

function getSumFilteredByAttributeValue(
  type: IJournalType,
  entries: IEntry[],
  attributeKey: string,
  attributeValueKey: string,
) {
  return getSum(
    type,
    entries.filter((e) =>
      e.journalAttributeValues?.[attributeKey]?.includes(attributeValueKey),
    ),
  );
}

function getSumUnfiltered(type: IJournalType, entries: IEntry[]) {
  return getSum(type, entries);
}

function getSum(type: IJournalType, entries: IEntry[]) {
  return entries.reduce((total, entry) => total + type.getValue(entry), 0);
}

import { JournalType } from "../../../serverApi/JournalType";
import { IJournalThresholdDefinitions } from "../../../serverApi/IJournalThresholdDefinitions";
import { IEntry } from "../../../serverApi/IEntry";
import { IThresholdValues, ThresholdValue } from "./IThresholdValues";
import { JournalTypeFactory } from "../../../journalTypes/JournalTypeFactory";
import { IJournalType } from "../../../journalTypes/IJournalType";
import { IDateConditions } from "../JournalContext";

export const calculateThresholds = (
  journalType: JournalType,
  thresholds: IJournalThresholdDefinitions,
  entries: IEntry[],
  dateConditions?: IDateConditions,
): IThresholdValues => {
  const thresholdValues: IThresholdValues = {};

  for (const attributeKey of Object.keys(thresholds ?? {})) {
    for (const attributeValueKey of Object.keys(thresholds[attributeKey])) {
      thresholdValues[attributeKey] ??= {};
      thresholdValues[attributeKey][attributeValueKey] = getIThresholdValue(
        thresholds,
        attributeKey,
        attributeValueKey,
        JournalTypeFactory.create(journalType),
        entries,
        dateConditions,
      );
    }
  }

  return thresholdValues;
};

function getIThresholdValue(
  thresholds: IJournalThresholdDefinitions,
  attributeKey: string,
  attributeValueKey: string,
  type: IJournalType,
  entries: IEntry[],
  dateConditions?: IDateConditions,
): ThresholdValue {
  const actualValue =
    attributeKey === "-"
      ? getSum(type, entries)
      : getSum(
          type,
          entries.filter((e) =>
            e.journalAttributeValues?.[attributeKey]?.includes(
              attributeValueKey,
            ),
          ),
        );

  const thresholdDefinition = thresholds[attributeKey][attributeValueKey];

  return new ThresholdValue(
    thresholdDefinition,
    actualValue,
    dateConditions?.from ?? getOldestEntryDate(entries),
    dateConditions?.to ?? getNewestEntryDate(entries),
  );
}

function getSum(type: IJournalType, entries: IEntry[]) {
  return entries.reduce((total, entry) => total + type.getValue(entry), 0);
}

function getOldestEntryDate(entries: IEntry[]) {
  return new Date(entries.map((e) => e.dateTime).sort()[0]);
}

function getNewestEntryDate(entries: IEntry[]) {
  return new Date(entries.map((e) => e.dateTime).sort()[entries.length - 1]);
}

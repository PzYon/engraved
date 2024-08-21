import { JournalType } from "../../../serverApi/JournalType";
import { IJournalThresholds } from "../../../serverApi/IJournalThresholds";
import { IEntry } from "../../../serverApi/IEntry";
import {
  IThresholdValue,
  IThresholdValues,
} from "../../../serverApi/IThresholdValues";
import { JournalTypeFactory } from "../../../journalTypes/JournalTypeFactory";
import { IJournalType } from "../../../journalTypes/IJournalType";

export const calculateThresholds = (
  journalType: JournalType,
  thresholds: IJournalThresholds,
  entries: IEntry[],
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
      );
    }
  }

  return thresholdValues;
};

function getIThresholdValue(
  thresholds: IJournalThresholds,
  attributeKey: string,
  attributeValueKey: string,
  type: IJournalType,
  entries: IEntry[],
): IThresholdValue {
  return {
    thresholdDefinition: thresholds[attributeKey][attributeValueKey],
    actualValue:
      attributeKey === "-"
        ? getSum(type, entries)
        : getSum(
            type,
            entries.filter((e) =>
              e.journalAttributeValues?.[attributeKey]?.includes(
                attributeValueKey,
              ),
            ),
          ),
  };
}

function getSum(type: IJournalType, entries: IEntry[]) {
  return entries.reduce((total, entry) => total + type.getValue(entry), 0);
}

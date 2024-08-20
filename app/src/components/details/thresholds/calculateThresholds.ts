import { JournalType } from "../../../serverApi/JournalType";
import { IJournalThresholds } from "../../../serverApi/IJournalThresholds";
import { IEntry } from "../../../serverApi/IEntry";
import { IThresholdValues } from "../../../serverApi/IThresholdValues";
import { JournalTypeFactory } from "../../../journalTypes/JournalTypeFactory";

export const calculateThresholds = (
  journalType: JournalType,
  thresholds: IJournalThresholds,
  entries: IEntry[],
): IThresholdValues => {
  const thresholdValues: IThresholdValues = {};

  const type = JournalTypeFactory.create(journalType);

  for (const attributeKey of Object.keys(thresholds ?? {})) {
    const attributeValueKeys = Object.keys(thresholds[attributeKey]);

    for (const attributeValueKey of attributeValueKeys) {
      const definition = thresholds[attributeKey][attributeValueKey];

      if (attributeKey === "-") {
        thresholdValues["-"] = {
          "-": {
            thresholdDefinition: definition,
            actualValue: entries.reduce(
              (previousValue, currentValue) =>
                previousValue + type.getValue(currentValue),
              0,
            ),
          },
        };
      } else {
        if (!thresholdValues[attributeKey]) {
          thresholdValues[attributeKey] = {};
        }

        thresholdValues[attributeKey][attributeValueKey] = {
          thresholdDefinition: definition,
          actualValue: entries
            .filter((e) =>
              e.journalAttributeValues?.[attributeKey]?.includes(
                attributeValueKey,
              ),
            )
            .reduce(
              (previousValue, currentValue) =>
                previousValue + type.getValue(currentValue),
              0,
            ),
        };
      }
    }
  }

  return thresholdValues;
};

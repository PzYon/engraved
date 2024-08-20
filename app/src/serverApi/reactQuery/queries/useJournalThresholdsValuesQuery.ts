import { useJournalContext } from "../../../components/details/JournalContext";
import { useQuery } from "@tanstack/react-query";
import { queryKeysFactory } from "../queryKeysFactory";
import { ServerApi } from "../../ServerApi";
import { IThresholdValues } from "../../IThresholdValues";
import { IEntry } from "../../IEntry";
import { IJournalThresholds } from "../../IJournalThresholds";
import { JournalTypeFactory } from "../../../journalTypes/JournalTypeFactory";
import { JournalType } from "../../JournalType";

export const useThresholdValues = (
  journalType: JournalType,
  thresholds: IJournalThresholds,
  entries: IEntry[],
): IThresholdValues => {
  const thresholdValues: IThresholdValues = {};

  const type = JournalTypeFactory.create(journalType);

  for (const attributeKey of Object.keys(thresholds)) {
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
        thresholdValues[attributeKey] = {
          "-": {
            thresholdDefinition: definition,
            actualValue: entries
              .filter((e) =>
                e.journalAttributeValues[attributeKey]?.includes(
                  attributeValueKey,
                ),
              )
              .reduce(
                (previousValue, currentValue) =>
                  previousValue + type.getValue(currentValue),
                0,
              ),
          },
        };
      }
    }
  }

  return thresholdValues;
};

export const useJournalThresholdsValuesQuery = (
  journalId: string,
): IThresholdValues => {
  const { dateConditions } = useJournalContext();

  const { data: thresholdValues } = useQuery({
    queryKey: queryKeysFactory.journalThresholdValues(
      journalId,
      dateConditions,
    ),

    queryFn: () => {
      return dateConditions
        ? ServerApi.getThresholdValues(journalId, dateConditions)
        : Promise.resolve({});
    },
  });

  return thresholdValues;
};

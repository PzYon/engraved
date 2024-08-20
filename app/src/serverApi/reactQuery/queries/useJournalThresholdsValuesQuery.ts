import { useJournalContext } from "../../../components/details/JournalContext";
import { useQuery } from "@tanstack/react-query";
import { queryKeysFactory } from "../queryKeysFactory";
import { ServerApi } from "../../ServerApi";
import { IThresholdValues } from "../../IThresholdValues";
import { IEntry } from "../../IEntry";
import { IJournalThresholds } from "../../IJournalThresholds";
import { JournalType } from "../../JournalType";
import { calculateThresholds } from "../../../components/details/thresholds/calculateThresholds";

export const useThresholdValues = (
  journalType: JournalType,
  thresholds: IJournalThresholds,
  entries: IEntry[],
): IThresholdValues => {
  return calculateThresholds(journalType, thresholds, entries);
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

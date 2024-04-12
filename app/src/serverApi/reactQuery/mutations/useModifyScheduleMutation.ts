import { ServerApi } from "../../ServerApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeysFactory } from "../queryKeysFactory";
import { useAppContext } from "../../../AppContext";
import { IAppAlert } from "../../../components/errorHandling/AppAlertBar";
import { DateFormat, dateTypes } from "../../../components/common/dateTypes";
import { IScheduleDefinition } from "../../IScheduleDefinition";

export const useModifyScheduleMutation = (
  journalId: string,
  entryId: string,
) => {
  const { setAppAlert } = useAppContext();

  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: queryKeysFactory.journal(journalId),

    mutationFn: (variables: IScheduleDefinition) => {
      return entryId
        ? ServerApi.modifyEntrySchedule(
            entryId,
            variables.nextOccurrence,
            variables.onClickUrl,
          )
        : ServerApi.modifyJournalSchedule(
            journalId,
            variables.nextOccurrence,
            variables.onClickUrl,
          );
    },

    onSuccess: async (_, variables) => {
      setAppAlert({
        title: variables.nextOccurrence
          ? `Set schedule to ${dateTypes(variables.nextOccurrence, DateFormat.relativeToNow)}`
          : "Removed schedule",
        type: "success",
      });

      await queryClient.invalidateQueries({
        queryKey: queryKeysFactory.prefixes.journals(),
        exact: false,
      });

      await queryClient.invalidateQueries({
        queryKey: queryKeysFactory.prefixes.entities(),
        exact: false,
      });
    },

    onError: (error: IAppAlert) =>
      setAppAlert({
        title: "Failed to modify schedule",
        message: error.message,
        type: "error",
      }),
  });
};

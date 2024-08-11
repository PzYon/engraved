import { ServerApi } from "../../ServerApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeysFactory } from "../queryKeysFactory";
import { useAppContext } from "../../../AppContext";
import { IAppAlert } from "../../../components/errorHandling/AppAlertBar";
import { DateFormat, formatDate } from "../../../components/common/dateTypes";
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
        ? ServerApi.modifyEntrySchedule(entryId, variables)
        : ServerApi.modifyJournalSchedule(journalId, variables);
    },

    onSuccess: async (_, variables) => {
      setAppAlert({
        title: variables.nextOccurrence
          ? `Set schedule to ${formatDate(variables.nextOccurrence, DateFormat.relativeToNow)}`
          : "Removed schedule",
        type: "success",
      });

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: queryKeysFactory.prefixes.journals(),
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeysFactory.prefixes.entities(),
        }),
      ]);
    },

    onError: (error: IAppAlert) =>
      setAppAlert({
        title: "Failed to modify schedule",
        message: error.message,
        type: "error",
      }),
  });
};

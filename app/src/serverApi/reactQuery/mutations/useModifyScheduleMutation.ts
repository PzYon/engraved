import { ServerApi } from "../../ServerApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeysFactory } from "../queryKeysFactory";
import { useAppContext } from "../../../AppContext";
import { getErrorAlert } from "./getErrorAlert";
import { DateFormat, formatDate } from "../../../components/common/dateTypes";
import { IScheduleDefinition } from "../../IScheduleDefinition";

export const useModifyScheduleMutation = (
  journalId: string | undefined,
  entryId: string | undefined,
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

    onError: (error) =>
      setAppAlert(getErrorAlert("Failed to modify schedule", error)),
  });
};

import { ServerApi } from "../../ServerApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeysFactory } from "../queryKeysFactory";
import { useAppContext } from "../../../AppContext";
import { IAppAlert } from "../../../components/errorHandling/AppAlertBar";
import { DateFormat, dateTypes } from "../../../components/common/dateTypes";

export const useModifyScheduleMutation = (
  journalId: string,
  entryId: string,
) => {
  const { setAppAlert } = useAppContext();

  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: queryKeysFactory.journal(journalId),

    mutationFn: (variables: { date?: Date }) => {
      return entryId
        ? ServerApi.modifyEntrySchedule(entryId, variables.date)
        : ServerApi.modifyJournalSchedule(journalId, variables.date);
    },

    onSuccess: async (_, variables) => {
      setAppAlert({
        title: variables.date
          ? `Set schedule to ${dateTypes(variables.date, DateFormat.relativeToNow)}`
          : "Removed schedule",
        type: "success",
      });

      await queryClient.invalidateQueries({
        queryKey: queryKeysFactory.journal(journalId),
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

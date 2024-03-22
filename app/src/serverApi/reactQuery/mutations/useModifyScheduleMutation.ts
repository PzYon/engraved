import { ServerApi } from "../../ServerApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeysFactory } from "../queryKeysFactory";
import { useAppContext } from "../../../AppContext";
import { IAppAlert } from "../../../components/errorHandling/AppAlertBar";
import { DateFormat, dateTypes } from "../../../components/common/dateTypes";

export interface IScheduleDefinition {
  date?: Date;
  onClickUrl?: string;
}

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
            variables.date,
            variables.onClickUrl,
          )
        : ServerApi.modifyJournalSchedule(
            journalId,
            variables.date,
            variables.onClickUrl,
          );
    },

    onSuccess: async (_, variables) => {
      setAppAlert({
        title: variables.date
          ? `Set schedule to ${dateTypes(variables.date, DateFormat.relativeToNow)}`
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

import { ServerApi } from "../../ServerApi";
import { useMutation } from "@tanstack/react-query";
import { queryKeysFactory } from "../queryKeysFactory";
import { useAppContext } from "../../../AppContext";
import { IAppAlert } from "../../../components/errorHandling/AppAlertBar";
import { DateFormat, formatDate } from "../../../components/common/FormatDate";

export const useModifyScheduleMutation = (journalId: string) => {
  const { setAppAlert } = useAppContext();

  return useMutation({
    mutationKey: queryKeysFactory.journal(journalId),

    mutationFn: (variables: { date?: Date }) =>
      ServerApi.modifyJournalSchedule(journalId, variables.date),

    onSuccess: (_, variables) =>
      setAppAlert({
        title: variables.date
          ? `Set schedule to ${formatDate(variables.date, DateFormat.relativeToNow)}`
          : "Removed schedule",
        type: "success",
      }),

    onError: (error: IAppAlert) =>
      setAppAlert({
        title: "Failed to modify schedule",
        message: error.message,
        type: "error",
      }),
  });
};

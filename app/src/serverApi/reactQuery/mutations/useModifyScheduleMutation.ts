import { ServerApi } from "../../ServerApi";
import { useMutation } from "@tanstack/react-query";
import { queryKeysFactory } from "../queryKeysFactory";
import { useAppContext } from "../../../AppContext";
import { IAppAlert } from "../../../components/errorHandling/AppAlertBar";

export const useModifyScheduleMutation = (journalId: string) => {
  const { setAppAlert } = useAppContext();

  return useMutation({
    mutationKey: queryKeysFactory.journal(journalId),

    mutationFn: (variables: { date?: Date }) =>
      ServerApi.modifyJournalSchedule(journalId, variables.date),

    onSuccess: () =>
      setAppAlert({
        title: `Set schedule`,
        type: "success",
      }),

    onError: (error: IAppAlert) =>
      setAppAlert({
        title: "Failed to modify  schedule",
        message: error.message,
        type: "error",
      }),
  });
};

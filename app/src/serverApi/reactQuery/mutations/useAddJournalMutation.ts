import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeysFactory } from "../queryKeysFactory";
import { ServerApi } from "../../ServerApi";
import { ICommandResult } from "../../ICommandResult";
import { JournalType } from "../../JournalType";
import { useAppContext } from "../../../AppContext";

export const useAddJournalMutation = (
  name: string,
  description: string,
  metricType: JournalType,
  onAdded: (result: ICommandResult) => Promise<void>,
) => {
  const { setAppAlert } = useAppContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: queryKeysFactory.addJournal(),
    mutationFn: () => ServerApi.addJournal(name, description, metricType),
    onSuccess: async (result: ICommandResult) => {
      await onAdded(result);

      await queryClient.invalidateQueries(queryKeysFactory.journals());

      setAppAlert({
        title: `Added journal ${name}`,
        type: "success",
      });
    },
    onError: (error: Error) =>
      setAppAlert({
        title: "Failed to add journal",
        message: error.message,
        type: "error",
      }),
  });
};

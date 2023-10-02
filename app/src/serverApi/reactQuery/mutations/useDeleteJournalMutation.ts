import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeysFactory } from "../queryKeysFactory";
import { ServerApi } from "../../ServerApi";
import { useAppContext } from "../../../AppContext";

export const useDeleteJournalMutation = (journalId: string) => {
  const { setAppAlert } = useAppContext();

  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: queryKeysFactory.deleteMetric(journalId),

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    mutationFn: async (_: { onSuccess: () => Promise<void> }) =>
      await ServerApi.deleteMetric(journalId),

    onSuccess: async (_, variables) => {
      await variables.onSuccess();

      setAppAlert({
        title: `Successfully deleted metric.`,
        type: "success",
      });

      await queryClient.invalidateQueries(queryKeysFactory.journal(journalId));
      await queryClient.invalidateQueries(queryKeysFactory.journals());
    },
  });
};

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeysFactory } from "../queryKeysFactory";
import { ServerApi } from "../../ServerApi";
import { useAppContext } from "../../../AppContext";

export const useDeleteJournalMutation = (
  journalId: string,
  onSuccess: () => void,
) => {
  const { setAppAlert } = useAppContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: queryKeysFactory.deleteJournal(journalId),

    mutationFn: async () => {
      await ServerApi.deleteJournal(journalId);
    },

    onSuccess: async () => {
      setAppAlert({
        title: `Successfully deleted journal.`,
        type: "success",
      });

      onSuccess();

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: queryKeysFactory.journal(journalId),
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeysFactory.journals(),
        }),
      ]);
    },
  });
};

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ServerApi } from "../../ServerApi";
import { useAppContext } from "../../../AppContext";
import { queryKeysFactory } from "../queryKeysFactory";

export const useMoveEntryMutation = (
  entryId: string,
  journalId: string,
  onSaved?: () => void,
) => {
  const { setAppAlert } = useAppContext();

  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: queryKeysFactory.moveEntry(entryId, journalId),

    mutationFn: async (variables: { targetJournalId: string }) => {
      await ServerApi.moveEntry(entryId, variables.targetJournalId);
    },

    onSuccess: async (_, variables) => {
      setAppAlert({
        title: `Successfully moved entry.`,
        type: "success",
      });

      await queryClient.invalidateQueries({
        queryKey: queryKeysFactory.journal(variables.targetJournalId),
      });

      await queryClient.invalidateQueries({
        queryKey: queryKeysFactory.journal(journalId),
      });

      onSaved?.();
    },

    onError: (error) => {
      setAppAlert({
        title: "Failed to upsert entryId",
        message: error.toString(),
        type: "error",
      });
    },

    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: queryKeysFactory.journals(undefined, undefined),
      });
    },
  });
};

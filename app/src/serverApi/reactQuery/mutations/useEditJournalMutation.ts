import { useAppContext } from "../../../AppContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeysFactory } from "../queryKeysFactory";
import { ServerApi } from "../../ServerApi";
import { IJournal } from "../../IJournal";
import { useReloadUser } from "./useReloadUser";
import { getErrorAlert } from "./getErrorAlert";

export const useEditJournalMutation = (journalId: string) => {
  const { setAppAlert } = useAppContext();
  const queryClient = useQueryClient();
  const reloadUser = useReloadUser();

  return useMutation({
    mutationKey: queryKeysFactory.editJournal(journalId),

    throwOnError: false,

    mutationFn: async (variables: {
      journal: IJournal;
      tagIds?: string[];
      onSuccess?: () => void;
    }) => {
      const journal = variables.journal;

      await Promise.all([
        variables.tagIds
          ? ServerApi.updateJournalUserTags(journalId, variables.tagIds)
          : Promise.resolve(),
        ServerApi.editJournal(
          journalId,
          journal.name,
          journal.description,
          journal.notes,
          journal.attributes,
          journal.thresholds,
          journal.customProps,
        ),
      ]);
    },

    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: queryKeysFactory.journal(journalId),
        }),

        // Editing tags changes user-scoped data, so refresh the current user.
        variables.tagIds ? reloadUser() : Promise.resolve(),
      ]);

      variables.onSuccess?.();
    },

    onError: (error) =>
      setAppAlert(getErrorAlert("Failed to edit journal", error)),
  });
};

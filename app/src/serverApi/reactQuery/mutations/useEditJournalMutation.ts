import { useAppContext } from "../../../AppContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeysFactory } from "../queryKeysFactory";
import { ServerApi } from "../../ServerApi";
import { IJournal } from "../../IJournal";

export const useEditJournalMutation = (journalId: string) => {
  const { setAppAlert } = useAppContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: queryKeysFactory.editJournal(journalId),

    mutationFn: async (variables: {
      journal: IJournal;
      onSuccess?: () => void;
    }) => {
      const journal = variables.journal;

      await ServerApi.editJournal(
        journalId,
        journal.name,
        journal.description,
        journal.notes,
        journal.attributes,
        journal.thresholds,
        journal.customProps?.uiSettings,
      );
    },

    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries(queryKeysFactory.journal(journalId));
      variables.onSuccess?.();
    },

    onError: (error) =>
      setAppAlert({
        title: `Failed to edit journal`,
        message: error.toString(),
        type: "error",
      }),
  });
};

import { useAppContext } from "../../../AppContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeysFactory } from "../queryKeysFactory";
import { ServerApi } from "../../ServerApi";
import { IJournal } from "../../IJournal";

export const useEditJournalMutation = (journalId: string) => {
  const { setAppAlert, setUser } = useAppContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: queryKeysFactory.editJournal(journalId),

    throwOnError: false,

    mutationFn: async (variables: {
      journal: IJournal;
      changedTagNames?: string[];
      onSuccess?: () => void;
    }) => {
      const journal = variables.journal;

      await Promise.all([
        variables.changedTagNames
          ? ServerApi.updateJournalUserTags(
              journalId,
              variables.changedTagNames,
            )
          : Promise.resolve(),
        ServerApi.editJournal(
          journalId,
          journal.name,
          journal.description,
          journal.notes,
          journal.attributes,
          journal.thresholds,
          journal.customProps?.uiSettings,
        ),
      ]);
    },

    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: queryKeysFactory.journal(journalId),
        }),

        reloadUser(variables.changedTagNames),
      ]);

      variables.onSuccess?.();
    },

    onError: (error) =>
      setAppAlert({
        title: `Failed to edit journal`,
        message: error.toString(),
        type: "error",
      }),
  });

  async function reloadUser(changedTagNames: string[]) {
    if (!changedTagNames) {
      return;
    }

    await queryClient.invalidateQueries({
      queryKey: queryKeysFactory.modifyUser(),
    });
    const updatedUser = await ServerApi.getCurrentUser();
    setUser(updatedUser);
  }
};

import { useMutation } from "@tanstack/react-query";
import { queryKeysFactory } from "../queryKeysFactory";
import { ServerApi } from "../../ServerApi";

export const useDeleteJournalMutation = (journalId: string) => {
  return useMutation({
    mutationKey: queryKeysFactory.deleteJournal(journalId),

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    mutationFn: async (variables: { onSuccess: () => Promise<void> }) => {
      await ServerApi.deleteJournal(journalId);
      await variables.onSuccess();
    },
  });
};

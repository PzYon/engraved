import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeysFactory } from "../queryKeysFactory";
import { ServerApi } from "../../ServerApi";

export const useDeleteEntryMutation = (journalId: string, entryId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: queryKeysFactory.deleteEntry(journalId, entryId),

    mutationFn: () => ServerApi.deleteEntry(entryId),

    onSuccess: async () =>
      await queryClient.invalidateQueries({
        queryKey: queryKeysFactory.journal(journalId),
      }),
  });
};

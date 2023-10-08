import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeysFactory } from "../queryKeysFactory";
import { ServerApi } from "../../ServerApi";

export const useAddJournalToFavoritesMutation = (journalId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: queryKeysFactory.modifyUser(),

    mutationFn: () => ServerApi.addJournalToFavorites(journalId),

    onSuccess: async () =>
      await queryClient.invalidateQueries(queryKeysFactory.modifyUser()),
  });
};

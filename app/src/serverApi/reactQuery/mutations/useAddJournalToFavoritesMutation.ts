import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeysFactory } from "../queryKeysFactory";
import { ServerApi } from "../../ServerApi";
import { useAppContext } from "../../../AppContext";

export const useAddJournalToFavoritesMutation = (journalId: string) => {
  const queryClient = useQueryClient();

  const { setUser } = useAppContext();

  return useMutation({
    mutationKey: queryKeysFactory.modifyUser(),

    mutationFn: () => ServerApi.addJournalToFavorites(journalId),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: queryKeysFactory.modifyUser(),
      });
      const updatedUser = await ServerApi.getCurrentUser();
      setUser(updatedUser);
    },
  });
};

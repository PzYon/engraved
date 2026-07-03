import { useMutation } from "@tanstack/react-query";
import { queryKeysFactory } from "../queryKeysFactory";
import { ServerApi } from "../../ServerApi";
import { useReloadUser } from "./useReloadUser";

export const useAddJournalToFavoritesMutation = (journalId: string) => {
  const reloadUser = useReloadUser();

  return useMutation({
    mutationKey: queryKeysFactory.modifyUser(),

    mutationFn: () => ServerApi.addJournalToFavorites(journalId),

    onSuccess: () => reloadUser(),
  });
};

import { useMutation } from "@tanstack/react-query";
import { queryKeysFactory } from "../queryKeysFactory";
import { ServerApi } from "../../ServerApi";
import { useReloadUser } from "./useReloadUser";

export const useRemoveJournalFromFavoritesMutation = (journalId: string) => {
  const reloadUser = useReloadUser();

  return useMutation({
    mutationKey: queryKeysFactory.modifyUser(),

    mutationFn: () => ServerApi.removeJournalFromFavorites(journalId),

    onSuccess: () => reloadUser(),
  });
};

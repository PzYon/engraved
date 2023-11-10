import { useMutation } from "@tanstack/react-query";
import { queryKeysFactory } from "../queryKeysFactory";
import { ServerApi } from "../../ServerApi";

export const useDeleteEntryMutation = (journalId: string, entryId: string) => {
  return useMutation({
    mutationKey: queryKeysFactory.deleteEntry(journalId, entryId),

    mutationFn: () => ServerApi.deleteEntry(entryId),
  });
};

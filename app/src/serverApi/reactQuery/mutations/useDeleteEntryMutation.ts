import { onlineManager, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeysFactory } from "../queryKeysFactory";
import { ICommandResult } from "../../ICommandResult";
import {
  IDeleteEntryVariables,
  removeEntryFromCache,
} from "./entryMutationDefaults";

export const useDeleteEntryMutation = (journalId: string, entryId: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ICommandResult, Error, IDeleteEntryVariables>({
    mutationKey: queryKeysFactory.deleteEntry(journalId, entryId),

    // no mutationFn here: it comes from the mutation defaults (entryMutationDefaults), so that
    // mutations resumed from the persisted offline outbox after a reload run the same code

    onMutate: (variables) => {
      removeEntryFromCache(queryClient, variables.journalId, variables.entryId);
    },

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: queryKeysFactory.journal(journalId),
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeysFactory.prefixes.entities(),
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeysFactory.entries(),
        }),
      ]);
    },
  });

  return {
    ...mutation,
    mutate: () =>
      mutation.mutate({
        journalId,
        entryId,
        queuedOffline: !onlineManager.isOnline(),
      }),
    mutateAsync: () =>
      mutation.mutateAsync({
        journalId,
        entryId,
        queuedOffline: !onlineManager.isOnline(),
      }),
  };
};

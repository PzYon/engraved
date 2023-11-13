import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeysFactory } from "../queryKeysFactory";
import { IUpsertEntryCommand } from "../../commands/IUpsertEntryCommand";
import { ServerApi } from "../../ServerApi";
import { useAppContext } from "../../../AppContext";
import { IEntry } from "../../IEntry";
import { JournalType } from "../../JournalType";
import { ICommandResult } from "../../ICommandResult";

export interface IVariables {
  command: IUpsertEntryCommand;
}

export const useUpsertEntryMutation = (
  journalId: string,
  journalType: JournalType,
  entryId?: string,
  onSaved?: () => void,
) => {
  const { setAppAlert } = useAppContext();

  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: queryKeysFactory.updateEntries(journalId, entryId),

    throwOnError: false,

    mutationFn: async (variables: IVariables) => {
      return await ServerApi.upsertEntry(
        variables.command,
        journalType.toLowerCase(),
      );
    },

    onSuccess: async (result: ICommandResult, variables: IVariables) => {
      setAppAlert({
        title: `${entryId ? "Updated" : "Added"} entry`,
        type: "success",
        relatedEntityId: result.entityId,
      });

      onSaved?.();

      if (entryId) {
        updateExistingEntryInCache(variables.command);
      }

      await queryClient.invalidateQueries({
        queryKey: queryKeysFactory.journal(journalId),
      });
      await queryClient.invalidateQueries({
        queryKey: queryKeysFactory.journals(),
      });
      await queryClient.invalidateQueries({
        queryKey: queryKeysFactory.entries(),
      });
    },

    onError: (error: unknown) => {
      setAppAlert({
        title: "Failed to upsert entryId",
        message: error.toString(),
        type: "error",
      });
    },
  });

  function updateExistingEntryInCache(command: IUpsertEntryCommand) {
    queryClient.setQueryData(
      queryKeysFactory.journalEntries(journalId),
      (entries: IEntry[]) => {
        if (!entries) {
          return entries;
        }

        return entries.map((e) =>
          e.id === entryId ? createCacheEntry(e, command) : e,
        );
      },
    );
  }

  function createCacheEntry(entry: IEntry, command: IUpsertEntryCommand) {
    const editedOn = new Date().toString();
    return {
      ...entry,
      ...command,
      dateTime: editedOn,
      editedOn: editedOn,
    };
  }
};

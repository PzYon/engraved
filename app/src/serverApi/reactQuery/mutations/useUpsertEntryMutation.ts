import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeysFactory } from "../queryKeysFactory";
import { IUpsertEntryCommand } from "../../commands/IUpsertEntryCommand";
import { ServerApi } from "../../ServerApi";
import { useAppContext } from "../../../AppContext";
import { IEntry } from "../../IEntry";
import { JournalType } from "../../JournalType";

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
    mutationKey: queryKeysFactory.updateMeasurement(journalId, entryId),

    mutationFn: async (variables: IVariables) => {
      await ServerApi.upsertEntry(variables.command, journalType.toLowerCase());
    },

    onSuccess: async (_: unknown, variables: IVariables) => {
      setAppAlert({
        title: `${entryId ? "Updated" : "Added"} measurement`,
        type: "success",
      });

      onSaved?.();

      if (entryId) {
        updateExistingEntryInCache(variables.command);
      }

      await queryClient.invalidateQueries(queryKeysFactory.journal(journalId));
      await queryClient.invalidateQueries(queryKeysFactory.journals());
      await queryClient.invalidateQueries(queryKeysFactory.activities());
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
      queryKeysFactory.entries(journalId),
      (measurements: IEntry[]) => {
        if (!measurements) {
          return measurements;
        }

        return measurements.map((m) =>
          m.id === entryId ? createCacheEntry(m, command) : m,
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

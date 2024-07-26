import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeysFactory } from "../queryKeysFactory";
import { IUpsertEntryCommand } from "../../commands/IUpsertEntryCommand";
import { ServerApi } from "../../ServerApi";
import { useAppContext } from "../../../AppContext";
import { IEntry } from "../../IEntry";
import { ICommandResult } from "../../ICommandResult";
import { IJournalAttributeValues } from "../../IJournalAttributeValues";
import { useEditJournalMutation } from "./useEditJournalMutation";
import { JournalType } from "../../JournalType";
import { IJournal } from "../../IJournal";
import { Link, useLocation } from "react-router-dom";
import { styled } from "@mui/material";
import { knownQueryParams } from "../../../components/common/actions/searchParamHooks";

interface IUpsertEntryCommandVariables {
  command: IUpsertEntryCommand;
}

export const useUpsertEntryMutation = (
  journalId: string,
  journalType: JournalType,
  journal?: IJournal,
  entryId?: string,
  onSaved?: () => void,
) => {
  const { setAppAlert } = useAppContext();

  const queryClient = useQueryClient();

  const { pathname } = useLocation();

  const editJournalMutation = useEditJournalMutation(journalId);

  return useMutation({
    mutationKey: queryKeysFactory.updateEntries(journalId, entryId),

    throwOnError: false,

    mutationFn: async (variables: IUpsertEntryCommandVariables) => {
      if (
        journal &&
        hasNewJournalAttributeValues(variables.command.journalAttributeValues)
      ) {
        await editJournalMutation.mutateAsync({ journal });
      }

      return await ServerApi.upsertEntry(
        variables.command,
        journalType.toLowerCase(),
      );
    },

    onSuccess: async (
      result: ICommandResult,
      variables: IUpsertEntryCommandVariables,
    ) => {
      const journalUrl = `/journals/details/${variables.command.journalId}/`;
      const actionUrl = `${journalUrl}?${knownQueryParams.selectedItemIdParam}=${result.entityId}`;

      setAppAlert({
        title: `${entryId ? "Updated" : "Added"} entry`,
        message: !pathname.startsWith(journalUrl) ? (
          <>
            <StyledLink to={actionUrl}>View</StyledLink> in journal
          </>
        ) : null,
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
      await queryClient.invalidateQueries({
        queryKey: queryKeysFactory.entities("", true),
      });
    },

    onError: (error: unknown) => {
      setAppAlert({
        title: "Failed to upsert entry",
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

  function hasNewJournalAttributeValues(
    attributeValues: IJournalAttributeValues,
  ) {
    if (!attributeValues || journal.type === JournalType.Scraps) {
      return false;
    }

    let hasNewValues = false;

    for (const keyInValues in attributeValues) {
      for (const value of attributeValues[keyInValues]) {
        if (!journal.attributes[keyInValues].values[value]) {
          journal.attributes[keyInValues].values[value] = value;
          hasNewValues = true;
        }
      }
    }

    return hasNewValues;
  }
};

const StyledLink = styled(Link)`
  color: ${(p) => p.theme.palette.common.white} !important;
  text-decoration: underline;
`;

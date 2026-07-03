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
import { useMatchRoute } from "@tanstack/react-router";
import { knownQueryParams } from "../../../components/common/actions/searchParamHooks";
import { StyledLink } from "./StyledLink";
import { getErrorAlert } from "./getErrorAlert";

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

  const matchRoute = useMatchRoute();

  const editJournalMutation = useEditJournalMutation(journalId);

  return useMutation({
    mutationKey: queryKeysFactory.updateEntries(journalId, entryId ?? ""),

    throwOnError: false,

    mutationFn: async (variables: IUpsertEntryCommandVariables) => {
      if (
        journal &&
        hasNewJournalAttributeValues(
          variables.command.journalAttributeValues ?? {},
        )
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
      const journalId = variables.command.journalId;

      // Only offer a "View in journal" link when we're not already on that
      // journal's details page (or one of its sub-routes).
      const isOnJournalPage = matchRoute({
        to: "/journals/details/$journalId",
        params: { journalId },
        fuzzy: true,
      });

      setAppAlert({
        title: `${entryId ? "Updated" : "Added"} entry`,
        message: !isOnJournalPage ? (
          <>
            <StyledLink
              to="/journals/details/$journalId"
              params={{ journalId }}
              search={{ [knownQueryParams.selectedItemId]: result.entityId }}
            >
              View
            </StyledLink>{" "}
            in journal
          </>
        ) : null,
        type: "success",
        relatedEntityId: result.entityId,
      });

      onSaved?.();

      if (entryId) {
        updateExistingEntryInCache(variables.command);
      }

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: queryKeysFactory.prefixes.journals(),
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeysFactory.prefixes.entities(),
        }),
      ]);
    },

    onError: (error) => {
      setAppAlert(getErrorAlert("Failed to upsert entry", error));
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
    if (!attributeValues || !journal || journal.type === JournalType.Scraps) {
      return false;
    }

    let hasNewValues = false;

    for (const keyInValues in attributeValues) {
      for (const value of attributeValues[keyInValues]) {
        if (!journal.attributes?.[keyInValues]?.values[value]) {
          if (journal.attributes?.[keyInValues])
            journal.attributes[keyInValues].values[value] = value;
          hasNewValues = true;
        }
      }
    }

    return hasNewValues;
  }
};

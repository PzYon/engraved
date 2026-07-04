import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeysFactory } from "../queryKeysFactory";
import { IUpsertEntryCommand } from "../../commands/IUpsertEntryCommand";
import { ServerApi } from "../../ServerApi";
import { useAppContext } from "../../../AppContext";
import { IEntry } from "../../IEntry";
import { ICommandResult } from "../../ICommandResult";
import { IJournalAttributeValues } from "../../IJournalAttributeValues";
import { IJournalAttributes } from "../../IJournalAttributes";
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
      const journalWithNewValues = journal
        ? getJournalWithNewAttributeValues(
            journal,
            variables.command.journalAttributeValues ?? {},
          )
        : null;

      if (journalWithNewValues) {
        await editJournalMutation.mutateAsync({
          journal: journalWithNewValues,
        });
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

  function createCacheEntry(
    entry: IEntry,
    command: IUpsertEntryCommand,
  ): IEntry {
    return {
      ...entry,
      ...command,
      // command.dateTime is a Date (or absent); IEntry.dateTime is an ISO
      // string. Keep the date the user actually set instead of overwriting it
      // with "now", and serialize as ISO to match what the server returns.
      dateTime: command.dateTime
        ? new Date(command.dateTime).toISOString()
        : entry.dateTime,
      editedOn: new Date().toISOString(),
    };
  }
};

// Returns a copy of the journal with any attribute values that are present on
// the entry but missing from the journal definition added to it, or null when
// there is nothing new. Pure: the (query-cached) journal passed in is never
// mutated in place.
function getJournalWithNewAttributeValues(
  journal: IJournal,
  attributeValues: IJournalAttributeValues,
): IJournal | null {
  if (journal.type === JournalType.Scraps) {
    return null;
  }

  const attributes = cloneAttributes(journal.attributes);

  let hasNewValues = false;

  for (const keyInValues in attributeValues) {
    for (const value of attributeValues[keyInValues]) {
      if (!attributes?.[keyInValues]?.values[value]) {
        if (attributes?.[keyInValues]) {
          attributes[keyInValues].values[value] = value;
        }
        hasNewValues = true;
      }
    }
  }

  return hasNewValues ? { ...journal, attributes } : null;
}

function cloneAttributes(
  attributes: IJournalAttributes | undefined,
): IJournalAttributes | undefined {
  if (!attributes) {
    return attributes;
  }

  const clone: IJournalAttributes = {};
  for (const key of Object.keys(attributes)) {
    clone[key] = {
      ...attributes[key],
      values: { ...attributes[key].values },
    };
  }
  return clone;
}

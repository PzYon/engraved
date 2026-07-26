import { onlineManager, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeysFactory } from "../queryKeysFactory";
import { IUpsertEntryCommand } from "../../commands/IUpsertEntryCommand";
import { useAppContext } from "../../../AppContext";
import { ICommandResult } from "../../ICommandResult";
import { IJournalAttributeValues } from "../../IJournalAttributeValues";
import { IJournalAttributes } from "../../IJournalAttributes";
import { JournalType } from "../../JournalType";
import { IJournal } from "../../IJournal";
import { useMatchRoute } from "@tanstack/react-router";
import { knownQueryParams } from "../../../components/common/actions/searchParamHooks";
import { StyledLink } from "./StyledLink";
import { getErrorAlert } from "./getErrorAlert";
import {
  applyEntryUpsertToCache,
  invalidateAfterEntryWrite,
  IUpsertEntryVariables,
} from "./entryMutationDefaults";
import { generateClientId } from "../../../util/clientId";

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

  const mutation = useMutation<ICommandResult, Error, IUpsertEntryVariables>({
    mutationKey: queryKeysFactory.updateEntries(journalId, entryId ?? ""),

    throwOnError: false,

    // no mutationFn here: it comes from the mutation defaults (entryMutationDefaults), so that
    // mutations resumed from the persisted offline outbox after a reload run the same code

    onMutate: (variables) => {
      applyEntryUpsertToCache(queryClient, variables.command);

      if (variables.queuedOffline) {
        // the mutation is paused until the app is back online; give the queue-time feedback the
        // success handler would otherwise give
        setAppAlert({
          title: "Saved offline - will be synced when reconnected",
          type: "info",
          relatedEntityId: variables.command.id,
        });

        onSaved?.();
      }
    },

    onSuccess: async (
      result: ICommandResult,
      variables: IUpsertEntryVariables,
    ) => {
      const journalId = variables.command.journalId;

      if (result.discarded) {
        // the entry was deleted (e.g. on another device) while this change sat in the offline
        // outbox; the server ignored the change instead of resurrecting the entry
        setAppAlert({
          title: "Entry does not exist anymore - change was discarded",
          type: "info",
          relatedEntityId: result.entityId,
        });
      } else if (!variables.queuedOffline) {
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
      }

      await invalidateAfterEntryWrite(queryClient);
    },

    onError: (error) => {
      setAppAlert(getErrorAlert("Failed to upsert entry", error));
    },
  });

  return {
    ...mutation,
    mutate: (variables: { command: IUpsertEntryCommand }) =>
      mutation.mutate(prepareVariables(variables.command)),
    mutateAsync: (variables: { command: IUpsertEntryCommand }) =>
      mutation.mutateAsync(prepareVariables(variables.command)),
  };

  // Everything a replayed mutation needs must be captured here, in serializable variables - see
  // entryMutationDefaults. This is also where entries get their client-generated id, so that an
  // entry created offline has its definitive identity before ever reaching the server.
  function prepareVariables(
    command: IUpsertEntryCommand,
  ): IUpsertEntryVariables {
    const preparedCommand: IUpsertEntryCommand = command.id
      ? command
      : { ...command, id: generateClientId(), isNew: true };

    return {
      command: preparedCommand,
      journalType,
      updatedJournal: journal
        ? (getJournalWithNewAttributeValues(
            journal,
            preparedCommand.journalAttributeValues ?? {},
          ) ?? undefined)
        : undefined,
      queuedOffline: !onlineManager.isOnline(),
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

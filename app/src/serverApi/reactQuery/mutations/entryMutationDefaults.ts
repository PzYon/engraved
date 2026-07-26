import { QueryClient } from "@tanstack/react-query";
import { ServerApi } from "../../ServerApi";
import { IUpsertEntryCommand } from "../../commands/IUpsertEntryCommand";
import { IJournal } from "../../IJournal";
import { JournalType } from "../../JournalType";
import { IEntry } from "../../IEntry";
import { queryKeysFactory } from "../queryKeysFactory";

// Phase 1 (local-first): entry writes are offline-capable. A mutation issued while offline is
// paused by react-query, persisted to IndexedDB along with the query cache (the "outbox") and
// replayed on reconnect or after the next app start. For that to work, everything a mutation
// needs to run must live in its *variables* (serializable, captured at mutate() time) and its
// mutationFn must be registered here as a mutation *default* - a function defined in a hook
// closure would be lost on reload.

export interface IUpsertEntryVariables {
  command: IUpsertEntryCommand;
  journalType: JournalType;
  // journal with attribute values added by this entry (precomputed at mutate() time so the
  // replay does not depend on component state); saved before the entry itself
  updatedJournal?: IJournal;
  // true when the mutation was queued while offline; the queue-time feedback (alert, dialog
  // close) has already happened in that case, so the success handler skips it
  queuedOffline?: boolean;
}

export interface IDeleteEntryVariables {
  journalId: string;
  entryId: string;
  queuedOffline?: boolean;
}

export function registerEntryMutationDefaults(queryClient: QueryClient) {
  queryClient.setMutationDefaults(
    queryKeysFactory.prefixes.upsertEntryMutations(),
    {
      mutationFn: async (variables: IUpsertEntryVariables) => {
        const journal = variables.updatedJournal;
        if (journal) {
          await ServerApi.editJournal(
            journal.id ?? "",
            journal.name,
            journal.description,
            journal.notes,
            journal.attributes,
            journal.thresholds,
            journal.customProps,
          );
        }

        return await ServerApi.upsertEntry(
          variables.command,
          variables.journalType.toLowerCase(),
        );
      },

      // applies to mutations resumed from the persisted outbox after a reload; live mutations
      // use the (overriding) handlers from useUpsertEntryMutation instead
      onSuccess: () => invalidateAfterEntryWrite(queryClient),
    },
  );

  queryClient.setMutationDefaults(
    queryKeysFactory.prefixes.deleteEntryMutations(),
    {
      mutationFn: (variables: IDeleteEntryVariables) =>
        ServerApi.deleteEntry(variables.entryId),

      onSuccess: () => invalidateAfterEntryWrite(queryClient),
    },
  );
}

export async function invalidateAfterEntryWrite(queryClient: QueryClient) {
  await Promise.all([
    queryClient.invalidateQueries({
      queryKey: queryKeysFactory.prefixes.journals(),
    }),
    queryClient.invalidateQueries({
      queryKey: queryKeysFactory.prefixes.entities(),
    }),
  ]);
}

// Applies an upsert command to every cached entry list of its journal, so the write is visible
// immediately - also (and especially) while offline, when the confirming refetch cannot happen.
export function applyEntryUpsertToCache(
  queryClient: QueryClient,
  command: IUpsertEntryCommand,
) {
  queryClient.setQueriesData<IEntry[]>(
    { queryKey: queryKeysFactory.prefixes.journalEntries(command.journalId) },
    (entries) => {
      if (!entries) {
        return entries;
      }

      const optimisticEntry = createOptimisticEntry(command);

      const patched = entries.some((e) => e.id === command.id)
        ? entries.map((e) =>
            e.id === command.id ? { ...e, ...optimisticEntry } : e,
          )
        : [optimisticEntry, ...entries];

      // entry lists are served sorted by dateTime descending - keep that invariant
      return patched.sort(
        (a, b) =>
          new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime(),
      );
    },
  );
}

export function removeEntryFromCache(
  queryClient: QueryClient,
  journalId: string,
  entryId: string,
) {
  queryClient.setQueriesData<IEntry[]>(
    { queryKey: queryKeysFactory.prefixes.journalEntries(journalId) },
    (entries) => entries?.filter((e) => e.id !== entryId),
  );
}

function createOptimisticEntry(command: IUpsertEntryCommand): IEntry {
  const nowIso = new Date().toISOString();

  // the type-specific command shapes (value, startDate/endDate, title, scrapType) match the
  // corresponding entry shapes, so the command fields can be carried over as-is - except for
  // dates, which are Date objects on commands but ISO strings on entries
  const carriedOver: Record<string, unknown> = { ...command };
  delete carriedOver.isNew;
  delete carriedOver.journalId;
  delete carriedOver.schedule;

  for (const key of ["startDate", "endDate"]) {
    if (carriedOver[key] instanceof Date) {
      carriedOver[key] = (carriedOver[key] as Date).toISOString();
    }
  }

  return {
    ...carriedOver,
    id: command.id,
    parentId: command.journalId,
    dateTime: command.dateTime
      ? new Date(command.dateTime).toISOString()
      : nowIso,
    editedOn: nowIso,
  } as IEntry;
}

import { QueryClient } from "@tanstack/react-query";
import { registerEntryMutationDefaults } from "./mutations/entryMutationDefaults";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { del, get, set } from "idb-keyval";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import React from "react";
import { envSettings } from "../../env/envSettings";
import { useAppContext } from "../../AppContext";

// Keep cached data around long enough to be persisted and restored across
// reloads (queries are garbage-collected after gcTime, and only live queries
// get persisted). One day matches the persister maxAge below.
const oneDay = 1000 * 60 * 60 * 24;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      refetchOnReconnect: false,
      throwOnError: true,
      staleTime: 0,
      gcTime: oneDay,
      placeholderData: (d: unknown) => d,
    },
    mutations: {
      throwOnError: true,
      // Phase 1 (local-first): a mutation fired while offline is paused (networkMode "online" is
      // the default, made explicit here) and must survive both the wait for reconnection and a
      // reload in between - so keep it around as long as the persisted cache itself.
      networkMode: "online",
      gcTime: oneDay,
    },
  },
});

// entry writes are offline-capable: their mutationFns are registered as mutation defaults so
// that mutations restored from the persisted outbox after a reload can still run
registerEntryMutationDefaults(queryClient);

// Phase 0/1 (local-first): persist the React Query cache to IndexedDB so the app
// shows the last-seen data on reload and while offline. Since Phase 1 this also
// persists paused mutations - the offline write outbox - which are replayed via
// resumePausedMutations once the cache is restored (see onSuccess below).
const persister = createAsyncStoragePersister({
  key: "engraved-query-cache",
  storage: {
    getItem: async (key) => (await get<string>(key)) ?? null,
    setItem: (key, value) => set(key, value),
    removeItem: (key) => del(key),
  },
});

export const ReactQueryProviderWrapper: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  // Always rendered inside AppContextProvider, so the authenticated user is
  // available here.
  const { user } = useAppContext();

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister,
        maxAge: oneDay,
        // Scope the persisted cache to (app version + user). When either
        // changes, PersistQueryClientProvider discards the stored cache
        // (removeClient) before restoring - so one user never sees another
        // user's data restored from IndexedDB, and old-schema caches are still
        // dropped on deploy.
        buster: `${envSettings.version ?? "dev"}:${user?.id ?? "anon"}`,
      }}
      onSuccess={() => {
        // the persisted cache (including the offline outbox) has been restored: replay whatever
        // is still pending, then refetch so the UI converges on the server's state. While still
        // offline this is safe: the replay stays paused and the refetches are skipped.
        queryClient
          .resumePausedMutations()
          .then(() => queryClient.invalidateQueries());
      }}
    >
      {children}
      <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
    </PersistQueryClientProvider>
  );
};

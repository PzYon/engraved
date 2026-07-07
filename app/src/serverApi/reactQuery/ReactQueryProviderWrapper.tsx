import { QueryClient } from "@tanstack/react-query";
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
    },
  },
});

// Phase 0 (local-first): persist the React Query cache to IndexedDB so the app
// shows the last-seen data on reload and while offline. This is read-only
// caching - offline writes / sync come in later phases.
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
    >
      {children}
      <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
    </PersistQueryClientProvider>
  );
};

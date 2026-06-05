import { useCallback } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";

export const knownQueryParams = {
  selectedItemId: "selected-item",
  actionKey: "action-key",
  favoritesOnly: "favorites-only",
  query: "q",
  testUser: "test-user",
  testJournalName: "test-journal-name",
  testJournalType: "test-journal-type",
};

type ActionKey =
  | "permissions"
  | "delete"
  | "schedule"
  | "add-entry"
  | "move"
  | "edit";

export function getItemActionQueryParams(
  actionKey: ActionKey,
  actionItemId: string | undefined,
): Record<string, string> {
  return {
    [knownQueryParams.actionKey]: actionKey,
    [knownQueryParams.selectedItemId]: actionItemId ?? "",
  };
}

export function clearAllSearchParams() {
  return Object.keys(knownQueryParams).reduce(
    (aggregated: Record<string, string | undefined>, objectKey: string) => {
      const queryStringKey = (knownQueryParams as Record<string, string>)[
        objectKey
      ];
      aggregated[queryStringKey] = undefined;
      return aggregated;
    },
    {},
  );
}

// Under the root route's `validateSearch`, the entire search bag is a flat
// string map. This is the shape the router hands us via `useSearch` and expects
// back from a `search` updater.
type SearchBag = Record<string, string>;

// Merge `updates` into `current`, dropping keys whose value is empty/false so
// they disappear from the URL rather than lingering as `key=` or `key=false`.
function mergeSearch(
  current: SearchBag,
  updates: Record<string, string | undefined>,
): SearchBag {
  const next: SearchBag = { ...current };

  for (const key in updates) {
    const value = updates[key];
    if (value === undefined || value === "" || value === "false") {
      delete next[key];
    } else {
      next[key] = value;
    }
  }

  return next;
}

function searchEquals(a: SearchBag, b: SearchBag): boolean {
  const aKeys = Object.keys(a);
  return (
    aKeys.length === Object.keys(b).length &&
    aKeys.every((key) => a[key] === b[key])
  );
}

function useCurrentSearch(): SearchBag {
  return useSearch({ strict: false }) as SearchBag;
}

export const useItemAction = () => {
  const navigate = useNavigate();
  const search = useCurrentSearch();

  return {
    getParams: () => {
      return getItemActionQueryParams(
        search[knownQueryParams.actionKey] as ActionKey,
        search[knownQueryParams.selectedItemId] ?? "",
      );
    },

    closeAction: () => {
      const hasChanges =
        !!search[knownQueryParams.actionKey] ||
        !!search[knownQueryParams.selectedItemId] ||
        !!search[knownQueryParams.testUser];

      if (!hasChanges) {
        return;
      }

      navigate({
        to: ".",
        search: (prev) =>
          mergeSearch(prev as SearchBag, {
            [knownQueryParams.actionKey]: undefined,
            [knownQueryParams.selectedItemId]: undefined,
            [knownQueryParams.testUser]: undefined,
          }),
      });
    },
  };
};

export const useEngravedSearchParams = () => {
  const navigate = useNavigate();
  const search = useCurrentSearch();

  const getSearchParam = useCallback(
    (key: string) => search[key] ?? null,
    [search],
  );

  const getNewSearchParams = useCallback(
    (params: Record<string, string | undefined>): SearchBag =>
      mergeSearch(search, params),
    [search],
  );

  const appendSearchParams = useCallback(
    (params: Record<string, string>) => {
      const next = mergeSearch(search, params);
      if (!searchEquals(search, next)) {
        navigate({ to: ".", search: () => next, replace: true });
      }
    },
    [search, navigate],
  );

  return {
    getSearchParam,
    getNewSearchParams,
    appendSearchParams,
  };
};

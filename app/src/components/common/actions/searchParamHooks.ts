import { useCallback } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";

export const knownQueryParams = {
  selectedItemId: "selected-item",
  actionKey: "action-key",
  favoritesOnly: "favorites-only",
  query: "q",
  testUser: "test-user",
} as const;

const actionKeys = [
  "permissions",
  "delete",
  "schedule",
  "add-entry",
  "move",
  "edit",
] as const;

export type ActionKey = (typeof actionKeys)[number];

// The app's URL search schema. Most params are plain strings, so an index
// signature lets the generic helpers below read/write arbitrary keys (e.g. the
// PWA share-target's title/text/link, or journalTypes) without ceremony. The
// keys we reason about explicitly are typed on top of it: `action-key` is the
// only one that's more than a string today.
export interface AppSearch {
  [key: string]: string | undefined;
  "action-key"?: ActionKey;
}

// Root-route `validateSearch`. Keeps every incoming key (coerced to a string)
// so no param is silently dropped, but narrows `action-key` to the known union
// so the type isn't a lie — an unrecognized value is discarded.
export function validateAppSearch(input: Record<string, unknown>): AppSearch {
  const result: AppSearch = {};

  for (const [key, value] of Object.entries(input)) {
    if (value === undefined || value === null) {
      continue;
    }
    result[key] = String(value);
  }

  if (result["action-key"] && !actionKeys.includes(result["action-key"])) {
    delete result["action-key"];
  }

  return result;
}

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
  return Object.values(knownQueryParams).reduce(
    (aggregated: Record<string, string | undefined>, queryStringKey) => {
      aggregated[queryStringKey] = undefined;
      return aggregated;
    },
    {},
  );
}

// Merge `updates` into `current`, dropping keys whose value is empty/false so
// they disappear from the URL rather than lingering as `key=` or `key=false`.
function mergeSearch(
  current: AppSearch,
  updates: Record<string, string | undefined>,
): AppSearch {
  const next: AppSearch = { ...current };

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

function searchEquals(a: AppSearch, b: AppSearch): boolean {
  const aKeys = Object.keys(a);
  return (
    aKeys.length === Object.keys(b).length &&
    aKeys.every((key) => a[key] === b[key])
  );
}

function useCurrentSearch(): AppSearch {
  return useSearch({ strict: false }) as AppSearch;
}

export const useItemAction = () => {
  const navigate = useNavigate();
  const search = useCurrentSearch();

  return {
    getParams: () => ({
      [knownQueryParams.actionKey]: search[knownQueryParams.actionKey],
      [knownQueryParams.selectedItemId]:
        search[knownQueryParams.selectedItemId],
    }),

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
        resetScroll: false,
        search: (prev) =>
          mergeSearch(prev, {
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
    (params: Record<string, string | undefined>): AppSearch =>
      mergeSearch(search, params),
    [search],
  );

  const appendSearchParams = useCallback(
    (params: Record<string, string>) => {
      const next = mergeSearch(search, params);
      if (!searchEquals(search, next)) {
        navigate({
          to: ".",
          search: () => next,
          replace: true,
          resetScroll: false,
        });
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

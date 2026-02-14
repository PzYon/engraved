import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";

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
  actionItemId: string,
) {
  return {
    [knownQueryParams.actionKey]: actionKey,
    [knownQueryParams.selectedItemId]: actionItemId,
  };
}

export function clearAllSearchParams() {
  return Object.keys(knownQueryParams).reduce(
    (aggregated: Record<string, string>, objectKey: string) => {
      const queryStringKey = (knownQueryParams as Record<string, string>)[
        objectKey
      ];

      aggregated[queryStringKey] = undefined;

      return aggregated;
    },
    {},
  );
}

export const useItemAction = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  return {
    getParams: () => {
      return getItemActionQueryParams(
        searchParams.get(knownQueryParams.actionKey) as ActionKey,
        searchParams.get(knownQueryParams.selectedItemId),
      );
    },

    closeAction: () => {
      let hasChanges = false;

      if (deleteIfSet(knownQueryParams.actionKey)) {
        hasChanges = true;
      }

      if (deleteIfSet(knownQueryParams.selectedItemId)) {
        hasChanges = true;
      }

      if (deleteIfSet(knownQueryParams.testUser)) {
        hasChanges = true;
      }

      if (hasChanges) {
        setSearchParams(searchParams);
      }
    },
  };

  function deleteIfSet(key: string) {
    if (searchParams.get(key)) {
      searchParams.delete(key);
      return true;
    }

    return false;
  }
};

export const useEngravedSearchParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const getSearchParam = useCallback(
    (key: string) => searchParams.get(key),
    [searchParams],
  );

  const cloneSearchParams = useCallback(() => {
    const newestSearchParams: Record<string, string> = {};
    searchParams.forEach((v, k) => {
      newestSearchParams[k] = v;
    });
    return new URLSearchParams({ ...newestSearchParams });
  }, [searchParams]);

  const getNewSearchParams = useCallback(
    (params: Record<string, string>) => {
      const newSearchParams = cloneSearchParams();

      for (const key in params) {
        const value = params[key];

        if (
          value === null ||
          value === undefined ||
          value === "" ||
          value === "false"
        ) {
          newSearchParams.delete(key);
        } else {
          newSearchParams.set(key, value);
        }
      }

      return newSearchParams;
    },
    [cloneSearchParams],
  );

  const appendSearchParams = useCallback(
    (params: Record<string, string>) => {
      const updatedSearchParams = getNewSearchParams(params);

      if (updatedSearchParams.toString() !== searchParams.toString()) {
        setSearchParams(updatedSearchParams);
      }
    },
    [searchParams, setSearchParams, getNewSearchParams],
  );

  return {
    getSearchParam,
    getNewSearchParams,
    appendSearchParams,
  };
};

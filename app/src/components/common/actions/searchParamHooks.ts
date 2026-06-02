import { useCallback } from "react";
import { useLocation, useNavigate } from "@tanstack/react-router";

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

function useSearchString(): string {
  return useLocation({ select: (l) => l.searchStr });
}

export const useItemAction = () => {
  const navigate = useNavigate();
  const searchString = useSearchString();
  const searchParams = new URLSearchParams(searchString);

  return {
    getParams: () => {
      return getItemActionQueryParams(
        searchParams.get(knownQueryParams.actionKey) as ActionKey,
        searchParams.get(knownQueryParams.selectedItemId) ?? "",
      );
    },

    closeAction: () => {
      let hasChanges = false;
      const newParams = new URLSearchParams(searchString);

      if (newParams.get(knownQueryParams.actionKey)) {
        newParams.delete(knownQueryParams.actionKey);
        hasChanges = true;
      }

      if (newParams.get(knownQueryParams.selectedItemId)) {
        newParams.delete(knownQueryParams.selectedItemId);
        hasChanges = true;
      }

      if (newParams.get(knownQueryParams.testUser)) {
        newParams.delete(knownQueryParams.testUser);
        hasChanges = true;
      }

      if (hasChanges) {
        void navigate({ to: ".", search: () => Object.fromEntries(newParams) });
      }
    },
  };
};

export const useEngravedSearchParams = () => {
  const navigate = useNavigate();
  const searchString = useSearchString();
  const searchParams = new URLSearchParams(searchString);

  const getSearchParam = useCallback(
    (key: string) => searchParams.get(key),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchString],
  );

  const cloneSearchParams = useCallback(
    (): URLSearchParams => new URLSearchParams(searchString),
    [searchString],
  );

  const getNewSearchParams = useCallback(
    (params: Record<string, string | undefined>): URLSearchParams => {
      const newSearchParams = cloneSearchParams();
      for (const key in params) {
        const value = params[key];
        if (value === undefined || value === "" || value === "false") {
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
        void navigate({
          to: ".",
          search: () => Object.fromEntries(updatedSearchParams),
          replace: true,
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchString, navigate, getNewSearchParams],
  );

  return {
    getSearchParam,
    getNewSearchParams,
    appendSearchParams,
  };
};

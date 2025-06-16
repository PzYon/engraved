import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";

export const knownQueryParams = {
  selectedItemId: "selected-item",
  actionKey: "action-key",
};

export type ActionKey =
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
      searchParams.delete(knownQueryParams.actionKey);
      searchParams.delete(knownQueryParams.selectedItemId);
      setSearchParams(searchParams);
    },

    openAction: (actionItemId: string, actionKey: ActionKey) => {
      searchParams.set(knownQueryParams.actionKey, actionKey);
      searchParams.set(knownQueryParams.selectedItemId, actionItemId);
      setSearchParams(searchParams);
    },
  };
};

export const useSelectedItemId = () => {
  return useEngravedSearchParam(knownQueryParams.selectedItemId);
};

export const useEngravedSearchParam = (key: string) => {
  const customSearchParams = useEngravedSearchParams();

  return {
    setValue: (value: string) => {
      customSearchParams.appendSearchParams({ [key]: value });
    },
    getValue: () => {
      return customSearchParams.getSearchParam(key);
    },
  };
};

export const useEngravedSearchParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Memoize getSearchParam to prevent unnecessary re-renders of consumers
  const getSearchParam = useCallback(
    (key: string) => searchParams.get(key),
    [searchParams],
  );

  // Memoize appendSearchParams to prevent unnecessary re-renders of consumers
  const appendSearchParams = useCallback(
    (params: Record<string, string>) => {
      const currentSearchParams = searchParams.toString();
      const newSearchParams = getNewSearchParams(params);
      const updatedSearchParams = newSearchParams.toString();

      // Only update if the string representation of search params has changed
      if (updatedSearchParams !== currentSearchParams) {
        setSearchParams(newSearchParams);
      }
    },
    [searchParams, setSearchParams], // Depend on searchParams and setSearchParams
  );

  // Helper to clone current search params
  const cloneSearchParams = useCallback(() => {
    const newestSearchParams: Record<string, string> = {};
    searchParams.forEach((v, k) => {
      newestSearchParams[k] = v;
    });
    return new URLSearchParams({ ...newestSearchParams });
  }, [searchParams]);

  // Helper to generate new search params based on provided updates
  const getNewSearchParams = useCallback(
    (params: Record<string, string>) => {
      const newSearchParams = cloneSearchParams();

      for (const key in params) {
        const value = params[key];

        if (
          value === null ||
          value === undefined ||
          value === "" ||
          value === "false" // Assuming 'false' as a string should remove the param
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

  return {
    getSearchParam,
    appendSearchParams,
  };
};

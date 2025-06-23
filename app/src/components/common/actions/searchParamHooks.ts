import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";

export const knownQueryParams = {
  selectedItemId: "selected-item",
  actionKey: "action-key",
  favoritesOnly: "favorites-only",
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
  };
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
      const currentSearchParams = searchParams.toString();
      const newSearchParams = getNewSearchParams(params);
      const updatedSearchParams = newSearchParams.toString();

      if (updatedSearchParams !== currentSearchParams) {
        setSearchParams(newSearchParams);
      }
    },
    [searchParams, setSearchParams, getNewSearchParams],
  );

  return {
    getSearchParam,
    appendSearchParams,
  };
};

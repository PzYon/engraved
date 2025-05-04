import { useSearchParams } from "react-router-dom";

export const knownQueryParams = {
  selectedItemIdParam: "selected-item",
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
    [knownQueryParams.selectedItemIdParam]: actionItemId,
  };
}

export const useItemAction = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  return {
    getParams: () => {
      return getItemActionQueryParams(
        searchParams.get(knownQueryParams.actionKey) as ActionKey,
        searchParams.get(knownQueryParams.selectedItemIdParam),
      );
    },

    closeAction: () => {
      searchParams.delete(knownQueryParams.actionKey);
      searchParams.delete(knownQueryParams.selectedItemIdParam);
      setSearchParams(searchParams);
    },

    openAction: (actionItemId: string, actionKey: ActionKey) => {
      searchParams.set(knownQueryParams.actionKey, actionKey);
      searchParams.set(knownQueryParams.selectedItemIdParam, actionItemId);
      setSearchParams(searchParams);
    },
  };
};

export const useSelectedItemId = () => {
  return useEngravedSearchParam(knownQueryParams.selectedItemIdParam);
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

  return {
    getSearchParam: (key: string) => searchParams.get(key),

    appendSearchParams: (params: Record<string, string>) => {
      const newSearchParams = getNewSearchParams(params);

      if (newSearchParams.toString() === searchParams.toString()) {
        return;
      }

      setSearchParams(newSearchParams);
    },
  };

  function cloneSearchParams() {
    const newestSearchParams: Record<string, string> = {};
    searchParams.forEach((v, k) => {
      newestSearchParams[k] = v;
    });

    return new URLSearchParams({ ...newestSearchParams });
  }

  function getNewSearchParams(params: Record<string, string>) {
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
  }
};

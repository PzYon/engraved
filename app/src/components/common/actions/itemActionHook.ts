import { useSearchParams } from "react-router-dom";

const key = "action-key";
const itemId = "action-item-id";

export type ActionKey =
  | "permissions"
  | "delete"
  | "schedule"
  | "add-entry"
  | "move"
  | "notification-done"
  | "edit";

export function getItemActionQueryParams(
  actionKey: ActionKey,
  actionItemId: string,
) {
  return {
    [key]: actionKey,
    [itemId]: actionItemId,
  };
}

export const useItemAction = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  return {
    getParams: () => {
      return getItemActionQueryParams(
        searchParams.get(key) as ActionKey,
        searchParams.get(itemId),
      );
    },

    closeAction: () => {
      searchParams.delete(itemId);
      searchParams.delete(key);
      setSearchParams(searchParams);
    },

    openAction: (actionItemId: string, actionKey: ActionKey) => {
      searchParams.set(key, actionKey);
      searchParams.set(itemId, actionItemId);
      setSearchParams(searchParams);
    },
  };
};

export const useCustomSearchParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  return {
    getParam: (key: string) => searchParams.get(key),

    getAppendedParamsAsUrl: (params: Record<string, string>): string => {
      return !params || !Object.keys(params).length
        ? undefined
        : getNewSearchParams(params).toString();
    },

    appendParams: (params: Record<string, string>) => {
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

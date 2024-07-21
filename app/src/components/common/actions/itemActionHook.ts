import { useSearchParams } from "react-router-dom";

const key = "action-key";
const itemId = "action-item-id";

export function getItemActionQueryParams(
  actionKey: string,
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
      return {
        key: searchParams.get(key),
        itemId: searchParams.get(itemId),
      };
    },

    closeAction: () => {
      searchParams.delete(itemId);
      searchParams.delete(key);
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
      debugger;
      const newSearchParams = getNewSearchParams(params);

      if (newSearchParams.toString() === searchParams.toString()) {
        return;
      }

      setSearchParams(newSearchParams);
    },
  };

  function getNewSearchParams(params: Record<string, string>) {
    const newSearchParams = new URLSearchParams({ ...searchParams });

    for (const key in params) {
      const value = params[key];

      if (value === null || value === undefined || value === "") {
        newSearchParams.delete(key);
      } else {
        newSearchParams.set(key, value);
      }
    }

    return newSearchParams;
  }
};

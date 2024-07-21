import { useSearchParams } from "react-router-dom";

const key = "action-key";
const itemId = "action-item-id";

export function foo(actionKey: string, actionItemId: string) {
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
      const newSearchParams = getNewSearchParams(params);

      if (newSearchParams.toString() === searchParams.toString()) {
        return;
      }

      setSearchParams(newSearchParams);
    },
  };

  function getNewSearchParams(params: Record<string, string>) {
    for (const key in params) {
      const value = params[key];

      if (value === null || value === undefined || value === "") {
        searchParams.delete(key);
      } else {
        searchParams.set(key, value);
      }
    }

    // TDDO: what up!?
    //return searchParams;
    return new URLSearchParams({ ...searchParams });

    /*
    const existingParams: Record<string, string> = {};
    for (const [key, value] of searchParams.entries()) {
      existingParams[key] = value;
    }

    return new URLSearchParams({
      ...existingParams,
      ...params,
    });*/
  }
};

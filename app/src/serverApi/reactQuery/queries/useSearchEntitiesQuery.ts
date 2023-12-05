import { queryKeysFactory } from "../queryKeysFactory";
import { ServerApi } from "../../ServerApi";
import { useQuery } from "@tanstack/react-query";
import { ISearchEntitiesResult } from "../../ISearchEntitiesResult";

export const useSearchEntitiesQuery = (searchText?: string) => {
  const { data: result } = useQuery<ISearchEntitiesResult>({
    queryKey: queryKeysFactory.entities(searchText),

    queryFn: () => {
      return !searchText
        ? Promise.resolve({
            entities: [],
            journals: [],
          })
        : ServerApi.getSearchEntities(searchText);
    },
  });

  return result;
};

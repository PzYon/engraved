import { queryKeysFactory } from "../queryKeysFactory";
import { ServerApi } from "../../ServerApi";
import { useQuery } from "@tanstack/react-query";
import { ISearchEntitiesResult } from "../../ISearchEntitiesResult";

export const useSearchEntitiesQuery = (
  searchText?: string,
  scheduledOnly?: boolean,
  executeWithoutConditions?: boolean,
) => {
  const { data: result } = useQuery<ISearchEntitiesResult>({
    queryKey: queryKeysFactory.entities(
      searchText,
      scheduledOnly,
      executeWithoutConditions,
    ),

    queryFn: () =>
      executeWithoutConditions || searchText
        ? ServerApi.getSearchEntities(searchText, scheduledOnly)
        : Promise.resolve({ entities: [], journals: [] }),
  });

  return result;
};

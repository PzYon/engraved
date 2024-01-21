import { queryKeysFactory } from "../queryKeysFactory";
import { ServerApi } from "../../ServerApi";
import { useQuery } from "@tanstack/react-query";
import { ISearchEntitiesResult } from "../../ISearchEntitiesResult";

export const useSearchEntitiesQuery = (
  searchText?: string,
  scheduledOnly?: boolean,
) => {
  const { data: result } = useQuery<ISearchEntitiesResult>({
    queryKey: queryKeysFactory.entities(searchText, scheduledOnly),

    queryFn: () => ServerApi.getSearchEntities(searchText, scheduledOnly),
  });

  return result;
};

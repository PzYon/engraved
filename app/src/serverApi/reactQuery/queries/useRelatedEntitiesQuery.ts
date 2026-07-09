import { useQuery } from "@tanstack/react-query";
import { queryKeysFactory } from "../queryKeysFactory";
import { ServerApi } from "../../ServerApi";
import { ISearchEntitiesResult } from "../../ISearchEntitiesResult";

export const useRelatedEntitiesQuery = (
  entityId: string,
  entityType: "Journal" | "Entry",
) => {
  const { data: result, isFetching } = useQuery<ISearchEntitiesResult>({
    queryKey: queryKeysFactory.relatedEntities(entityId, entityType),
    queryFn: () => ServerApi.getRelatedEntities(entityId, entityType),
  });

  return { data: result, isFetching };
};

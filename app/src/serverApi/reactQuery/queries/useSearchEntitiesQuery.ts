import { IEntity } from "../../IEntity";
import { queryKeysFactory } from "../queryKeysFactory";
import { ServerApi } from "../../ServerApi";
import { useQuery } from "@tanstack/react-query";

export const useSearchEntitiesQuery = (searchText?: string) => {
  const { data: entities } = useQuery<IEntity[]>({
    queryKey: queryKeysFactory.entities(searchText),

    queryFn: () => {
      return !searchText
        ? Promise.resolve([])
        : ServerApi.getSearchEntities(searchText);
    },
  });

  return entities;
};

import { queryKeysFactory } from "../queryKeysFactory";
import { ServerApi } from "../../ServerApi";
import { useQuery } from "@tanstack/react-query";
import { ISearchEntitiesResult } from "../../ISearchEntitiesResult";
import { JournalType } from "../../JournalType";

export const useSearchEntitiesQuery = (
  searchText?: string,
  scheduledOnly?: boolean,
  onlyEntriesOfTypes?: JournalType[],
  executeWithoutConditions?: boolean,
) => {
  const { data: result } = useQuery<ISearchEntitiesResult>({
    queryKey: queryKeysFactory.entities(
      searchText,
      scheduledOnly,
      onlyEntriesOfTypes,
      executeWithoutConditions,
    ),

    queryFn: () =>
      executeWithoutConditions || searchText
        ? ServerApi.getSearchEntities(
            searchText,
            scheduledOnly,
            onlyEntriesOfTypes,
          )
        : Promise.resolve({ entities: [], journals: [] }),
  });

  return result;
};

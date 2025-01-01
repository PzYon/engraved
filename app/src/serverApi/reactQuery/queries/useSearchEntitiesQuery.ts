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
  onlyConsiderTitle?: boolean,
) => {
  const { data: result } = useQuery<ISearchEntitiesResult>({
    queryKey: queryKeysFactory.entities(
      searchText,
      scheduledOnly,
      onlyEntriesOfTypes,
      executeWithoutConditions,
      onlyConsiderTitle,
    ),

    queryFn: () =>
      executeWithoutConditions || searchText
        ? ServerApi.searchEntities(
            searchText,
            scheduledOnly,
            onlyEntriesOfTypes,
            onlyConsiderTitle,
          )
        : Promise.resolve({ entities: [], journals: [] }),
  });

  return result;
};

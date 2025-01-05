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
  placeholderData?: (
    previousData: ISearchEntitiesResult,
  ) => ISearchEntitiesResult,
) => {
  const { data: result } = useQuery<ISearchEntitiesResult>({
    queryKey: queryKeysFactory.entities(
      searchText,
      scheduledOnly,
      onlyEntriesOfTypes,
      executeWithoutConditions,
      onlyConsiderTitle,
    ),

    placeholderData: placeholderData,

    queryFn: () =>
      executeWithoutConditions || searchText
        ? ServerApi.searchEntities(
            searchText,
            scheduledOnly,
            onlyEntriesOfTypes,
            onlyConsiderTitle,
          )
        : Promise.resolve(null),
  });

  return result;
};

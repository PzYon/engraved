import { queryKeysFactory } from "../queryKeysFactory";
import { ServerApi } from "../../ServerApi";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { ISearchEntitiesResult } from "../../ISearchEntitiesResult";
import { JournalType } from "../../JournalType";

export const useSearchEntitiesQuery = (
  searchText?: string,
  scheduledOnly?: boolean,
  onlyEntriesOfTypes?: JournalType[],
  executeWithoutConditions?: boolean,
  onlyConsiderTitle?: boolean,
  placeholderData?: (
    previousData: ISearchEntitiesResult | undefined,
  ) => ISearchEntitiesResult,
) => {
  const options: UseQueryOptions<ISearchEntitiesResult> = {
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
            searchText ?? "",
            scheduledOnly ?? false,
            onlyEntriesOfTypes ?? [],
            onlyConsiderTitle ?? false,
          )
        : Promise.resolve({} as ISearchEntitiesResult),
  };

  if (placeholderData) {
    // we only set placeholderData if it is actually overridden
    // in order to not reset default behavior (when setting 'undefined')
    options.placeholderData = placeholderData;
  }

  const { data: result } = useQuery<ISearchEntitiesResult>(options);

  return result;
};

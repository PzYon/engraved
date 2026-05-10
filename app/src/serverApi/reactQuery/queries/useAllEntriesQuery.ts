import { useSuspenseQuery } from "@tanstack/react-query";
import { queryKeysFactory } from "../queryKeysFactory";
import { ServerApi } from "../../ServerApi";
import { IGetAllEntriesQueryResult } from "../../IGetAllEntriesQueryResult";
import { JournalType } from "../../JournalType";

// useSuspenseQuery is used here so that the Entries overview page always
// receives defined data, removing the need for a null guard. A <Suspense>
// boundary in EntriesPage shows a loading indicator while entries load.
export const useAllEntriesQuery = (
  searchText?: string,
  journalTypes?: JournalType[],
) => {
  const { data: allEntries } = useSuspenseQuery<IGetAllEntriesQueryResult>({
    queryKey: queryKeysFactory.entries(searchText, journalTypes),

    queryFn: () => ServerApi.getAllEntries(searchText, journalTypes),
  });

  return allEntries;
};

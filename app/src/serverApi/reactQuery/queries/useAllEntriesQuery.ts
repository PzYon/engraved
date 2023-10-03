import { useQuery } from "@tanstack/react-query";
import { queryKeysFactory } from "../queryKeysFactory";
import { ServerApi } from "../../ServerApi";
import { IGetAllEntriesQueryResult } from "../../IGetAllEntriesQueryResult";
import { JournalType } from "../../JournalType";

export const useAllEntriesQuery = (
  searchText?: string,
  journalTypes?: JournalType[],
) => {
  const { data: allEntries } = useQuery<IGetAllEntriesQueryResult>({
    queryKey: queryKeysFactory.entries(searchText, journalTypes),

    queryFn: () => ServerApi.getAllEntries(searchText, journalTypes),
  });

  return allEntries;
};

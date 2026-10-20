import { useQuery, useQueryClient } from "@tanstack/react-query";
import { IJournal } from "../../IJournal";
import { queryKeysFactory } from "../queryKeysFactory";
import { ServerApi } from "../../ServerApi";
import { JournalType } from "../../JournalType";
import { useEffect } from "react";

export const useJournalsQuery = (
  searchText?: string,
  journalTypes?: JournalType[],
  favoritesOnly?: boolean,
  journalIds?: string[],
  enabled = true,
): IJournal[] =>
  useJournalsQueryWithState(
    searchText,
    journalTypes,
    favoritesOnly,
    journalIds,
    enabled,
  ).journals;

export const useJournalsQueryWithState = (
  searchText?: string,
  journalTypes?: JournalType[],
  favoritesOnly?: boolean,
  journalIds?: string[],
  enabled = true,
): { journals: IJournal[]; isLoading: boolean } => {
  const queryClient = useQueryClient();

  const {
    data: journals,
    isSuccess,
    isLoading,
  } = useQuery<IJournal[]>({
    enabled: enabled,

    queryKey: queryKeysFactory.journals(
      searchText,
      journalTypes,
      favoritesOnly,
      journalIds,
    ),

    queryFn: () =>
      ServerApi.getJournals(
        searchText,
        journalTypes,
        favoritesOnly,
        journalIds,
      ),
  });

  useEffect(() => {
    if (!isSuccess || !journals) {
      return;
    }

    for (const loadedJournal of journals) {
      queryClient.setQueryData(
        queryKeysFactory.journal(loadedJournal.id),
        () => loadedJournal,
      );
    }
  }, [isSuccess, journals, queryClient]);

  return { journals: journals ?? [], isLoading };
};

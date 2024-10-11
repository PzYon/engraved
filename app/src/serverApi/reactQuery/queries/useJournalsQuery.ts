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
): IJournal[] => {
  const queryClient = useQueryClient();

  const { data: journals, isSuccess } = useQuery<IJournal[]>({
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
        queryKeysFactory.journals(loadedJournal.id, journalTypes),
        () => loadedJournal,
      );
    }
  }, [isSuccess, journalTypes, journals, queryClient]);

  return journals;
};

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { IJournal } from "../../IJournal";
import { queryKeysFactory } from "../queryKeysFactory";
import { ServerApi } from "../../ServerApi";
import { JournalType } from "../../JournalType";

export const useJournalsQuery = (
  searchText?: string,
  journalTypes?: JournalType[],
) => {
  const queryClient = useQueryClient();

  const { data } = useQuery<IJournal[]>({
    queryKey: queryKeysFactory.journals(searchText, journalTypes),

    queryFn: () => ServerApi.getJournals(searchText, journalTypes),

    onSuccess: (loadedJournals) => {
      for (const loadedJournal of loadedJournals) {
        queryClient.setQueryData(
          queryKeysFactory.journals(loadedJournal.id, journalTypes),
          () => loadedJournal,
        );
      }
    },
  });

  return data;
};

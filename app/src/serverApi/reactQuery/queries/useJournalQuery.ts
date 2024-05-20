import { useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeysFactory } from "../queryKeysFactory";
import { ServerApi } from "../../ServerApi";
import { IJournal } from "../../IJournal";
import { useEffect } from "react";

export const useJournalQuery = (journalId: string) => {
  const queryClient = useQueryClient();

  const { data: journal, isSuccess } = useQuery({
    queryKey: queryKeysFactory.journal(journalId),

    queryFn: () =>
      journalId ? ServerApi.getJournal(journalId) : Promise.resolve(null),
  });

  useEffect(() => {
    if (!isSuccess || !journalId) {
      return;
    }

    queryClient.setQueriesData(
      {
        queryKey: queryKeysFactory.journals(undefined, undefined),
        exact: true,
      },
      (journals: IJournal[]) =>
        journals.map((j) => (j.id === journal.id ? journal : j)),
    );
  }, [queryClient, isSuccess, journal, journalId]);

  return journal;
};

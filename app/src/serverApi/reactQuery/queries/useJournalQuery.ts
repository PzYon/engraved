import { useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeysFactory } from "../queryKeysFactory";
import { ServerApi } from "../../ServerApi";
import { IJournal } from "../../IJournal";

export const useJournalQuery = (journalId: string) => {
  const queryClient = useQueryClient();

  const { data: journal } = useQuery({
    queryKey: queryKeysFactory.journal(journalId),

    queryFn: () => ServerApi.getJournal(journalId),

    onSuccess: (loadedJournal) => {
      queryClient.setQueriesData(
        {
          queryKey: queryKeysFactory.journals(undefined, undefined),
          exact: true,
        },
        (journals: IJournal[]) =>
          journals.map((m) => (m.id === loadedJournal.id ? loadedJournal : m)),
      );
    },
  });

  return journal;
};

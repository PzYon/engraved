import { useQuery } from "@tanstack/react-query";
import { queryKeysFactory } from "../queryKeysFactory";
import { ServerApi } from "../../ServerApi";

export const useJournalQuery = (journalId: string) => {
  const { data: journal } = useQuery({
    queryKey: queryKeysFactory.journal(journalId),

    queryFn: () =>
      journalId ? ServerApi.getJournal(journalId) : Promise.resolve(null),
  });

  return journal;
};

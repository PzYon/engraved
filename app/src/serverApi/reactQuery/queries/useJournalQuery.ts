import { useSuspenseQuery } from "@tanstack/react-query";
import { queryKeysFactory } from "../queryKeysFactory";
import { ServerApi } from "../../ServerApi";

// useSuspenseQuery is used here so that consuming components (journal detail pages)
// always receive a defined journal, eliminating defensive null checks. A <Suspense>
// boundary in JournalPageWrapper shows a loading indicator while the data fetches.
export const useJournalQuery = (journalId: string) => {
  const { data: journal } = useSuspenseQuery({
    queryKey: queryKeysFactory.journal(journalId),

    queryFn: () => ServerApi.getJournal(journalId),
  });

  return journal;
};

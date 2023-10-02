import { useQuery } from "@tanstack/react-query";
import { queryKeysFactory } from "../queryKeysFactory";
import { JournalType } from "../../JournalType";
import { ServerApi } from "../../ServerApi";
import { IJournal } from "../../IJournal";

export const useActiveEntryQuery = (journal: IJournal) => {
  const { data: entry } = useQuery({
    cacheTime: 0,

    queryKey: queryKeysFactory.activeEntry(journal.id, journal.type),

    queryFn: () =>
      journal.type === JournalType.Timer
        ? ServerApi.getActiveEntry(journal.id)
        : Promise.resolve(null),
  });

  return entry;
};

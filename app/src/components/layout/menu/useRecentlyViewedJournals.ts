import { IJournal } from "../../../serverApi/IJournal";
import { useState } from "react";
import { useJournalsQuery } from "../../../serverApi/reactQuery/queries/useJournalsQuery";
import { StorageWrapper } from "../../../util/StorageWrapper";

const storage = new StorageWrapper(window.localStorage);
const storageKey = "engraved::recently-view-journals";

export const useRecentlyViewedJournals = (): {
  viewedJournals: IJournal[];
  addView: (id: string) => void;
} => {
  const [journalIds, setJournalIds] = useState<string[]>(
    () => storage.getValue<string[]>(storageKey) ?? [],
  );

  const journals =
    useJournalsQuery(undefined, undefined, false, journalIds) ?? [];

  return {
    viewedJournals: journalIds
      .map((id) => journals.find((j) => j.id === id))
      .filter((j) => !!j) as IJournal[],

    addView: (id: string) => {
      const index = journalIds.indexOf(id);
      if (index > -1) {
        journalIds.splice(index, 1);
      }

      journalIds.unshift(id);

      setJournalIds([...journalIds]);
      storage.setValue(storageKey, journalIds);
    },
  };
};

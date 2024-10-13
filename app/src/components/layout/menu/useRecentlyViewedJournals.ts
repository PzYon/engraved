import { IJournal } from "../../../serverApi/IJournal";
import { useState } from "react";
import { useJournalsQuery } from "../../../serverApi/reactQuery/queries/useJournalsQuery";
import { StorageWrapper } from "../../../util/StorageWrapper";

const storage = new StorageWrapper(window.localStorage);
const storageKey = "engraved::recently-view-journals";

export const useRecentlyViewedJournals = (): {
  journals: IJournal[];
  addViewed: (id: string) => void;
} => {
  const [journalIds, setJournalIds] = useState<string[]>(
    () => storage.getValue<string[]>(storageKey) ?? [],
  );

  const journals =
    useJournalsQuery(undefined, undefined, false, journalIds) ?? [];

  return {
    journals: journalIds
      .map((id) => journals.find((j) => j.id === id))
      .filter((j) => !!j) as IJournal[],

    addViewed: (id: string) => {
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

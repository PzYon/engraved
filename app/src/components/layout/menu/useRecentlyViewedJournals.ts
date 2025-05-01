import { IJournal } from "../../../serverApi/IJournal";
import { useState } from "react";
import { useJournalsQuery } from "../../../serverApi/reactQuery/queries/useJournalsQuery";
import { StorageWrapper } from "../../../util/StorageWrapper";

const storage = new StorageWrapper(window.localStorage);
const storageKey = "engraved::recently-view-journals";

export const addRecentlyViewedJournal = (id: string) => {
  const journalIds = storage.getValue<string[]>(storageKey) ?? [];

  const index = journalIds.indexOf(id);
  if (index > -1) {
    journalIds.splice(index, 1);
  }

  journalIds.unshift(id);

  storage.setValue(storageKey, journalIds);
};

export const useRecentlyViewedJournals = (): IJournal[] => {
  const [journalIds] = useState<string[]>(
    () => storage.getValue<string[]>(storageKey) ?? [],
  );

  const journals =
    useJournalsQuery(undefined, undefined, false, journalIds) ?? [];

  return journalIds
    .map((id) => journals.find((j) => j.id === id))
    .filter((j) => !!j) as IJournal[];
};

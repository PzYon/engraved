import { IJournal } from "../../../serverApi/IJournal";
import { useJournalsQueryWithState } from "../../../serverApi/reactQuery/queries/useJournalsQuery";
import { StorageWrapper } from "../../../util/StorageWrapper";

const storage = new StorageWrapper(window.localStorage);
const storageKey = "engraved::recently-view-journals";

export const addRecentlyViewedJournal = (id: string) => {
  if (!id) {
    return;
  }

  const journalIds = getJournalIdsFromStorage();

  const index = journalIds.indexOf(id);
  if (index > -1) {
    journalIds.splice(index, 1);
  }

  journalIds.unshift(id);

  storage.setValue(storageKey, journalIds);
};

export const useRecentlyViewedJournals = (): {
  journals: IJournal[];
  isLoading: boolean;
} => {
  const journalIds = getJournalIdsFromStorage();

  const { journals, isLoading } = useJournalsQueryWithState(
    undefined,
    undefined,
    false,
    journalIds,
  );

  return {
    journals: journalIds
      .map((id) => journals.find((j) => j.id === id))
      .filter((j) => !!j) as IJournal[],
    isLoading,
  };
};

function getJournalIdsFromStorage() {
  return storage.getValue<string[]>(storageKey) ?? [];
}

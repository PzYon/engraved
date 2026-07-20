import { useEffect, useState } from "react";
import { useJournalContext } from "../JournalContext";
import { useAppContext } from "../../../AppContext";

export function useJournalViewState() {
  const { journal, entries: scraps, setDateConditions } = useJournalContext();
  const { user } = useAppContext();

  const [activeItemId, setActiveItemId] = useState<string | undefined>(
    undefined,
  );

  useEffect(() => {
    // we need to set date conditions in order for data to be loaded
    setDateConditions({});
  }, [setDateConditions]);

  return { journal, scraps, user, activeItemId, setActiveItemId };
}

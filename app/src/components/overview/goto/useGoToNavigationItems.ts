import { useRecentlyViewedJournals } from "../../layout/menu/useRecentlyViewedJournals";
import { useSearchEntitiesQuery } from "../../../serverApi/reactQuery/queries/useSearchEntitiesQuery";
import { JournalType } from "../../../serverApi/JournalType";

export const useGoToNavigationItems = (searchText: string) => {
  const { viewedJournals } = useRecentlyViewedJournals();

  const result = useSearchEntitiesQuery(
    searchText,
    false,
    [JournalType.Scraps],
    false,
    true,
  );

  return (
    (searchText ? result?.entities?.map((e) => e.entity) : viewedJournals) ?? []
  );
};

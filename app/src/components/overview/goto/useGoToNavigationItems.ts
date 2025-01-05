import { useRecentlyViewedJournals } from "../../layout/menu/useRecentlyViewedJournals";
import { useSearchEntitiesQuery } from "../../../serverApi/reactQuery/queries/useSearchEntitiesQuery";
import { JournalType } from "../../../serverApi/JournalType";
import { ISearchEntitiesResult } from "../../../serverApi/ISearchEntitiesResult";

export const useGoToNavigationItems = (searchText: string) => {
  const { viewedJournals } = useRecentlyViewedJournals();

  const result = useSearchEntitiesQuery(
    searchText,
    false,
    [JournalType.Scraps],
    false,
    true,
    (previousData: ISearchEntitiesResult): ISearchEntitiesResult =>
      previousData ?? getFallbackValue(),
  );

  if (!searchText) {
    return viewedJournals;
  }

  return (result?.entities || []).map((e) => e.entity);

  function getFallbackValue(): ISearchEntitiesResult {
    return {
      entities: viewedJournals.map((j) => ({
        entity: j,
        entityType: "Journal",
      })),
      journals: [],
    };
  }
};

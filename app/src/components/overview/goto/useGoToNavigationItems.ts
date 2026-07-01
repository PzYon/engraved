import { useRecentlyViewedJournals } from "../../layout/menu/useRecentlyViewedJournals";
import { useSearchEntitiesQuery } from "../../../serverApi/reactQuery/queries/useSearchEntitiesQuery";
import { JournalType } from "../../../serverApi/JournalType";
import { ISearchEntitiesResult } from "../../../serverApi/ISearchEntitiesResult";
import { IEntity } from "../../../serverApi/IEntity";
import { IJournal } from "../../../serverApi/IJournal";
import { keepPreviousData } from "@tanstack/react-query";

export const useGoToNavigationItems = (
  searchText?: string,
): { journalsForEntries: IJournal[]; items: IEntity[]; isLoading: boolean } => {
  const viewedJournals = useRecentlyViewedJournals();

  const { data: result, isFetching } = useSearchEntitiesQuery(
    searchText,
    false,
    [JournalType.Scraps],
    false,
    true,
    (
      previousData: ISearchEntitiesResult | undefined,
    ): ISearchEntitiesResult | undefined =>
      keepPreviousData(previousData) ?? getFallbackValue(),
  );

  if (!searchText) {
    return {
      items: viewedJournals,
      journalsForEntries: [],
      isLoading: false,
    };
  }

  return {
    items: (result?.entities ?? []).map((e) => e.entity),
    journalsForEntries: result?.journals ?? [],
    isLoading: isFetching,
  };

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

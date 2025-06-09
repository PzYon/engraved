import React from "react";
import { usePageContext } from "../../layout/pages/PageContext";
import { useJournalsQuery } from "../../../serverApi/reactQuery/queries/useJournalsQuery";
import { NoResultsFound } from "../../common/search/NoResultsFound";
import { ListItemsProvider, OverviewList } from "../overviewList/OverviewList";
import { IEntity } from "../../../serverApi/IEntity";

function getRenderItem(journal: IEntity, index: number, hasFocus: boolean) {
  console.log("rendering item at index", index, hasFocus);
  return <div>max</div>;
}

export const Journals: React.FC<{
  favoritesOnly?: boolean;
  journalIds?: string[];
}> = ({ favoritesOnly, journalIds }) => {
  const { searchText, journalTypes } = usePageContext();
  const journals = useJournalsQuery(
    searchText,
    journalTypes,
    favoritesOnly,
    journalIds,
  );

  if (!journals) {
    return null;
  }

  if (!journals.length && searchText) {
    return <NoResultsFound />;
  }

  return (
    <ListItemsProvider items={journals}>
      <OverviewList items={journals} renderItem={getRenderItem} />
    </ListItemsProvider>
  );
};

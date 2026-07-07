import React from "react";
import { usePageContext } from "../../layout/pages/PageContext";
import { useJournalsQuery } from "../../../serverApi/reactQuery/queries/useJournalsQuery";
import { NoResultsFound } from "../../common/search/NoResultsFound";
import { useIsOffline } from "../../common/useIsOffline";
import { OverviewList } from "../overviewList/OverviewList";
import { JournalListItem } from "./JournalListItem";
import { IJournal } from "../../../serverApi/IJournal";
import { IEntity } from "../../../serverApi/IEntity";

export const Journals: React.FC<{
  favoritesOnly?: boolean;
  journalIds?: string[];
}> = ({ favoritesOnly, journalIds }) => {
  const { searchText, journalTypes } = usePageContext();
  const isOffline = useIsOffline();

  const journals = useJournalsQuery(
    searchText,
    journalTypes,
    favoritesOnly,
    journalIds,
  );

  if (!journals) {
    return null;
  }

  // While offline an empty result means the data is not cached (queries are
  // paused), not that nothing matches - so fall through to the OverviewList,
  // which renders the offline placeholder.
  if (!journals.length && searchText && !isOffline) {
    return <NoResultsFound />;
  }

  return <OverviewList items={journals} renderItem={renderItem} />;
};

function renderItem(journal: IEntity, index: number, hasFocus: boolean) {
  return (
    <JournalListItem
      key={journal.id}
      index={index}
      journal={journal as IJournal}
      hasFocus={hasFocus}
    />
  );
}

import React from "react";
import { usePageContext } from "../../layout/pages/PageContext";
import { useJournalsQuery } from "../../../serverApi/reactQuery/queries/useJournalsQuery";
import { NoResultsFound } from "../../common/search/NoResultsFound";
import { JournalListItem } from "./JournalListItem";
import { IJournal } from "../../../serverApi/IJournal";
import { OverviewList } from "../overviewList/OverviewList";

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
    <OverviewList
      items={journals}
      renderItem={(journal, index, hasFocus, giveFocus) => (
        <JournalListItem
          key={journal.id}
          index={index}
          journal={journal as IJournal}
          hasFocus={hasFocus}
          giveFocus={giveFocus}
        />
      )}
    />
  );
};

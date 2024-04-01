import React from "react";
import { usePageContext } from "../layout/pages/PageContext";
import { useJournalsQuery } from "../../serverApi/reactQuery/queries/useJournalsQuery";
import { NoResultsFound } from "../common/search/NoResultsFound";
import { JournalListItem } from "./JournalListItem";
import { IJournal } from "../../serverApi/IJournal";
import { NavigatableList } from "./navigatableList/NavigatableList";

export const Journals: React.FC<{ favoritesOnly?: boolean }> = ({
  favoritesOnly,
}) => {
  const { searchText, journalTypes } = usePageContext();
  const journals = useJournalsQuery(searchText, journalTypes, favoritesOnly);

  if (!journals) {
    return null;
  }

  if (!journals.length && searchText) {
    return <NoResultsFound />;
  }

  return (
    <NavigatableList
      items={journals}
      renderItem={(journal, _, hasFocus) => {
        return (
          <JournalListItem
            key={journal.id}
            journal={journal as IJournal}
            hasFocus={hasFocus}
          />
        );
      }}
    />
  );
};

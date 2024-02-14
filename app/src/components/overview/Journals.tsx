import React from "react";
import { usePageContext } from "../layout/pages/PageContext";
import { useJournalsQuery } from "../../serverApi/reactQuery/queries/useJournalsQuery";
import { NoResultsFound } from "../common/search/NoResultsFound";
import { JournalListItem } from "./JournalListItem";
import { JournalWrapperCollection } from "./JournalWrapperCollection";
import { useCollection } from "../common/wrappers/useCollection";

export const Journals: React.FC<{ favoritesOnly?: boolean }> = ({
  favoritesOnly,
}) => {
  const { searchText, journalTypes } = usePageContext();
  const journals = useJournalsQuery(searchText, journalTypes, favoritesOnly);

  const { collection, keyToken, addItem } = useCollection(
    (focusIndex, setFocusIndex) =>
      new JournalWrapperCollection(focusIndex, setFocusIndex),
    [journals],
  );

  if (!journals) {
    return null;
  }

  if (!journals.length && searchText) {
    return <NoResultsFound />;
  }

  return (
    <>
      {journals.map((journal, i) => (
        <JournalListItem
          index={i}
          key={journal.id + keyToken}
          addWrapperItem={addItem}
          onClick={() => collection.setFocus(i)}
          journal={journal}
          isFocused={i === collection.currentIndex}
        />
      ))}
    </>
  );
};

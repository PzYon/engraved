import React from "react";
import { useAllEntriesQuery } from "../../serverApi/reactQuery/queries/useAllEntriesQuery";
import { JournalTypeFactory } from "../../journalTypes/JournalTypeFactory";
import { IEntry } from "../../serverApi/IEntry";
import { PageSection } from "../layout/pages/PageSection";
import { usePageContext } from "../layout/pages/PageContext";
import { NoResultsFound } from "../common/search/NoResultsFound";
import { NavigatableList } from "./navigatableList/NavigatableList";

export const Entries: React.FC = () => {
  const { searchText, journalTypes } = usePageContext();
  const queryResult = useAllEntriesQuery(searchText, journalTypes);

  if (!queryResult) {
    return null;
  }

  if (!queryResult.entries.length && searchText) {
    return <NoResultsFound />;
  }

  return (
    <>
      <NavigatableList
        items={queryResult.entries}
        renderItem={(item, index) => {
          return (
            <PageSection key={item.id} testId={`entries-list-item-${index}`}>
              {renderEntry(item as IEntry)}
            </PageSection>
          );
        }}
      ></NavigatableList>
    </>
  );

  function renderEntry(entry: IEntry) {
    const journal = queryResult.journals.find((j) => j.id === entry.parentId);

    return JournalTypeFactory.create(journal.type).getEntry(journal, entry);
  }
};

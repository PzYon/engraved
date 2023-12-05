import React from "react";
import { useAllEntriesQuery } from "../../serverApi/reactQuery/queries/useAllEntriesQuery";
import { JournalTypeFactory } from "../../journalTypes/JournalTypeFactory";
import { IEntry } from "../../serverApi/IEntry";
import { PageSection } from "../layout/pages/PageSection";
import { usePageContext } from "../layout/pages/PageContext";
import { NoResultsFound } from "../common/search/NoResultsFound";

export const Entries: React.FC = () => {
  const { searchText, journalTypes } = usePageContext();
  const queryResult = useAllEntriesQuery(searchText, journalTypes);

  console.log("jep");

  if (!queryResult) {
    return null;
  }

  if (!queryResult.entries.length && searchText) {
    return <NoResultsFound />;
  }

  return (
    <>
      {queryResult.entries.map((entry, i) => (
        <PageSection key={entry.id} testId={`entries-list-item-${i}`}>
          {renderEntry(entry)}
        </PageSection>
      ))}
    </>
  );

  function renderEntry(entry: IEntry) {
    const journal = queryResult.journals.find((j) => j.id === entry.parentId);

    return JournalTypeFactory.create(journal.type).getEntry(journal, entry);
  }
};

import React from "react";
import { usePageContext } from "../layout/pages/PageContext";
import { useSearchEntitiesQuery } from "../../serverApi/reactQuery/queries/useSearchEntitiesQuery";
import { ISearchEntitiesResult } from "../../serverApi/ISearchEntitiesResult";
import { NoResultsFound } from "../common/search/NoResultsFound";
import { IEntry } from "../../serverApi/IEntry";
import { JournalTypeFactory } from "../../journalTypes/JournalTypeFactory";
import { JournalListItem } from "../overview/JournalListItem";
import { IJournal } from "../../serverApi/IJournal";
import { PageSection } from "../layout/pages/PageSection";

export const GlobalSearch: React.FC<{ isSchedule?: boolean }> = ({
  isSchedule,
}) => {
  const { searchText } = usePageContext();
  const queryResult: ISearchEntitiesResult = useSearchEntitiesQuery(
    searchText,
    isSchedule,
  );

  if (!queryResult) {
    return null;
  }

  if (!queryResult.entities.length && (searchText || isSchedule)) {
    return <NoResultsFound hideTryAgain={isSchedule} />;
  }

  return (
    <>
      {queryResult.entities.map((e) => {
        if (e.entityType === "Entry") {
          return (
            <PageSection key={e.entity.id}>
              {renderEntry(e.entity as IEntry)}
            </PageSection>
          );
        }

        return (
          <JournalListItem key={e.entity.id} journal={e.entity as IJournal} />
        );
      })}
    </>
  );

  function renderEntry(entry: IEntry) {
    const journal = queryResult.journals.find((j) => j.id === entry.parentId);

    return JournalTypeFactory.create(journal.type).getEntry(journal, entry);
  }
};

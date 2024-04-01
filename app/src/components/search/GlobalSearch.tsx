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
import { NavigatableList } from "../overview/navigatableList/NavigatableList";

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
      <NavigatableList
        items={queryResult.entities.map((e) => e.entity)}
        renderItem={(item, _, hasFocus) => {
          // this is a temporary hack! should be something like:
          // if (item.entityType === "Entry") {
          if (!(item as IJournal).type) {
            return (
              <PageSection key={item.id}>
                {renderEntry(item as IEntry, hasFocus)}
              </PageSection>
            );
          }

          return (
            <JournalListItem
              hasFocus={hasFocus}
              key={item.id}
              journal={item as IJournal}
            />
          );
        }}
      ></NavigatableList>
    </>
  );

  function renderEntry(entry: IEntry, hasFocus: boolean) {
    const journal = queryResult.journals.find((j) => j.id === entry.parentId);

    return JournalTypeFactory.create(journal.type).getEntry(
      journal,
      entry,
      hasFocus,
    );
  }
};

import React from "react";
import { usePageContext } from "../../layout/pages/PageContext";
import { useSearchEntitiesQuery } from "../../../serverApi/reactQuery/queries/useSearchEntitiesQuery";
import { ISearchEntitiesResult } from "../../../serverApi/ISearchEntitiesResult";
import { NoResultsFound } from "../../common/search/NoResultsFound";
import { IEntry } from "../../../serverApi/IEntry";
import { JournalListItem } from "../journals/JournalListItem";
import { IJournal } from "../../../serverApi/IJournal";
import { NavigatableList } from "../navigatableList/NavigatableList";
import { EntryListItem } from "../entries/EntryListItem";

export const Entities: React.FC<{ isSchedule?: boolean }> = ({
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
        renderItem={(item, index, hasFocus) => {
          // this is a temporary hack! should be something like:
          // if (item.entityType === "Entry") {
          if (!(item as IJournal).type) {
            return (
              <EntryListItem
                key={item.id}
                item={item as IEntry}
                journals={queryResult.journals}
                index={index}
                hasFocus={hasFocus}
              />
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
};

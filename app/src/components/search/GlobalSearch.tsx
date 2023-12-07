import React from "react";
import { usePageContext } from "../layout/pages/PageContext";
import { useSearchEntitiesQuery } from "../../serverApi/reactQuery/queries/useSearchEntitiesQuery";
import { ISearchEntitiesResult } from "../../serverApi/ISearchEntitiesResult";
import { NoResultsFound } from "../common/search/NoResultsFound";
import { IEntry } from "../../serverApi/IEntry";
import { JournalTypeFactory } from "../../journalTypes/JournalTypeFactory";
import { JournalListItem } from "../overview/JournalListItem";
import { IJournal } from "../../serverApi/IJournal";

export const GlobalSearch: React.FC = () => {
  const { searchText } = usePageContext();
  const queryResult: ISearchEntitiesResult = useSearchEntitiesQuery(searchText);

  if (!queryResult) {
    return null;
  }

  if (!queryResult.entities.length && searchText) {
    return <NoResultsFound />;
  }

  return (
    <div>
      {queryResult.entities.map((e, i) => {
        if (e.entityType === "Entry") {
          return renderEntry(e.entity as IEntry);
        }

        const journal = e.entity as IJournal;
        return (
          <JournalListItem
            key={journal.id}
            journal={journal}
            addWrapper={() => {
              //collection.add(journal.id, wrapper);
            }}
            onClick={() => alert("click")}
            index={i}
            isFocused={false}
          />
        );
      })}
    </div>
  );

  function renderEntry(entry: IEntry) {
    const journal = queryResult.journals.find((j) => j.id === entry.parentId);

    debugger;
    return JournalTypeFactory.create(journal.type).getEntry(journal, entry);
  }
};

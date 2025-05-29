import React from "react";
import { useAllEntriesQuery } from "../../../serverApi/reactQuery/queries/useAllEntriesQuery";
import { IEntry } from "../../../serverApi/IEntry";
import { usePageContext } from "../../layout/pages/PageContext";
import { NoResultsFound } from "../../common/search/NoResultsFound";
import { OverviewList } from "../overviewList/OverviewList";
import { EntryListItem } from "./EntryListItem";

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
    <OverviewList
      items={queryResult.entries}
      renderItem={(item, index, hasFocus) => (
        <EntryListItem
          key={item.id}
          entry={item as IEntry}
          journals={queryResult.journals}
          index={index}
          hasFocus={hasFocus}
        />
      )}
    />
  );
};

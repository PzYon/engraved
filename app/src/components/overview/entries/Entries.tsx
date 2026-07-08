import React from "react";
import { useAllEntriesQuery } from "../../../serverApi/reactQuery/queries/useAllEntriesQuery";
import { IEntry } from "../../../serverApi/IEntry";
import { usePageContext } from "../../layout/pages/PageContext";
import { NoResultsFound } from "../../common/search/NoResultsFound";
import { OfflinePlaceholder } from "../../common/search/OfflinePlaceholder";
import { useIsOffline } from "../../common/useIsOffline";
import { OverviewList } from "../overviewList/OverviewList";
import { EntryListItem } from "./EntryListItem";

export const Entries: React.FC = () => {
  const { searchText, journalTypes } = usePageContext();
  const isOffline = useIsOffline();
  const queryResult = useAllEntriesQuery(searchText, journalTypes);

  if (!queryResult) {
    // undefined means not loaded (yet) - when offline that is because the
    // query is paused until the network is back.
    return isOffline ? <OfflinePlaceholder /> : null;
  }

  // While offline an empty result means the data is not cached (queries are
  // paused), not that nothing matches - so fall through to the OverviewList,
  // which renders the offline placeholder.
  if (!queryResult.entries.length && searchText && !isOffline) {
    return <NoResultsFound />;
  }

  return (
    <OverviewList
      items={queryResult.entries}
      renderItem={(item, index, hasFocus, giveFocus) => (
        <EntryListItem
          key={item.id}
          entry={item as IEntry}
          journals={queryResult.journals}
          index={index}
          hasFocus={hasFocus}
          giveFocus={giveFocus}
        />
      )}
    />
  );
};

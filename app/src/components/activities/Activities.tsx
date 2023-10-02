import React from "react";
import { useActivitiesQuery } from "../../serverApi/reactQuery/queries/useActivitiesQuery";
import { JournalTypeFactory } from "../../journalTypes/JournalTypeFactory";
import { IEntry } from "../../serverApi/IEntry";
import { PageSection } from "../layout/pages/PageSection";
import { usePageContext } from "../layout/pages/PageContext";
import { NoResultsFound } from "../common/search/NoResultsFound";

export const Activities: React.FC = () => {
  const { searchText, journalTypes } = usePageContext();
  const activities = useActivitiesQuery(searchText, journalTypes);

  if (!activities) {
    return null;
  }

  if (!activities.entries.length && searchText) {
    return <NoResultsFound />;
  }

  return (
    <>
      {activities.entries.map((e) => (
        <PageSection key={e.id}>{renderActivity(e)}</PageSection>
      ))}
    </>
  );

  function renderActivity(entry: IEntry) {
    const journal = activities.journals.find((j) => j.id === entry.parentId);

    return JournalTypeFactory.create(journal.type).getActivity(journal, entry);
  }
};

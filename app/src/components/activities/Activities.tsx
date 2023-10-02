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

  if (!activities.measurements.length && searchText) {
    return <NoResultsFound />;
  }

  return (
    <>
      {activities.measurements.map((m) => (
        <PageSection key={m.id}>{renderActivity(m)}</PageSection>
      ))}
    </>
  );

  function renderActivity(measurement: IEntry) {
    const metric = activities.metrics.find(
      (a) => a.id === measurement.parentId,
    );

    return JournalTypeFactory.create(metric.type).getActivity(
      metric,
      measurement,
    );
  }
};

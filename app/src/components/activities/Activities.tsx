import React from "react";
import { useActivitiesQuery } from "../../serverApi/reactQuery/queries/useActivitiesQuery";
import { MetricTypeFactory } from "../../metricTypes/MetricTypeFactory";
import { IMeasurement } from "../../serverApi/IMeasurement";
import { PageSection } from "../layout/pages/PageSection";
import { usePageContext } from "../layout/pages/PageContext";
import { NoResultsFound } from "../common/search/NoResultsFound";

export const Activities: React.FC = () => {
  const { searchText } = usePageContext();
  const activities = useActivitiesQuery(searchText);

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

  function renderActivity(measurement: IMeasurement) {
    const metric = activities.metrics.find(
      (a) => a.id === measurement.metricId
    );

    return MetricTypeFactory.create(metric.type).getActivity(
      metric,
      measurement
    );
  }
};

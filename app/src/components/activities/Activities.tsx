import React from "react";
import { useActivitiesQuery } from "../../serverApi/reactQuery/queries/useActivitiesQuery";
import { MetricTypeFactory } from "../../metricTypes/MetricTypeFactory";
import { IMeasurement } from "../../serverApi/IMeasurement";
import { PageSection } from "../layout/pages/PageSection";
import { usePageContext } from "../layout/pages/PageContext";

export const Activities: React.FC = () => {
  const { searchText, showSearchBox } = usePageContext();
  const activities = useActivitiesQuery(searchText);

  if (!activities) {
    return null;
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

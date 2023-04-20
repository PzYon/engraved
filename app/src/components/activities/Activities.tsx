import React from "react";
import { useActivitiesQuery } from "../../serverApi/reactQuery/queries/useActivitiesQuery";
import { MetricTypeFactory } from "../../metricTypes/MetricTypeFactory";
import { IMeasurement } from "../../serverApi/IMeasurement";
import { PageSection } from "../layout/pages/PageSection";

export const Activities: React.FC = () => {
  const activities = useActivitiesQuery();

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

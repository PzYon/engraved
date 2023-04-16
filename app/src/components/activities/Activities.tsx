import React from "react";
import { useActivitiesQuery } from "../../serverApi/reactQuery/queries/useActivitiesQuery";
import { Section } from "../layout/Section";
import { MetricTypeFactory } from "../../metricTypes/MetricTypeFactory";
import { IMeasurement } from "../../serverApi/IMeasurement";

export const Activities: React.FC = () => {
  const activities = useActivitiesQuery();

  if (!activities) {
    return null;
  }

  return (
    <>
      {activities.measurements.map((m) => (
        <Section key={m.id}>{renderActivity(m)}</Section>
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

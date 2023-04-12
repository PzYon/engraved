import React from "react";
import { useActivitiesQuery } from "../../serverApi/reactQuery/queries/useActivitiesQuery";
import { Box } from "@mui/material";
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
      {activities.measurements.map((m) => {
        return (
          <Section key={m.id}>
            <Box sx={{ display: "flex" }}>{renderMeasurement(m)}</Box>
          </Section>
        );
      })}
    </>
  );

  function renderMeasurement(measurement: IMeasurement) {
    const metric = activities.metrics.find(
      (a) => a.id === measurement.metricId
    );

    return MetricTypeFactory.create(metric.type).getActivity(
      metric,
      measurement
    );
  }
};

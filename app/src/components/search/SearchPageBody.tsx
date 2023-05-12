import React, { useState } from "react";
import { useActivitiesQuery } from "../../serverApi/reactQuery/queries/useActivitiesQuery";
import { TextField } from "@mui/material";
import { PageSection } from "../layout/pages/PageSection";
import { IMeasurement } from "../../serverApi/IMeasurement";
import { MetricTypeFactory } from "../../metricTypes/MetricTypeFactory";

export const SearchPageBody: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const exposedSearchText = useDebounce(searchText);

  const activities = useActivitiesQuery(exposedSearchText);

  return (
    <>
      <TextField onChange={(e) => setSearchText(e.target.value)} />
      {activities?.measurements.map((m) => (
        <PageSection key={m.id}>{renderActivity(m)}</PageSection>
      ))}
    </>
  );

  // copied from <Activities />

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

export function useDebounce<T>(value: T, delay = 500) {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

  React.useEffect(() => {
    const handler: NodeJS.Timeout = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

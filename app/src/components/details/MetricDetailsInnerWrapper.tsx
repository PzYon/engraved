import React from "react";
import { useMetricDetailsContext } from "./MetricDetailsContext";
import { MetricType } from "../../serverApi/MetricType";
import { MetricDetailsInner } from "./MetricDetailsInner";
import { NotesDetails } from "./notes/NotesDetails";

export const MetricDetailsInnerWrapper: React.FC = () => {
  const { metric } = useMetricDetailsContext();

  if (!metric) {
    return <div>Loading...</div>;
  }

  return metric.type === MetricType.Notes ? (
    <NotesDetails metric={metric} />
  ) : (
    <MetricDetailsInner />
  );
};

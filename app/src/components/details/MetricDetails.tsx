import React from "react";
import { useParams } from "react-router";
import { MetricDetailsContextProvider } from "./MetricDetailsContext";
import { MetricDetailsInner } from "./MetricDetailsInner";

export const MetricDetails: React.FC = () => {
  const { metricId } = useParams();

  return (
    <MetricDetailsContextProvider metricId={metricId}>
      <MetricDetailsInner />
    </MetricDetailsContextProvider>
  );
};

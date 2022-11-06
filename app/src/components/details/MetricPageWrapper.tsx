import React from "react";
import { useParams } from "react-router";
import { MetricContextProvider } from "./MetricDetailsContext";
import { MetricDetails } from "./MetricDetails";

export const MetricPageWrapper: React.FC = () => {
  const { metricId } = useParams();

  return (
    <MetricContextProvider metricId={metricId}>
      <MetricDetails />
    </MetricContextProvider>
  );
};

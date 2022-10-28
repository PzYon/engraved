import React from "react";
import { useParams } from "react-router";
import { MetricDetailsContextProvider } from "./MetricDetailsContext";
import { MetricDetailsWrapper } from "./MetricDetailsWrapper";

export const MetricDetails: React.FC = () => {
  const { metricId } = useParams();

  return (
    <MetricDetailsContextProvider metricId={metricId}>
      <MetricDetailsWrapper />
    </MetricDetailsContextProvider>
  );
};

import React from "react";
import { useParams } from "react-router";
import { MetricDetailsContextProvider } from "./MetricDetailsContext";
import { MetricDetailsInnerWrapper } from "./MetricDetailsInnerWrapper";

export const MetricDetails: React.FC = () => {
  const { metricId } = useParams();

  return (
    <MetricDetailsContextProvider metricId={metricId}>
      <MetricDetailsInnerWrapper />
    </MetricDetailsContextProvider>
  );
};

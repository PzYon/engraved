import React from "react";
import { usePageContext } from "../layout/pages/PageContext";
import { useMetricsQuery } from "../../serverApi/reactQuery/queries/useMetricsQuery";
import { NoResultsFound } from "../common/search/NoResultsFound";
import { MetricListItem } from "./MetricListItem";

export const Metrics: React.FC = () => {
  const { searchText, metricTypes } = usePageContext();
  const metrics = useMetricsQuery(searchText, metricTypes);

  if (!metrics) {
    return null;
  }

  if (!metrics.length && searchText) {
    return <NoResultsFound />;
  }

  return (
    <>
      {metrics.map((m) => (
        <MetricListItem key={m.id} metric={m} />
      ))}
    </>
  );
};

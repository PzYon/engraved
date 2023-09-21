import React, { useMemo } from "react";
import { usePageContext } from "../layout/pages/PageContext";
import { useMetricsQuery } from "../../serverApi/reactQuery/queries/useMetricsQuery";
import { NoResultsFound } from "../common/search/NoResultsFound";
import { MetricListItem } from "./MetricListItem";
import { useHotkeys } from "react-hotkeys-hook";
import { MetricWrapperCollection } from "./MetricWrapperCollection";

export const Metrics: React.FC = () => {
  const { searchText, metricTypes, showFilters, setShowFilters } =
    usePageContext();
  const metrics = useMetricsQuery(searchText, metricTypes);
  const collection = useMemo(() => new MetricWrapperCollection(), [metrics]);

  useHotkeys("alt+up", () => {
    collection.moveFocusUp();
  });

  useHotkeys("alt+down", () => {
    collection.moveFocusDown();
  });

  useHotkeys("alt+a", () => {
    collection.addMeasurement();
  });

  useHotkeys("alt+enter", () => {
    collection.visit();
  });

  useHotkeys("alt+f", (keyboardEvent) => {
    keyboardEvent.preventDefault();
    setShowFilters(!showFilters);
  });

  if (!metrics) {
    return null;
  }

  if (!metrics.length && searchText) {
    return <NoResultsFound />;
  }

  return (
    <>
      {metrics.map((metric, i) => (
        <MetricListItem
          key={metric.id}
          metric={metric}
          addWrapper={(wrapper) => {
            collection.add(metric.id, wrapper);
          }}
          onClick={() => collection.setFocus(i)}
          index={i}
        />
      ))}
    </>
  );
};

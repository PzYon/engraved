import React, { useMemo } from "react";
import { usePageContext } from "../layout/pages/PageContext";
import { useMetricsQuery } from "../../serverApi/reactQuery/queries/useMetricsQuery";
import { NoResultsFound } from "../common/search/NoResultsFound";
import { MetricListItem } from "./MetricListItem";
import { useHotkeys } from "react-hotkeys-hook";
import { MetricWrapperCollection } from "./MetricWrapperCollection";

export const Metrics: React.FC = () => {
  const { searchText, metricTypes } = usePageContext();
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

  if (!metrics) {
    return null;
  }

  if (!metrics.length && searchText) {
    return <NoResultsFound />;
  }

  return (
    <>
      {metrics.map((m, i) => (
        <MetricListItem
          key={m.id}
          metric={m}
          addWrapper={(wrapper) => {
            collection.add(m.id, wrapper);
          }}
          index={i}
        />
      ))}
    </>
  );
};

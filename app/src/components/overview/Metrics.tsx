import React, { useMemo, useState } from "react";
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

  const [focusIndex, setFocusIndex] = useState(-1);

  const collection = useMemo(
    () => new MetricWrapperCollection(focusIndex, setFocusIndex),
    [metrics]
  );

  useHotkeys("alt+up", () => {
    collection.moveFocusUp();
  });

  useHotkeys("alt+down", () => {
    collection.moveFocusDown();
  });

  useHotkeys("alt+f", (keyboardEvent) => {
    keyboardEvent.preventDefault();
    setShowFilters(!showFilters);
  });

  const keyToken = useMemo(() => Math.random(), [metrics]);

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
          key={metric.id + keyToken}
          metric={metric}
          addWrapper={(wrapper) => {
            collection.add(metric.id, wrapper);
          }}
          onClick={() => collection.setFocus(i)}
          index={i}
          isFocused={i === collection.currentIndex}
        />
      ))}
    </>
  );
};

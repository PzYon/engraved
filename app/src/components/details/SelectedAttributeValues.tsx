import React from "react";
import { useMetricDetailsContext } from "./MetricDetailsContext";

export const SelectedAttributeValues: React.FC = () => {
  const { selectedAttributeValues, toggleAttributeValue } =
    useMetricDetailsContext();

  return (
    <div>
      {Object.keys(selectedAttributeValues).map((x) => {
        return (
          <div
            key={x}
            onClick={() =>
              toggleAttributeValue(x, selectedAttributeValues[x][0])
            }
          >
            {x}: {selectedAttributeValues[x].join(",")}
          </div>
        );
      })}
    </div>
  );
};

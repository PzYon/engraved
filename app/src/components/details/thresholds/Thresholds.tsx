import { IMetric } from "../../../serverApi/IMetric";
import React, { useEffect, useState } from "react";
import { ServerApi } from "../../../serverApi/ServerApi";
import { useMetricContext } from "../MetricDetailsContext";
import { IThresholdValues } from "../../../serverApi/IThresholdValues";
import { styled } from "@mui/material";

export const Thresholds: React.FC<{ metric: IMetric }> = ({ metric }) => {
  const { dateConditions } = useMetricContext();

  const [thresholdValues, setThresholdValues] = useState<IThresholdValues>();

  useEffect(() => {
    ServerApi.getThresholdValues(metric.id, dateConditions).then(
      setThresholdValues
    );
  }, []);

  if (!thresholdValues) {
    return null;
  }

  return (
    <Host>
      {Object.keys(thresholdValues).flatMap((attributeKey) => {
        const attributeThresholds = thresholdValues[attributeKey];

        return Object.keys(attributeThresholds).map((valueKey) => {
          const threshold = attributeThresholds[valueKey];
          return (
            <div key={attributeKey + "_" + valueKey}>
              {attributeKey}.{valueKey}: Threshold: {threshold.thresholdValue} |
              Actual: {threshold.actualValue}
            </div>
          );
        });
      })}
    </Host>
  );
};

const Host = styled("div")``;

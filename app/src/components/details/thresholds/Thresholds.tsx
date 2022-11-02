import { IMetric } from "../../../serverApi/IMetric";
import React, { useEffect, useState } from "react";
import { styled } from "@mui/material";
import { IMetricThresholds } from "../../../serverApi/IMetricThresholds";
import { ServerApi } from "../../../serverApi/ServerApi";
import { useMetricDetailsContext } from "../MetricDetailsContext";
import { IThresholdValues } from "../../../serverApi/IThresholdValues";

export const Thresholds: React.FC<{ metric: IMetric }> = ({ metric }) => {
  const metricThresholds: IMetricThresholds = {
    Nationality: {
      GB: 12,
      US: 20,
      CH: 5,
    },
  };

  const { dateConditions } = useMetricDetailsContext();

  const [thresholdValues, setThresholdValues] = useState<IThresholdValues>({});

  useEffect(() => {
    ServerApi.getThresholdValues(metric.id, dateConditions);
  }, []);

  return (
    <Host>
      {Object.keys(metricThresholds).map((attributeKey) => {
        const thresholdsForAttribute = metricThresholds[attributeKey];
        return Object.keys(thresholdsForAttribute).map((valueKey) => {
          const threshold: number = thresholdsForAttribute[valueKey];
          return (
            <div key={valueKey}>
              {attributeKey} {valueKey} - Threshold: {threshold} || Actual:{" "}
              {thresholdValues?.[attributeKey]?.[valueKey]}
            </div>
          );
        });
      })}
    </Host>
  );
};

const Host = styled("div")``;

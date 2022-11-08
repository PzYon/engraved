import { IMetric } from "../../../serverApi/IMetric";
import React, { useEffect, useState } from "react";
import { ServerApi } from "../../../serverApi/ServerApi";
import { useMetricContext } from "../MetricDetailsContext";
import { IThresholdValues } from "../../../serverApi/IThresholdValues";
import { styled, Typography } from "@mui/material";

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
          const attributeName =
            metric.attributes[attributeKey].name ?? attributeKey;
          const valueName =
            metric.attributes[attributeKey].values[valueKey] ?? valueKey;

          return (
            <RowContainer key={attributeKey + "_" + valueKey}>
              <Typography>
                {valueName} <Lighter>({attributeName})</Lighter>
              </Typography>
              <Typography>
                <ActualValue
                  isBelow={threshold.actualValue - threshold.thresholdValue < 0}
                >
                  {threshold.actualValue}
                </ActualValue>{" "}
                <Lighter>{threshold.thresholdValue}</Lighter>
              </Typography>
            </RowContainer>
          );
        });
      })}
    </Host>
  );
};

const Host = styled("div")``;

const RowContainer = styled("div")`
  margin-bottom: 15px;
`;

const ActualValue = styled("span")<{ isBelow: boolean }>`
  font-size: x-large;
  color: ${(p) => (p.isBelow ? "green" : "red")};
`;

const Lighter = styled("span")`
  font-weight: lighter;
`;

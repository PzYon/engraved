import { IMetric } from "../../../serverApi/IMetric";
import React from "react";
import { ServerApi } from "../../../serverApi/ServerApi";
import { useMetricContext } from "../MetricDetailsContext";
import { Card, styled, Typography } from "@mui/material";
import { GridContainer, GridItem } from "../../common/Grid";
import { useQuery } from "@tanstack/react-query";
import { queryKeysFactory } from "../../../serverApi/queryKeysFactory";

export const Thresholds: React.FC<{
  metric: IMetric;
  selectedAttributeValues: { [key: string]: string[] };
  setSelectedAttributeValues: (
    attributeKey: string,
    attributeValueKeys: string[]
  ) => void;
}> = ({ metric, selectedAttributeValues, setSelectedAttributeValues }) => {
  const { dateConditions } = useMetricContext();

  const { data: thresholdValues } = useQuery(
    queryKeysFactory.metricThresholdValues(metric.id, dateConditions),
    () => ServerApi.getThresholdValues(metric.id, dateConditions)
  );

  if (!thresholdValues) {
    return null;
  }

  return (
    <GridContainer>
      {Object.keys(thresholdValues).flatMap((attributeKey) => {
        const attributeThresholds = thresholdValues[attributeKey];

        return Object.keys(attributeThresholds).map((valueKey) => {
          const threshold = attributeThresholds[valueKey];
          const attributeName =
            metric.attributes[attributeKey].name ?? attributeKey;
          const valueName =
            metric.attributes[attributeKey].values[valueKey] ?? valueKey;

          const currentSelectedValue =
            selectedAttributeValues[attributeKey]?.[0];

          return (
            <GridItem key={attributeKey + "_" + valueKey}>
              <Card
                sx={{
                  p: 2,
                  cursor: "pointer",
                  opacity:
                    !currentSelectedValue || currentSelectedValue === valueKey
                      ? 1
                      : 0.5,
                }}
                onClick={() => {
                  setSelectedAttributeValues(
                    attributeKey,
                    currentSelectedValue === valueKey ? [] : [valueKey]
                  );
                }}
              >
                <Typography>
                  {valueName} <Lighter>({attributeName})</Lighter>
                </Typography>
                <Typography>
                  <ActualValue
                    isBelow={
                      threshold.actualValue - threshold.thresholdValue < 0
                    }
                  >
                    {Math.round(
                      threshold.thresholdValue - threshold.actualValue
                    )}
                  </ActualValue>{" "}
                  {threshold.actualValue}
                  <Lighter> / {threshold.thresholdValue}</Lighter>
                </Typography>
              </Card>
            </GridItem>
          );
        });
      })}
    </GridContainer>
  );
};

const ActualValue = styled("span")<{ isBelow: boolean }>`
  font-size: xx-large;
  font-weight: bold;
  color: ${(p) => (p.isBelow ? "green" : "red")};
  margin-right: ${(p) => p.theme.spacing(1)};
`;

const Lighter = styled("span")`
  font-weight: lighter;
`;

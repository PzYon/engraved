import { IMetric } from "../../../serverApi/IMetric";
import React, { useEffect, useState } from "react";
import { ServerApi } from "../../../serverApi/ServerApi";
import { useMetricContext } from "../MetricDetailsContext";
import { IThresholdValues } from "../../../serverApi/IThresholdValues";
import { Card, Grid, styled, Typography } from "@mui/material";

export const Thresholds: React.FC<{ metric: IMetric; reloadToken: number }> = ({
  metric,
  reloadToken,
}) => {
  const { dateConditions } = useMetricContext();

  const [thresholdValues, setThresholdValues] = useState<IThresholdValues>();

  useEffect(() => {
    ServerApi.getThresholdValues(metric.id, dateConditions).then(
      setThresholdValues
    );
  }, [reloadToken]);

  if (!thresholdValues) {
    return null;
  }

  return (
    <Grid container spacing={2} columns={{ xs: 4, sm: 8, md: 12 }}>
      {Object.keys(thresholdValues).flatMap((attributeKey) => {
        const attributeThresholds = thresholdValues[attributeKey];

        return Object.keys(attributeThresholds).map((valueKey) => {
          const threshold = attributeThresholds[valueKey];
          const attributeName =
            metric.attributes[attributeKey].name ?? attributeKey;
          const valueName =
            metric.attributes[attributeKey].values[valueKey] ?? valueKey;

          return (
            <Grid item xs={2} sm={4} md={4} key={attributeKey + "_" + valueKey}>
              <Card sx={{ p: 2 }}>
                <Typography>
                  {valueName} <Lighter>({attributeName})</Lighter>
                </Typography>
                <Typography>
                  <ActualValue
                    isBelow={
                      threshold.actualValue - threshold.thresholdValue < 0
                    }
                  >
                    {threshold.actualValue}
                  </ActualValue>{" "}
                  <Lighter>{threshold.thresholdValue}</Lighter>
                </Typography>
              </Card>
            </Grid>
          );
        });
      })}
    </Grid>
  );
};

const ActualValue = styled("span")<{ isBelow: boolean }>`
  font-size: xx-large;
  font-weight: bold;
  color: ${(p) => (p.isBelow ? "green" : "red")};
`;

const Lighter = styled("span")`
  font-weight: lighter;
`;

import React from "react";
import { IMetric } from "../../serverApi/IMetric";
import { formatDistanceToNow } from "date-fns";
import { styled, Typography } from "@mui/material";
import { ITimerMetric } from "../../serverApi/ITimerMetric";

export const MetricProperties: React.FC<{ metric: IMetric }> = ({ metric }) => {
  return (
    <>
      <Property>{formatToNow(metric.lastMeasurementDate)}</Property>
      <Property>{formatToNow((metric as ITimerMetric).startDate)}</Property>
    </>
  );
};

function formatToNow(dateString: string): string {
  if (!dateString) {
    return "n/a";
  }

  return formatDistanceToNow(new Date(dateString), {
    addSuffix: true,
  });
}

const Property = styled(Typography)`
  word-break: break-word;
  display: inline-block;
  font-weight: lighter;
  margin-top: 16px;

  :not(:last-of-type)::after {
    content: "\\00B7";
    margin: 0 0.8rem;
  }
`;

import React from "react";
import { IMetric } from "../../serverApi/IMetric";
import { Typography } from "@mui/material";

export const MetricListItem: React.FC<{ metric: IMetric }> = ({ metric }) => {
  return (
    <>
      <Typography variant={"h4"}>{metric.name}</Typography>
      <Typography variant={"subtitle1"}>{metric.description}</Typography>
    </>
  );
};

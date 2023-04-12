import React from "react";
import { IMeasurement } from "../../serverApi/IMeasurement";
import { IMetric } from "../../serverApi/IMetric";
import { FormatDate } from "../../components/common/FormatDate";
import { Typography } from "@mui/material";

export const CounterMeasurementActivity: React.FC<{
  metric: IMetric;
  measurement: IMeasurement;
}> = ({ metric, measurement }) => {
  return (
    <Typography>
      {metric.name} |
      <FormatDate value={measurement.dateTime} /> | +1
    </Typography>
  );
};

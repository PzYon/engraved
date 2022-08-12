import { TextField } from "@mui/material";
import React from "react";
import { IMetric } from "../../../serverApi/IMetric";
import { ServerApi } from "../../../serverApi/ServerApi";

export const MetricNotes: React.FC<{
  metric: IMetric;
}> = ({ metric }) => {
  return (
    <TextField
      defaultValue={metric.notes}
      onBlur={(event) => {
        ServerApi.editMetric(
          metric.id,
          metric.name,
          metric.description,
          event.target.value,
          metric.attributes
        );
      }}
      multiline={true}
      label={"Notes"}
      sx={{ width: "100%" }}
      margin={"normal"}
    />
  );
};

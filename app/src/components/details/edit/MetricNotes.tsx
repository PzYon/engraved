import { TextField } from "@mui/material";
import React from "react";
import { IMetric } from "../../../serverApi/IMetric";
import { useEditMetricMutation } from "../../../serverApi/reactQuery/mutations/useEditMetricMutation";

export const MetricNotes: React.FC<{
  metric: IMetric;
}> = ({ metric }) => {
  const editMetricMutation = useEditMetricMutation(metric.id);

  return (
    <TextField
      defaultValue={metric.notes}
      onBlur={(event) => {
        editMetricMutation.mutate({
          metric: {
            ...metric,
            notes: event.target.value,
          },
        });
      }}
      multiline={true}
      label={"Notes"}
      sx={{ width: "100%", marginTop: 1 }}
      margin={"normal"}
    />
  );
};

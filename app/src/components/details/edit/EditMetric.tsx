import { IMetric } from "../../../serverApi/IMetric";
import React, { useState } from "react";
import { Button, FormControl, TextField } from "@mui/material";
import { translations } from "../../../i18n/translations";
import { ServerApi } from "../../../serverApi/ServerApi";
import { useAppContext } from "../../../AppContext";

export const EditMetric: React.FC<{ metric: IMetric }> = ({ metric }) => {
  const [flagJson, setFlagJson] = useState(
    metric.flags ? JSON.stringify(metric.flags) : ""
  );

  const [name, setName] = useState(metric.name);

  const { setAppAlert } = useAppContext();

  return (
    <FormControl>
      <TextField
        value={name}
        onChange={(event) => setName(event.target.value)}
        label={translations.label_metricName}
        margin={"normal"}
      />
      <TextField
        value={flagJson}
        onChange={(event) => setFlagJson(event.target.value)}
        multiline={true}
        label={"Metric Flags as JSON"}
        margin={"normal"}
      />
      <Button
        variant="outlined"
        onClick={() => {
          ServerApi.editMetric(metric.key, name, JSON.parse(flagJson))
            .then(() => {
              setAppAlert({
                title: `Saved metric ${metric.name}`,
                type: "success",
              });
            })
            .catch((e) => {
              setAppAlert({
                title: "Failed to edit metric",
                message: e.message,
                type: "error",
              });
            });
        }}
      >
        {translations.save}
      </Button>
    </FormControl>
  );
};

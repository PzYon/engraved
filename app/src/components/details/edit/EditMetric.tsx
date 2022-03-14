import { IMetric } from "../../../serverApi/IMetric";
import React, { useState } from "react";
import { Button, FormControl, TextField } from "@mui/material";
import { translations } from "../../../i18n/translations";
import { ServerApi } from "../../../serverApi/ServerApi";
import { envSettings } from "../../../env/envSettings";

export const EditMetric: React.FC<{ metric: IMetric }> = ({ metric }) => {
  const [flagJson, setFlagJson] = useState(
    metric.flags ? JSON.stringify(metric.flags) : ""
  );

  return (
    <FormControl>
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
          new ServerApi(envSettings.apiBaseUrl).editMetric(
            metric.key,
            JSON.parse(flagJson)
          );
        }}
      >
        {translations.save}
      </Button>
    </FormControl>
  );
};

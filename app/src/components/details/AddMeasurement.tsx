import React from "react";
import { Button } from "@mui/material";
import { translations } from "../../i18n/translations";
import { ServerApi } from "../../serverApi/ServerApi";
import { envSettings } from "../../env/envSettings";

export const AddMeasurement: React.FC<{ metricKey: string }> = ({
  metricKey,
}) => {
  return (
    <Button
      variant="contained"
      onClick={() => {
        alert("Will create measurement for " + metricKey);
        new ServerApi(envSettings.apiBaseUrl).addMeasurement(metricKey);
      }}
    >
      {translations.create}
    </Button>
  );
};

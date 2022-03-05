import React from "react";
import { Button } from "@mui/material";
import { translations } from "../../i18n/translations";
import { ServerApi } from "../../serverApi/ServerApi";
import { envSettings } from "../../env/envSettings";

export const AddMeasurement: React.FC<{
  metricKey: string;
  onAdded: () => void;
}> = ({ metricKey, onAdded }) => {
  return (
    <Button
      variant="outlined"
      onClick={async () => {
        await new ServerApi(envSettings.apiBaseUrl).addMeasurement(metricKey);
        onAdded();
      }}
    >
      {translations.create}
    </Button>
  );
};

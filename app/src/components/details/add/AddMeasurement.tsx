import React, { useState } from "react";
import { Button, FormControl } from "@mui/material";
import { translations } from "../../../i18n/translations";
import { ServerApi } from "../../../serverApi/ServerApi";
import { envSettings } from "../../../env/envSettings";
import { IMetric } from "../../../serverApi/IMetric";
import { MetricFlagsSelector } from "./MetricFlagsSelector";

export const AddMeasurement: React.FC<{
  metric: IMetric;
  onAdded: () => void;
}> = ({ metric, onAdded }) => {
  const [flagKey, setFlagKey] = useState<string>(""); // empty means nothing selected in the selector

  return (
    <FormControl>
      <Button
        variant="outlined"
        onClick={async () => {
          await new ServerApi(envSettings.apiBaseUrl).addMeasurement(
            metric.key,
            flagKey
          );
          onAdded();
        }}
      >
        {translations.create}
      </Button>
      <MetricFlagsSelector
        flags={metric.flags}
        selectedFlagKey={flagKey}
        onFlagChange={(key) => setFlagKey(key)}
      />
    </FormControl>
  );
};

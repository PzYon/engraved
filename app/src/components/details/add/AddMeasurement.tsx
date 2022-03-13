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
  // fix default value here (empty should be possible)
  const [flagKey, setFlagKey] = useState<string>("bla");

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
        flags={{ schluessel: "Schlü", bla: "Bla bla" }}
        selectedFlagKey={flagKey}
        onFlagChange={(key) => setFlagKey(key)}
      />
    </FormControl>
  );
};

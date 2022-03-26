import React, { useState } from "react";
import { Button, FormControl } from "@mui/material";
import { translations } from "../../../i18n/translations";
import { ServerApi } from "../../../serverApi/ServerApi";
import { IMetric } from "../../../serverApi/IMetric";
import { MetricFlagsSelector } from "./MetricFlagsSelector";
import { useAppContext } from "../../../AppContext";

export const AddMeasurement: React.FC<{
  metric: IMetric;
  onAdded?: () => void;
}> = ({ metric, onAdded }) => {
  const [flagKey, setFlagKey] = useState<string>(""); // empty means nothing selected in the selector

  const { setAppAlert } = useAppContext();

  return (
    <FormControl>
      {Object.keys(metric.flags || {}).length ? (
        <MetricFlagsSelector
          flags={metric.flags}
          selectedFlagKey={flagKey}
          onFlagChange={(key) => setFlagKey(key)}
        />
      ) : null}
      <Button
        variant="outlined"
        onClick={() => {
          ServerApi.addMeasurement(metric.key, flagKey)
            .then(() => {
              setAppAlert({
                title: `Added measurement`,
                type: "success",
              });
            })
            .catch((e) => {
              setAppAlert({
                title: "Failed to add measurement",
                message: e.message,
                type: "error",
              });
            });

          if (onAdded) {
            onAdded();
          }
        }}
      >
        {translations.add}
      </Button>
    </FormControl>
  );
};

import React, { useState } from "react";
import { Button, FormControl, TextField } from "@mui/material";
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
  const [notes, setNotes] = useState<string>("");

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
      <TextField
        value={notes}
        onChange={(event) => setNotes(event.target.value)}
        multiline={true}
        label={"Notes"}
        margin={"normal"}
      />
      <Button
        variant="outlined"
        onClick={() => {
          ServerApi.addMeasurement(metric.key, notes, flagKey)
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

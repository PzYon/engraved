import React, { useState } from "react";
import { Button, FormControl, TextField } from "@mui/material";
import { translations } from "../../../i18n/translations";
import { ServerApi } from "../../../serverApi/ServerApi";
import { IMetric } from "../../../serverApi/IMetric";
import { MetricFlagsSelector } from "./MetricFlagsSelector";
import { useAppContext } from "../../../AppContext";
import { MetricType } from "../../../serverApi/MetricType";
import { IAddMeasurementCommand } from "../../../serverApi/commands/IAddMeasurementCommand";

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

      {metric.type === MetricType.Timer ? <div>stopwatch!</div> : null}

      <Button
        variant="outlined"
        onClick={() => {
          const command: IAddMeasurementCommand = {
            notes: notes,
            metricFlagKey: flagKey,
            metricKey: metric.key,
          };

          ServerApi.addMeasurement(command, metric.type.toLowerCase())
            .then(() => {
              setAppAlert({
                title: `Added measurement`,
                type: "success",
              });

              if (onAdded) {
                onAdded();
              }
            })
            .catch((e) => {
              setAppAlert({
                title: "Failed to add measurement",
                message: e.message,
                type: "error",
              });
            });
        }}
      >
        {translations.add}
      </Button>
    </FormControl>
  );
};

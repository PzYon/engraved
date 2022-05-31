import React, { useState } from "react";
import { Button, FormControl, TextField } from "@mui/material";
import { translations } from "../../../i18n/translations";
import { ServerApi } from "../../../serverApi/ServerApi";
import { IMetric } from "../../../serverApi/IMetric";
import { MetricAttributesSelector } from "./MetricAttributesSelector";
import { useAppContext } from "../../../AppContext";
import { MetricType } from "../../../serverApi/MetricType";
import { IAddMeasurementCommand } from "../../../serverApi/commands/IAddMeasurementCommand";
import { IAddGaugeMeasurementCommand } from "../../../serverApi/commands/IAddGaugeMeasurementCommand";
import { ITimerMetric } from "../../../serverApi/ITimerMetric";
import { IMetricAttributeValues } from "../../../serverApi/IMetricAttributeValues";

export const AddMeasurement: React.FC<{
  metric: IMetric;
  onAdded?: () => void;
}> = ({ metric, onAdded }) => {
  const [attributeValues, setAttributeValues] =
    useState<IMetricAttributeValues>({}); // empty means nothing selected in the selector
  const [notes, setNotes] = useState<string>("");
  const [value, setValue] = useState<string>("");

  const { setAppAlert } = useAppContext();

  const isTimerAndIsRunning = !!(metric as ITimerMetric).startDate;

  return (
    <FormControl>
      {Object.keys(metric.attributes || {}).length ? (
        <MetricAttributesSelector
          attributes={metric.attributes}
          selectedAttributeValues={attributeValues}
          onChange={(key) => setAttributeValues(key)}
        />
      ) : null}
      <TextField
        value={notes}
        onChange={(event) => setNotes(event.target.value)}
        multiline={true}
        label={"Notes"}
        margin={"normal"}
      />

      {metric.type === MetricType.Gauge ? (
        <TextField
          value={value}
          onChange={(event) => setValue(event.target.value)}
          label={"Value"}
          margin={"normal"}
        />
      ) : null}

      <Button
        variant="outlined"
        onClick={() => {
          const command: IAddMeasurementCommand = {
            notes: notes,
            metricAttributeValues: attributeValues,
            metricId: metric.id,
          };

          if (metric.type === MetricType.Gauge) {
            (command as IAddGaugeMeasurementCommand).value = !isNaN(
              value as never
            )
              ? Number(value)
              : undefined;
          }

          ServerApi.addMeasurement(command, getUrlSegment())
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
        {getAddButtonLabel()}
      </Button>
    </FormControl>
  );

  function getUrlSegment() {
    if (metric.type === MetricType.Timer) {
      return isTimerAndIsRunning ? "timer_end" : "timer_start  ";
    }

    return metric.type.toLowerCase();
  }

  function getAddButtonLabel(): string {
    if (metric.type === MetricType.Timer) {
      return isTimerAndIsRunning ? "Stop" : "Start";
    }

    return translations.add;
  }
};

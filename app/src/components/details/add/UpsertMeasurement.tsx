import React, { useState } from "react";
import { Button, FormControl, TextField } from "@mui/material";
import { translations } from "../../../i18n/translations";
import { ServerApi } from "../../../serverApi/ServerApi";
import { IMetric } from "../../../serverApi/IMetric";
import { MetricAttributesSelector } from "./MetricAttributesSelector";
import { useAppContext } from "../../../AppContext";
import { MetricType } from "../../../serverApi/MetricType";
import { IUpsertMeasurementCommand } from "../../../serverApi/commands/IUpsertMeasurementCommand";
import { IUpsertGaugeMeasurementCommand } from "../../../serverApi/commands/IUpsertGaugeMeasurementCommand";
import { ITimerMetric } from "../../../serverApi/ITimerMetric";
import { IMetricAttributeValues } from "../../../serverApi/IMetricAttributeValues";
import { ApiError } from "../../../serverApi/ApiError";
import { DateTimeSelector } from "../../common/DateTimeSelector";
import { FormElementContainer } from "../../common/FormUtils";
import { IMeasurement } from "../../../serverApi/IMeasurement";
import { IGaugeMeasurement } from "../../../serverApi/ITimerMeasurement";
import { stripTime } from "../../common/utils";

export const UpsertMeasurement: React.FC<{
  metric: IMetric;
  measurement?: IMeasurement;
  onSaved?: () => void;
}> = ({ metric, measurement, onSaved }) => {
  const [attributeValues, setAttributeValues] =
    useState<IMetricAttributeValues>(measurement?.metricAttributeValues || {}); // empty means nothing selected in the selector

  const [notes, setNotes] = useState<string>(measurement?.notes || "");

  const [value, setValue] = useState<string>(
    (measurement as IGaugeMeasurement)?.value?.toString() || ""
  );

  const [date, setDate] = useState<Date>(
    measurement?.dateTime
      ? new Date(measurement.dateTime)
      : stripTime(new Date())
  );

  const { setAppAlert } = useAppContext();

  const isTimerAndIsRunning = !!(metric as ITimerMetric).startDate;

  return (
    <FormControl>
      {metric.type === MetricType.Gauge ? (
        <TextField
          value={value}
          onChange={(event) => setValue(event.target.value)}
          label={"Value"}
          margin={"normal"}
        />
      ) : null}

      <FormElementContainer>
        <DateTimeSelector setDate={setDate} date={date} />
      </FormElementContainer>

      {Object.keys(metric.attributes || {}).length ? (
        <MetricAttributesSelector
          attributes={metric.attributes}
          selectedAttributeValues={attributeValues}
          onChange={(values) => setAttributeValues(values)}
        />
      ) : null}

      <TextField
        value={notes}
        onChange={(event) => setNotes(event.target.value)}
        multiline={true}
        label={"Notes"}
        margin={"normal"}
      />

      <Button variant="outlined" onClick={upsertMeasurment}>
        {getAddButtonLabel()}
      </Button>
    </FormControl>
  );

  async function upsertMeasurment() {
    try {
      let hasNewValues = false;

      for (const keyInValues in attributeValues) {
        for (const value of attributeValues[keyInValues]) {
          if (!metric.attributes[keyInValues].values[value]) {
            metric.attributes[keyInValues].values[value] = value;
            hasNewValues = true;
          }
        }
      }

      if (hasNewValues) {
        await ServerApi.editMetric(
          metric.id,
          metric.name,
          metric.description,
          metric.attributes
        );
      }

      const command: IUpsertMeasurementCommand = {
        id: measurement?.id,
        notes: notes,
        metricAttributeValues: attributeValues,
        metricId: metric.id,
        dateTime: new Date(date),
      };

      if (metric.type === MetricType.Gauge) {
        (command as IUpsertGaugeMeasurementCommand).value = !isNaN(
          value as never
        )
          ? Number(value)
          : undefined;
      }

      await ServerApi.addMeasurement(command, getUrlSegment());

      setAppAlert({
        title: `${measurement?.id ? "Updated" : "Added"} measurement`,
        type: "success",
      });

      onSaved?.();
    } catch (e) {
      setAppAlert({
        title: "Failed to add measurement",
        message: (e as ApiError).message,
        type: "error",
      });
    }
  }

  function getUrlSegment() {
    if (metric.type === MetricType.Timer) {
      return isTimerAndIsRunning ? "timer_end" : "timer_start  ";
    }

    return metric.type.toLowerCase();
  }

  function getAddButtonLabel(): string {
    if (metric.type === MetricType.Timer) {
      return isTimerAndIsRunning ? "Stop timer" : "Start timer";
    }

    return measurement?.id ? translations.edit : translations.add;
  }
};

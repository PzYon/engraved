import React, { useState } from "react";
import { Button, FormControl, TextField } from "@mui/material";
import { translations } from "../../../i18n/translations";
import { IMetric } from "../../../serverApi/IMetric";
import { MetricAttributesSelector } from "./MetricAttributesSelector";
import { MetricType } from "../../../serverApi/MetricType";
import { IUpsertMeasurementCommand } from "../../../serverApi/commands/IUpsertMeasurementCommand";
import { IUpsertGaugeMeasurementCommand } from "../../../serverApi/commands/IUpsertGaugeMeasurementCommand";
import { IMetricAttributeValues } from "../../../serverApi/IMetricAttributeValues";
import { DateSelector } from "../../common/DateSelector";
import { FormElementContainer } from "../../common/FormUtils";
import { IMeasurement } from "../../../serverApi/IMeasurement";
import {
  IGaugeMeasurement,
  ITimerMeasurement,
} from "../../../serverApi/ITimerMeasurement";
import { stripTime } from "../../../util/utils";
import { AttributeComboSearch } from "./AttributeComboSearch";
import { hasAttributes } from "../../../util/MeasurementUtil";
import { UpsertTimerMeasurement } from "./UpsertTimerMeasurement";
import { IUpsertTimerMeasurementCommand } from "../../../serverApi/commands/IUpsertTimerMeasurementCommand";
import { LastSelectedDateStorage } from "./LastSelectedDateStorage";
import { useEditMetricMutation } from "../../../serverApi/reactQuery/mutations/useEditMetricMutation";
import { useUpsertMeasurementMutation } from "../../../serverApi/reactQuery/mutations/useUpsertMeasurementMutation";

const storage = new LastSelectedDateStorage();

export const UpsertMeasurement: React.FC<{
  metric: IMetric;
  measurement?: IMeasurement;
  onSaved?: () => void;
}> = ({ metric, measurement, onSaved }) => {
  const [attributeValues, setAttributeValues] =
    useState<IMetricAttributeValues>(measurement?.metricAttributeValues || {}); // empty means nothing selected in the selector

  const [notes, setNotes] = useState<string>(measurement?.notes || "");

  const [forceResetSelectors, setForceResetSelectors] = useState("initial");

  const [value, setValue] = useState<string>(
    (measurement as IGaugeMeasurement)?.value?.toString() || ""
  );

  const [date, setDate] = useState<Date>(
    measurement?.dateTime
      ? new Date(measurement.dateTime)
      : stripTime(storage.getLastSelectedDate())
  );

  const [startDate, setStartDate] = useState(
    (measurement as ITimerMeasurement)?.startDate
  );

  const [endDate, setEndDate] = useState(
    (measurement as ITimerMeasurement)?.endDate
  );

  const editMetricMutation = useEditMetricMutation(metric.id);

  const upsertMeasurementMutation = useUpsertMeasurementMutation(
    metric.id,
    metric.type,
    measurement,
    onSaved
  );

  return (
    <FormControl>
      {metric.type !== MetricType.Timer ? (
        <FormElementContainer>
          <DateSelector
            setDate={(d) => {
              setDate(d);
              storage.setLastSelectedDate(d);
            }}
            date={date}
          />
        </FormElementContainer>
      ) : null}

      {metric.type === MetricType.Gauge ? (
        <TextField
          value={value}
          type="number"
          onChange={(event) => setValue(event.target.value)}
          label={"Value"}
          margin={"normal"}
          sx={{
            marginBottom: "0",
          }}
        />
      ) : null}

      {metric.type === MetricType.Timer && measurement ? (
        <UpsertTimerMeasurement
          startDate={startDate}
          setStartDate={(d) => setStartDate(d?.toString())}
          endDate={endDate}
          setEndDate={(d) => setEndDate(d?.toString())}
        />
      ) : null}

      {hasAttributes(metric) ? (
        <FormElementContainer>
          <AttributeComboSearch
            metric={metric}
            onChange={(values) => {
              resetSelectors();
              setAttributeValues(
                Object.keys(metric.attributes).reduce(
                  (previousValue: IMetricAttributeValues, key: string) => {
                    previousValue[key] = values[key] ?? [];
                    return previousValue;
                  },
                  {}
                )
              );
            }}
          />
        </FormElementContainer>
      ) : null}

      {hasAttributes(metric) ? (
        <MetricAttributesSelector
          key={forceResetSelectors}
          attributes={metric.attributes}
          selectedAttributeValues={attributeValues}
          onChange={setAttributeValues}
        />
      ) : null}

      <TextField
        value={notes}
        onChange={(event) => setNotes(event.target.value)}
        multiline={true}
        label={"Notes"}
        margin={"normal"}
      />

      <FormElementContainer>
        <Button
          variant="outlined"
          onClick={() => {
            ensureNewAttributeValues();

            upsertMeasurementMutation.mutate({ command: createCommand() });
          }}
        >
          {measurement?.id ? translations.edit : translations.add}
        </Button>
      </FormElementContainer>
    </FormControl>
  );

  function createCommand() {
    const command: IUpsertMeasurementCommand = {
      id: measurement?.id,
      notes: notes,
      metricAttributeValues: attributeValues,
      metricId: metric.id,
      dateTime: new Date(date),
    };

    switch (metric.type) {
      case MetricType.Gauge:
        (command as IUpsertGaugeMeasurementCommand).value = !isNaN(
          value as never
        )
          ? Number(value)
          : undefined;
        break;

      case MetricType.Timer:
        (command as IUpsertTimerMeasurementCommand).startDate = new Date(
          startDate
        );
        (command as IUpsertTimerMeasurementCommand).endDate = new Date(endDate);
        break;
    }
    return command;
  }

  function ensureNewAttributeValues() {
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
      editMetricMutation.mutate({ metric: metric });
    }
  }

  function resetSelectors() {
    setForceResetSelectors(Math.random().toString());
  }
};

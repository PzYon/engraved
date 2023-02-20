import { UpsertMeasurement } from "./UpsertMeasurement";
import { IDialogProps } from "../../layout/dialogs/DialogContext";
import { IMetric } from "../../../serverApi/IMetric";
import React from "react";
import { MetricType } from "../../../serverApi/MetricType";
import { ServerApi } from "../../../serverApi/ServerApi";
import { IMeasurement } from "../../../serverApi/IMeasurement";
import { useQuery } from "@tanstack/react-query";
import { queryKeysFactory } from "../../../serverApi/queryKeysFactory";

export const renderAddMeasurementDialog = (
  metric: IMetric,
  renderDialog: (dialogProps: IDialogProps) => void
): void => {
  renderDialog({
    title: "Add measurement",
    render: () => (
      <UpsertMeasurementWrapper
        metric={metric}
        onSaved={() => {
          renderDialog(null);
        }}
      />
    ),
  });
};

export const UpsertMeasurementWrapper: React.FC<{
  metric: IMetric;
  onSaved: () => void;
}> = ({ metric, onSaved }) => {
  const { data: measurement } = useQuery(
    queryKeysFactory.activeMeasurement(metric.id),
    () => getActiveMeasurement()
  );

  if (measurement === undefined) {
    return null;
  }

  return (
    <UpsertMeasurement
      metric={metric}
      measurement={measurement}
      onSaved={onSaved}
    />
  );

  function getActiveMeasurement(): Promise<IMeasurement> {
    if (metric.type === MetricType.Timer) {
      return ServerApi.getActiveMeasurement(metric.id);
    } else {
      return Promise.resolve(null);
    }
  }
};

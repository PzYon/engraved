import { UpsertMeasurement } from "./UpsertMeasurement";
import { IDialogProps } from "../../layout/dialogs/DialogContext";
import { IMetric } from "../../../serverApi/IMetric";
import React from "react";
import { MetricType } from "../../../serverApi/MetricType";
import { ServerApi } from "../../../serverApi/ServerApi";
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
    () =>
      metric.type === MetricType.Timer
        ? ServerApi.getActiveMeasurement(metric.id)
        : Promise.resolve(null)
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
};

import { UpsertMeasurement } from "./UpsertMeasurement";
import { IDialogProps } from "../../layout/dialogs/DialogContext";
import { IMetric } from "../../../serverApi/IMetric";
import React, { useEffect, useState } from "react";
import { MetricType } from "../../../serverApi/MetricType";
import { ServerApi } from "../../../serverApi/ServerApi";
import { IMeasurement } from "../../../serverApi/IMeasurement";

export const renderAddMeasurementDialog = (
  metric: IMetric,
  renderDialog: (dialogProps: IDialogProps) => void,
  onAdded?: () => void
): void => {
  renderDialog({
    title: "Add measurement",
    render: () => (
      <UpsertMeasurementWrapper
        metric={metric}
        onSaved={() => {
          onAdded?.();
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
  const [measurement, setMeasurement] = useState<IMeasurement>(undefined);

  useEffect(() => {
    if (metric.type === MetricType.Timer) {
      ServerApi.getActiveMeasurement(metric.id).then((m) => {
        setMeasurement(m);
      });
    } else {
      setMeasurement(null);
    }
  }, []);

  if (measurement === undefined) {
    return null;
  }

  return <UpsertMeasurement metric={metric} onSaved={onSaved} />;
};

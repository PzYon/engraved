import { UpsertMeasurement } from "./UpsertMeasurement";
import { IDialogProps } from "../../layout/dialogs/DialogContext";
import { IMetric } from "../../../serverApi/IMetric";
import React from "react";
import { useActiveMeasurementQuery } from "../../../serverApi/queries/useActiveMeasurementQuery";

export const renderAddMeasurementDialog = (
  metric: IMetric,
  renderDialog: (dialogProps: IDialogProps) => void
): void => {
  renderDialog({
    title: "Add measurement",
    render: () => (
      <UpsertMeasurementWrapper
        metric={metric}
        onSaved={() => renderDialog(null)}
      />
    ),
  });
};

const UpsertMeasurementWrapper: React.FC<{
  metric: IMetric;
  onSaved: () => void;
}> = ({ metric, onSaved }) => {
  const measurement = useActiveMeasurementQuery(metric);
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

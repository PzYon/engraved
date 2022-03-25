import { AddMeasurement } from "./AddMeasurement";
import React from "react";
import { IDialogProps } from "../../../DialogContext";
import { IMetric } from "../../../serverApi/IMetric";

export const renderAddMeasurementDialog = (
  renderDialog: (dialogProps: IDialogProps) => void,
  metric: IMetric
): void => {
  renderDialog({
    title: "Add measurement",
    render: () => (
      <AddMeasurement metric={metric} onAdded={() => alert("DONE!")} />
    ),
  });
};

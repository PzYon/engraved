import { AddMeasurement } from "./AddMeasurement";
import { IDialogProps } from "../../layout/dialogs/DialogContext";
import { IMetric } from "../../../serverApi/IMetric";

export const renderAddMeasurementDialog = (
  metric: IMetric,
  renderDialog: (dialogProps: IDialogProps) => void,
  onAdded?: () => void
): void => {
  renderDialog({
    title: "Add measurement",
    render: () => (
      <AddMeasurement
        metric={metric}
        onAdded={() => {
          if (onAdded) {
            onAdded();
          }
          renderDialog(null);
        }}
      />
    ),
  });
};

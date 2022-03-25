import React from "react";
import { IMetric } from "../../../serverApi/IMetric";
import { AddMeasurement } from "./AddMeasurement";
import { DialogWrapper } from "../../layout/DialogWrapper";

export const AddMeasurementDialog: React.FC<{
  metric: IMetric;
  onClose: () => void;
}> = ({ metric, onClose }) => {
  return (
    <DialogWrapper title={metric.name} onClose={onClose}>
      <AddMeasurement metric={metric} onAdded={() => alert("DONE!")} />
    </DialogWrapper>
  );
};

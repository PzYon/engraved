import React, { useEffect } from "react";
import { IMetric } from "../../../serverApi/IMetric";
import { useDialogContext } from "../../layout/dialogs/DialogContext";
import { useNavigate } from "react-router-dom";
import { UpsertMeasurement } from "../add/UpsertMeasurement";
import { IMeasurement } from "../../../serverApi/IMeasurement";
import { useParams } from "react-router";

export const EditMeasurementLauncher: React.FC<{
  metric: IMetric;
  measurements: IMeasurement[];
  onSaved: () => Promise<void>;
}> = ({ metric, measurements, onSaved }) => {
  const { renderDialog } = useDialogContext();
  const { measurementId } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    renderDialog({
      title: "Edit Measurement",
      render: () => (
        <UpsertMeasurement
          metric={metric}
          measurement={measurements.find((m) => m.id === measurementId)}
          onSaved={async () => {
            await onSaved();
          }}
        />
      ),
      onClose: () => {
        navigate(`/metrics/${metric.id}`);
      },
    });
  }, []);

  return null;
};

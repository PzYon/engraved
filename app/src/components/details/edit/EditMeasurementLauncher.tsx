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
}> = ({ metric, measurements }) => {
  const { renderDialog } = useDialogContext();
  const { measurementId } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    if (!measurements?.length) {
      return;
    }

    renderDialog({
      title: "Edit Measurement",
      render: (closeDialog) => (
        <UpsertMeasurement
          metric={metric}
          measurement={measurements.find((m) => m.id === measurementId)}
          onSaved={async () => {
            closeDialog();
            goToMetric();
          }}
          onCancel={closeDialog}
        />
      ),
      onClose: () => {
        goToMetric();
      },
    });
  }, [measurements]);

  return null;

  function goToMetric() {
    navigate(`/metrics/${metric.id}`);
  }
};

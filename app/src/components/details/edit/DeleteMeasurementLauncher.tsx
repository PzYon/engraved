import React, { useEffect } from "react";
import { IMetric } from "../../../serverApi/IMetric";
import { useDialogContext } from "../../layout/dialogs/DialogContext";
import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";
import { Typography } from "@mui/material";
import { useDeleteMeasurementMutation } from "../../../serverApi/reactQuery/mutations/useDeleteMeasurementMutation";
import { DeleteButtons } from "../../common/DeleteButtons";
import { MetricType } from "../../../serverApi/MetricType";

export const DeleteMeasurementLauncher: React.FC<{
  metric: IMetric;
  onDeleted?: () => void;
}> = ({ metric, onDeleted }) => {
  const { renderDialog } = useDialogContext();
  const { measurementId } = useParams();

  const navigate = useNavigate();

  const deleteMeasurementMutation = useDeleteMeasurementMutation(
    metric.id,
    measurementId
  );

  useEffect(() => {
    renderDialog({
      title: "Delete Measurement",
      render: (closeDialog) => {
        return (
          <>
            <Typography>
              Are you sure you want to delete this <b>scrap</b>? You will not be
              able to recover it.
            </Typography>
            <DeleteButtons
              entityType={"measurement"}
              requiresConfirmation={metric.type === MetricType.Scraps}
              onDelete={() => deleteMeasurement(closeDialog)}
              onCancel={closeDialog}
            />
          </>
        );
      },
      onClose: () => {
        navigate(`/metrics/${metric.id}`);
      },
    });
  }, []);

  return null;

  function deleteMeasurement(closeDialog: () => void) {
    deleteMeasurementMutation.mutate();

    if (onDeleted) {
      onDeleted();
    }

    closeDialog();
  }
};

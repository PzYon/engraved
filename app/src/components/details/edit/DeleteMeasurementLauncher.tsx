import React, { useEffect } from "react";
import { IMetric } from "../../../serverApi/IMetric";
import { useDialogContext } from "../../layout/dialogs/DialogContext";
import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";
import { Button, Typography } from "@mui/material";
import { useDeleteMeasurementMutation } from "../../../serverApi/reactQuery/mutations/useDeleteMeasurementMutation";
import { FormButtonContainer } from "../../common/FormButtonContainer";

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
              Are you sure you want to delete this measurement? You will not be
              able to recover it.
            </Typography>
            <FormButtonContainer>
              <Button variant="contained" onClick={closeDialog}>
                No
              </Button>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => deleteMeasurement(closeDialog)}
              >
                Yes, delete!
              </Button>
            </FormButtonContainer>
          </>
        );
      },
      onClose: () => {
        navigate(`/metrics/${metric.id}`);
      },
    });
  }, []);

  return null;

  async function deleteMeasurement(closeDialog: () => void) {
    deleteMeasurementMutation.mutate();

    if (onDeleted) {
      await onDeleted();
    }

    closeDialog();
  }
};

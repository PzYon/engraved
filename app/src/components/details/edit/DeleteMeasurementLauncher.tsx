import React, { useEffect } from "react";
import { IMetric } from "../../../serverApi/IMetric";
import { useDialogContext } from "../../layout/dialogs/DialogContext";
import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";
import { Button, Typography } from "@mui/material";
import { ServerApi } from "../../../serverApi/ServerApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeysFactory } from "../../../serverApi/queryKeysFactory";

export const DeleteMeasurementLauncher: React.FC<{
  metric: IMetric;
  onDeleted?: () => void;
}> = ({ metric, onDeleted }) => {
  const { renderDialog } = useDialogContext();
  const { measurementId } = useParams();

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const deleteMeasurementMutation = useMutation({
    mutationKey: queryKeysFactory.deleteMeasurement(metric.id, measurementId),
    mutationFn: (variables: { measurementId: string }) => {
      return ServerApi.deleteMeasurement(variables.measurementId);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries(queryKeysFactory.metric(metric.id));
    },
  });

  useEffect(() => {
    renderDialog({
      title: "Delete Measurement",
      render: (closeDialog) => {
        return (
          <>
            <Typography>Are you sure?</Typography>
            <Button variant="outlined" onClick={closeDialog}>
              No
            </Button>
            <Button
              variant="text"
              color="primary"
              onClick={() => deleteMeasurement(closeDialog)}
            >
              Yes
            </Button>
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
    deleteMeasurementMutation.mutate({ measurementId: measurementId });

    if (onDeleted) {
      await onDeleted();
    }

    closeDialog();
  }
};

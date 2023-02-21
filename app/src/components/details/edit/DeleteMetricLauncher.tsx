import React, { useEffect } from "react";
import { IMetric } from "../../../serverApi/IMetric";
import { useDialogContext } from "../../layout/dialogs/DialogContext";
import { useNavigate } from "react-router-dom";
import { Button, Typography } from "@mui/material";
import { ServerApi } from "../../../serverApi/ServerApi";
import { useMutation } from "@tanstack/react-query";
import { queryKeysFactory } from "../../../serverApi/queryKeysFactory";

export const DeleteMetricLauncher: React.FC<{
  metric: IMetric;
  onDeleted: () => void;
}> = ({ metric, onDeleted }) => {
  const { renderDialog } = useDialogContext();

  const navigate = useNavigate();

  const deleteMetricMutation = useMutation({
    mutationKey: queryKeysFactory.deleteMetric(metric.id),
    mutationFn: async () => {
      await ServerApi.deleteMetric(metric.id);
    },
    onSuccess: async (_, variables: { closeDialog: () => void }) => {
      variables.closeDialog();
      await onDeleted();
    },
  });

  useEffect(() => {
    renderDialog({
      title: "Delete Metric",
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
              onClick={() => deleteMetricMutation.mutate({ closeDialog })}
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
};

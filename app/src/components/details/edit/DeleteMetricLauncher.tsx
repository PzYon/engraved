import React, { useEffect } from "react";
import { IMetric } from "../../../serverApi/IMetric";
import { useDialogContext } from "../../layout/dialogs/DialogContext";
import { useNavigate } from "react-router-dom";
import { Button, Typography } from "@mui/material";
import { useDeleteMetricMutation } from "../../../serverApi/reactQuery/mutations/useDeleteMetricMutation";

export const DeleteMetricLauncher: React.FC<{
  metric: IMetric;
  onDeleted: () => void;
}> = ({ metric, onDeleted }) => {
  const { renderDialog } = useDialogContext();

  const navigate = useNavigate();

  const deleteMetricMutation = useDeleteMetricMutation(metric.id);

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
              onClick={() =>
                deleteMetricMutation.mutate({
                  onSuccess: async () => {
                    closeDialog();
                    await onDeleted();
                  },
                })
              }
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

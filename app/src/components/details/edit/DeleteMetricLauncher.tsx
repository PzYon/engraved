import React, { useEffect } from "react";
import { IMetric } from "../../../serverApi/IMetric";
import { useDialogContext } from "../../layout/dialogs/DialogContext";
import { useNavigate } from "react-router-dom";
import { Typography } from "@mui/material";
import { useDeleteMetricMutation } from "../../../serverApi/reactQuery/mutations/useDeleteMetricMutation";
import { SafeDeleteButton } from "../../common/SafeDeleteButton";

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
            <Typography>
              Are you sure you want to delete &apos;{metric.name}&apos;? You
              will not be able to recover this metric and all its measurements.
            </Typography>
            <SafeDeleteButton
              onDelete={() =>
                deleteMetricMutation.mutate({
                  onSuccess: async () => {
                    closeDialog();
                    await onDeleted();
                  },
                })
              }
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
};

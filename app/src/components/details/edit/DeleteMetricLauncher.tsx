import React, { useEffect } from "react";
import { IMetric } from "../../../serverApi/IMetric";
import { useDialogContext } from "../../layout/dialogs/DialogContext";
import { useNavigate } from "react-router-dom";
import { Button, Typography } from "@mui/material";
import { ServerApi } from "../../../serverApi/ServerApi";

export const DeleteMetricLauncher: React.FC<{
  metric: IMetric;
  onDeleted: () => void;
}> = ({ metric, onDeleted }) => {
  const { renderDialog } = useDialogContext();

  const navigate = useNavigate();

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
              onClick={() => deleteMetric(closeDialog)}
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

  async function deleteMetric(closeDialog: () => void) {
    await ServerApi.deleteMetric(metric.id);
    closeDialog();
    await onDeleted();
  }
};

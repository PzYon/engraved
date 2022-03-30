import React, { useEffect } from "react";
import { AddMetric } from "./AddMetric";
import { useDialogContext } from "../layout/dialogs/DialogContext";
import { useNavigate } from "react-router-dom";

export const AddMetricLauncher: React.FC = () => {
  const { renderDialog } = useDialogContext();

  const navigate = useNavigate();

  useEffect(() => {
    renderDialog({
      isFullScreen: true,
      title: "Create Metric",
      render: (closeDialog: () => void) => <AddMetric onAdded={closeDialog} />,
      onClose: () => navigate(`/metrics`),
    });
  }, []);

  return null;
};

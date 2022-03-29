import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AddMetric } from "./AddMetric";
import { useDialogContext } from "../layout/dialogs/DialogContext";

export const AddMetricLauncher: React.FC = () => {
  const { renderDialog } = useDialogContext();

  const navigate = useNavigate();

  useEffect(() => {
    renderDialog({
      isFullScreen: true,
      title: "Create Metric",
      render: () => <AddMetric />,
      onClose: () => navigate(`/metrics`),
    });
  }, []);

  return null;
};

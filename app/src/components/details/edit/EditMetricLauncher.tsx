import React, { useEffect } from "react";
import { IMetric } from "../../../serverApi/IMetric";
import { useDialogContext } from "../../layout/dialogs/DialogContext";
import { useNavigate } from "react-router-dom";
import { EditMetric } from "./EditMetric";

export const EditMetricLauncher: React.FC<{ metric: IMetric }> = ({
  metric,
}) => {
  const { renderDialog } = useDialogContext();

  const navigate = useNavigate();

  useEffect(() => {
    renderDialog({
      isFullScreen: true,
      title: "Edit " + metric.name,
      render: () => <EditMetric metric={metric} />,
      onClose: () => {
        navigate(`/metrics/${metric.key}`);
      },
    });
  }, []);

  return null;
};

import { IMetric } from "../../../serverApi/IMetric";
import { useDialogContext } from "../../layout/dialogs/DialogContext";
import { useNavigate } from "react-router-dom";
import React, { useEffect } from "react";
import { EditMetricPermissions } from "./EditMetricPermissions";

export const EditMetricPermissionsLauncher: React.FC<{ metric: IMetric }> = ({
  metric,
}) => {
  const { renderDialog } = useDialogContext();

  const navigate = useNavigate();

  useEffect(() => {
    renderDialog({
      title: "Permissions",
      render: () => <EditMetricPermissions metric={metric} />,
      onClose: () => {
        navigate(`/metrics/${metric.id}`);
      },
    });
  }, []);

  return null;
};

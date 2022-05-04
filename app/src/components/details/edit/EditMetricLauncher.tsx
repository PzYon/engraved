import React, { useEffect } from "react";
import { IMetric } from "../../../serverApi/IMetric";
import { useDialogContext } from "../../layout/dialogs/DialogContext";
import { useNavigate } from "react-router-dom";
import { EditMetric } from "./EditMetric";

export const EditMetricLauncher: React.FC<{
  metric: IMetric;
  reloadMetric: () => Promise<void>;
}> = ({ metric, reloadMetric }) => {
  const { renderDialog } = useDialogContext();

  const navigate = useNavigate();

  useEffect(() => {
    renderDialog({
      isFullScreen: true,
      title: "Edit " + metric.name,
      render: () => (
        <EditMetric
          metric={metric}
          onSaved={async () => {
            await reloadMetric();
          }}
        />
      ),
      onClose: () => {
        navigate(`/metrics/${metric.id}`);
      },
    });
  }, []);

  return null;
};

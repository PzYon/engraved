import React, { useMemo } from "react";
import { IMetric } from "../../serverApi/IMetric";
import { useDialogContext } from "../layout/dialogs/DialogContext";
import { HeaderActions, IAction } from "../layout/HeaderActions";
import { AddOutlined, VisibilityOutlined } from "@mui/icons-material";
import { renderAddMeasurementDialog } from "../details/add/renderAddMeasurementDialog";

export const MetricListHeaderActions: React.FC<{ metric: IMetric }> = ({
  metric,
}) => {
  const { renderDialog } = useDialogContext();

  const actions = useMemo<IAction[]>(
    () => [
      {
        key: "add_measurement",
        label: "Add Measurement",
        icon: <AddOutlined />,
        onClick: () => renderAddMeasurementDialog(renderDialog, metric),
      },
      {
        key: "view",
        label: "View",
        icon: <VisibilityOutlined />,
        href: `/metrics/${metric.key}`,
      },
    ],
    [metric]
  );

  return <HeaderActions actions={actions} />;
};

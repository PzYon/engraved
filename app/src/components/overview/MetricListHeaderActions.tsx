import React, { useMemo } from "react";
import { IMetric } from "../../serverApi/IMetric";
import { useDialogContext } from "../layout/dialogs/DialogContext";
import { HeaderActions, IAction } from "../layout/HeaderActions";
import { AddOutlined, Edit, VisibilityOutlined } from "@mui/icons-material";
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
        onClick: () => renderAddMeasurementDialog(metric, renderDialog),
      },
      {
        key: "edit",
        label: "Edit",
        icon: <Edit />,
        href: `/metrics/${metric.key}/edit`,
      },
    ],
    [metric]
  );

  return <HeaderActions actions={actions} />;
};

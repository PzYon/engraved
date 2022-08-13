import React, { useMemo } from "react";
import { IMetric } from "../../serverApi/IMetric";
import { useDialogContext } from "../layout/dialogs/DialogContext";
import { HeaderActions } from "../layout/HeaderActions";
import { AddOutlined, EditOutlined } from "@mui/icons-material";
import { renderAddMeasurementDialog } from "../details/add/renderAddMeasurementDialog";
import { IIconButtonAction } from "../common/IconButtonWrapper";

export const MetricHeaderActions: React.FC<{ metric: IMetric }> = ({
  metric,
}) => {
  const { renderDialog } = useDialogContext();

  const actions = useMemo<IIconButtonAction[]>(
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
        icon: <EditOutlined />,
        href: `/metrics/${metric.id}/edit`,
      },
    ],
    [metric]
  );

  return <HeaderActions actions={actions} enableFloatingActions={false} />;
};

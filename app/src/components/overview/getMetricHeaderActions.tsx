import { IMetric } from "../../serverApi/IMetric";
import { IDialogProps } from "../layout/dialogs/DialogContext";
import { AddOutlined, EditOutlined, ShareOutlined } from "@mui/icons-material";
import { renderAddMeasurementDialog } from "../details/add/renderAddMeasurementDialog";
import { IIconButtonAction } from "../common/IconButtonWrapper";

export function getMetricHeaderActions(
  metric: IMetric,
  renderDialog: (dialogProps: IDialogProps) => void,
  onMeasurementAdded?: () => void
): IIconButtonAction[] {
  if (!metric) {
    return [];
  }

  return [
    {
      key: "add_measurement",
      label: "Add Measurement",
      icon: <AddOutlined />,
      onClick: () =>
        renderAddMeasurementDialog(metric, renderDialog, onMeasurementAdded),
    },
    {
      key: "edit",
      label: "Edit",
      icon: <EditOutlined />,
      href: `/metrics/${metric.id}/edit`,
    },
    {
      key: "permissions",
      label: "Permissions",
      icon: <ShareOutlined />,
      href: `/metrics/${metric.id}/permissions`,
    },
  ];
}

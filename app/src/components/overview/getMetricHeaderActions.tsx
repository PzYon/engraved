import { IMetric } from "../../serverApi/IMetric";
import { IDialogProps } from "../layout/dialogs/DialogContext";
import { AddOutlined, EditOutlined, ShareOutlined } from "@mui/icons-material";
import { renderAddMeasurementDialog } from "../details/add/renderAddMeasurementDialog";
import { IIconButtonAction } from "../common/IconButtonWrapper";
import { MetricType } from "../../serverApi/MetricType";

export function getMetricHeaderActions(
  metric: IMetric,
  renderDialog?: (dialogProps: IDialogProps) => void,
  onMeasurementAdded?: () => void
): IIconButtonAction[] {
  if (!metric) {
    return [];
  }

  const actions = [];

  if (metric.type !== MetricType.Notes) {
    actions.push({
      key: "add_measurement",
      label: "Add Measurement",
      icon: <AddOutlined />,
      onClick: () =>
        renderAddMeasurementDialog(metric, renderDialog, onMeasurementAdded),
    });
  }

  actions.push(
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
    }
  );

  return actions;
}

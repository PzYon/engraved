import { IMetric } from "../../serverApi/IMetric";
import { IDialogProps } from "../layout/dialogs/DialogContext";
import {
  AddOutlined,
  Close,
  DeleteOutlined,
  EditOutlined,
  SaveOutlined,
  ShareOutlined,
} from "@mui/icons-material";
import { renderAddMeasurementDialog } from "../details/add/renderAddMeasurementDialog";
import { IIconButtonAction } from "../common/IconButtonWrapper";
import { MetricType } from "../../serverApi/MetricType";

export const editActionKey = "edit";

export function getCommonEditModeActions(
  onCancel: () => void,
  onSave: () => void,
  disableSave?: boolean
): IIconButtonAction[] {
  return [
    {
      key: "cancel",
      label: "Cancel",
      icon: <Close fontSize="small" />,
      onClick: onCancel,
    },
    {
      key: "save",
      label: "Save",
      icon: <SaveOutlined fontSize="small" />,
      onClick: onSave,
      isDisabled: disableSave,
    },
  ];
}

export function getCommonActions(
  metric: IMetric,
  renderDialog?: (dialogProps: IDialogProps) => void
): IIconButtonAction[] {
  if (!metric) {
    return [];
  }

  const actions = [];

  if (metric.type !== MetricType.Scraps) {
    actions.push({
      key: "add_measurement",
      label: "Add Measurement",
      icon: <AddOutlined fontSize="small" />,
      onClick: () => renderAddMeasurementDialog(metric, renderDialog),
    });
  }

  actions.push(
    {
      key: editActionKey,
      label: "Edit",
      icon: <EditOutlined fontSize="small" />,
      href: `/metrics/${metric.id}/edit`,
    },
    {
      key: "permissions",
      label: "Permissions",
      icon: <ShareOutlined fontSize="small" />,
      href: `/metrics/${metric.id}/permissions`,
    },
    {
      key: "delete",
      label: "Delete",
      icon: <DeleteOutlined fontSize="small" />,
      href: `/metrics/${metric.id}/delete`,
    }
  );

  return actions;
}

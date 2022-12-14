import { IMetric } from "../../serverApi/IMetric";
import { IDialogProps } from "../layout/dialogs/DialogContext";
import {
  AddOutlined,
  Close,
  EditOutlined,
  SaveOutlined,
  ShareOutlined,
} from "@mui/icons-material";
import { renderAddMeasurementDialog } from "../details/add/renderAddMeasurementDialog";
import { IIconButtonAction } from "../common/IconButtonWrapper";
import { MetricType } from "../../serverApi/MetricType";
import { NavigateFunction } from "react-router-dom";

export const editActionKey = "edit";

export function getCommonEditModeActions(
  navigate: NavigateFunction,
  onSave: () => void,
  disableSave?: boolean
): IIconButtonAction[] {
  return [
    {
      key: "cancel",
      label: "Cancel",
      icon: <Close fontSize="small" />,
      onClick: () => navigate("./.."),
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
      icon: <AddOutlined fontSize="small" />,
      onClick: () =>
        renderAddMeasurementDialog(metric, renderDialog, onMeasurementAdded),
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
    }
  );

  return actions;
}

import { IMetric } from "../../serverApi/IMetric";
import { IDialogProps } from "../layout/dialogs/DialogContext";
import { ActionFactory, IIconButtonAction } from "../common/IconButtonWrapper";
import { MetricType } from "../../serverApi/MetricType";

export const editActionKey = "edit";

export function getCommonEditModeActions(
  onCancel: () => void,
  onSave: () => Promise<void>,
  disableSave?: boolean
): IIconButtonAction[] {
  return [
    ActionFactory.cancel(onCancel),
    ActionFactory.save(onSave, disableSave),
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
    actions.push(ActionFactory.addMeasurement(metric, renderDialog));
  }

  actions.push(
    ActionFactory.editMetric(metric.id),
    ActionFactory.editMetricPermissions(metric.id),
    ActionFactory.deleteMetric(metric.id)
  );

  return actions;
}

import { IJournal } from "../../serverApi/IJournal";
import { IDialogProps } from "../layout/dialogs/DialogContext";
import { JournalType } from "../../serverApi/JournalType";
import { ActionFactory } from "../common/actions/ActionFactory";
import { IAction } from "../common/actions/IAction";

export const editActionKey = "edit";

export function getCommonActions(
  metric: IJournal,
  enableHotkeys: boolean,
  renderDialog?: (dialogProps: IDialogProps) => void,
): IAction[] {
  if (!metric) {
    return [];
  }

  const actions = [];

  if (metric.type !== JournalType.Scraps) {
    actions.push(ActionFactory.addEntry(metric, renderDialog, enableHotkeys));
  }

  actions.push(
    ActionFactory.editJournal(metric.id, enableHotkeys),
    ActionFactory.editJournalPermissions(metric.id),
    ActionFactory.deleteJournal(metric.id, enableHotkeys),
  );

  return actions;
}

export function getCommonEditModeActions(
  onCancel: () => void,
  onSave: () => Promise<void>,
  disableSave?: boolean,
): IAction[] {
  return [
    ActionFactory.cancel(onCancel),
    ActionFactory.save(onSave, disableSave, true),
  ];
}

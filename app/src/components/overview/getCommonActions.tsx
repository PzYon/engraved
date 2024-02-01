import { IJournal } from "../../serverApi/IJournal";
import { IDialogProps } from "../layout/dialogs/DialogContext";
import { ActionFactory } from "../common/actions/ActionFactory";
import { IAction } from "../common/actions/IAction";

export function getCommonActions(
  journal: IJournal,
  enableHotkeys: boolean,
  renderDialog?: (dialogProps: IDialogProps) => void,
): IAction[] {
  if (!journal) {
    return [];
  }

  return [
    ActionFactory.addEntry(journal, renderDialog, enableHotkeys),
    ActionFactory.editJournalPermissions(journal.id),
    ActionFactory.editJournalSchedule(journal.id, enableHotkeys),
    ActionFactory.editJournal(journal.id, enableHotkeys),
    ActionFactory.deleteJournal(journal.id, enableHotkeys),
  ];
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

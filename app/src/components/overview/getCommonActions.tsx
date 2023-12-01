import { IJournal } from "../../serverApi/IJournal";
import { IDialogProps } from "../layout/dialogs/DialogContext";
import { JournalType } from "../../serverApi/JournalType";
import { ActionFactory } from "../common/actions/ActionFactory";
import { IAction } from "../common/actions/IAction";

export const editActionKey = "edit";

export function getCommonActions(
  journal: IJournal,
  enableHotkeys: boolean,
  renderDialog?: (dialogProps: IDialogProps) => void,
): IAction[] {
  if (!journal) {
    return [];
  }

  const actions = [];

  if (journal.type !== JournalType.Scraps) {
    actions.push(ActionFactory.addEntry(journal, renderDialog, enableHotkeys));
  }

  actions.push(
    ActionFactory.editJournalPermissions(journal.id),
    ActionFactory.editJournal(journal.id, enableHotkeys),
    ActionFactory.deleteJournal(journal.id, enableHotkeys),
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

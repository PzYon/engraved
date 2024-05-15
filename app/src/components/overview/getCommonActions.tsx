import { IJournal } from "../../serverApi/IJournal";
import { IDialogProps } from "../layout/dialogs/DialogContext";
import { ActionFactory } from "../common/actions/ActionFactory";
import { IAction } from "../common/actions/IAction";
import { IUser } from "../../serverApi/IUser";
import { getScheduleForUser } from "./scheduled/scheduleUtils";

export function getCommonActions(
  journal: IJournal,
  enableHotkeys: boolean,
  user: IUser,
  renderDialog?: (dialogProps: IDialogProps) => void,
): IAction[] {
  if (!journal) {
    return [];
  }

  const actions: IAction[] = [];

  if (renderDialog) {
    actions.push(ActionFactory.addEntry(journal, renderDialog, enableHotkeys));
  }

  actions.push(
    ActionFactory.editJournalPermissions(journal.id),
    ActionFactory.editJournalSchedule(
      journal.id,
      renderDialog,
      journal,
      enableHotkeys,
    ),
    ActionFactory.editJournal(journal.id, enableHotkeys),
    ActionFactory.deleteJournal(journal.id, enableHotkeys),
  );

  if (getScheduleForUser(journal, user.id).nextOccurrence) {
    actions.push(
      ActionFactory.markJournalScheduleAsDone(
        journal,
        renderDialog,
        enableHotkeys,
      ),
    );
  }

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

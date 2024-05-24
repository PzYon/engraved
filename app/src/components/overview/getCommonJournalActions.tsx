import { IJournal } from "../../serverApi/IJournal";
import { ActionFactory } from "../common/actions/ActionFactory";
import { IAction } from "../common/actions/IAction";
import { IUser } from "../../serverApi/IUser";
import { getScheduleForUser } from "./scheduled/scheduleUtils";

export function getCommonJournalActions(
  journal: IJournal,
  enableHotkeys: boolean,
  user: IUser,
  isDetails: boolean,
  showAddEntry?: boolean,
): IAction[] {
  if (!journal) {
    return [];
  }

  const actions: IAction[] = [];

  if (showAddEntry) {
    actions.push(ActionFactory.addEntry(journal, isDetails, enableHotkeys));
  }

  actions.push(
    ActionFactory.editJournalPermissions(journal.id, isDetails),
    ActionFactory.editJournalSchedule(journal.id, isDetails, enableHotkeys),
  );

  if (getScheduleForUser(journal, user.id).nextOccurrence) {
    actions.push(
      ActionFactory.markJournalScheduleAsDone(
        journal,
        isDetails,
        enableHotkeys,
      ),
    );
  }
  actions.push(
    ActionFactory.editJournal(journal.id, enableHotkeys),
    ActionFactory.deleteJournal(journal.id, isDetails, enableHotkeys),
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

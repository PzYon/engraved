import { IJournal } from "../../serverApi/IJournal";
import { ActionFactory } from "../common/actions/ActionFactory";
import { IAction } from "../common/actions/IAction";
import { IUser } from "../../serverApi/IUser";
import { getScheduleForUser } from "./scheduled/scheduleUtils";

export function getCommonJournalActions(
  journal: IJournal,
  enableHotkeys: boolean,
  user: IUser,
): IAction[] {
  if (!journal) {
    return [];
  }

  const actions: IAction[] = [
    ActionFactory.addEntry(journal, enableHotkeys),
    ActionFactory.editJournalPermissions(journal.id),
    ActionFactory.editJournalSchedule(journal.id, enableHotkeys),
  ];

  if (getScheduleForUser(journal, user.id).nextOccurrence) {
    actions.push(
      ActionFactory.markJournalScheduleAsDone(journal, enableHotkeys),
    );
  }
  actions.push(
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

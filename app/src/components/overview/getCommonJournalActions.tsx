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

  const journalId = journal.id ?? "";

  return [
    ActionFactory.addEntry(journal, enableHotkeys),
    ActionFactory.editJournalPermissions(journalId),
    ActionFactory.editJournalSchedule(
      journalId,
      enableHotkeys,
      !!getScheduleForUser(journal, user.id ?? "").nextOccurrence,
    ),
    ActionFactory.editJournal(journalId, enableHotkeys),
    ActionFactory.deleteJournal(journalId, enableHotkeys),
    ActionFactory.showRelatedItems(journalId),
  ];
}

export function getCommonEditModeActions(
  onCancel: () => void,
  onSave: () => Promise<void>,
  disableSave?: boolean,
): IAction[] {
  return [
    ActionFactory.cancel(onCancel),
    ActionFactory.save(onSave, disableSave ?? false, true),
  ];
}

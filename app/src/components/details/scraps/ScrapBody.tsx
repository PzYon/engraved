import React from "react";
import { IScrapEntry } from "../../../serverApi/IScrapEntry";
import { ActionFactory } from "../../common/actions/ActionFactory";
import { IAction } from "../../common/actions/IAction";
import { Entry } from "../../common/entries/Entry";
import { JournalType } from "../../../serverApi/JournalType";

export const ScrapBody: React.FC<{
  scrap: IScrapEntry;
  hideDate: boolean;
  hideActions: boolean;
  editMode: boolean;
  setEditMode: (value: boolean) => void;
  children: React.ReactNode;
  actions: IAction[];
  onSave: () => Promise<void>;
  cancelEditing: () => void;
  enableHotkeys?: boolean;
}> = ({
  scrap,
  // hideDate,
  hideActions,
  editMode,
  setEditMode,
  children,
  actions,
  onSave,
  cancelEditing,
  enableHotkeys,
}) => {
  const allActions = getActions(enableHotkeys);

  return (
    <Entry
      journalId={scrap.parentId}
      journalName={"TODO"}
      journalType={JournalType.Scraps}
      entry={scrap}
      actions={allActions}
    >
      {children}
    </Entry>
  );

  function getActions(enableHotkeys: boolean) {
    if (hideActions) {
      return [];
    }

    const allActions = [
      ...actions,
      ActionFactory.moveToAnotherScrap(scrap),
      ActionFactory.editEntitySchedule(scrap.parentId, scrap.id),
      editMode
        ? ActionFactory.save(async () => await onSave(), false, enableHotkeys)
        : ActionFactory.editScrap(() => setEditMode(true), enableHotkeys),
    ];

    if (cancelEditing) {
      allActions.push(
        ActionFactory.cancelEditing(cancelEditing, enableHotkeys),
      );
    }

    if (scrap.id) {
      allActions.push(ActionFactory.deleteEntry(scrap));
    }

    return allActions;
  }
};

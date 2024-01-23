import React from "react";
import { FormatDate } from "../../common/FormatDate";
import { IScrapEntry } from "../../../serverApi/IScrapEntry";
import { ActionFactory } from "../../common/actions/ActionFactory";
import { IAction } from "../../common/actions/IAction";
import { getScheduleProperty } from "../../scheduled/scheduleUtils";
import { FooterStuff } from "../../common/FooterStuff";

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
    <>
      {children}

      <FooterStuff
        actions={allActions}
        properties={[
          getScheduleProperty(scrap.schedule?.nextOccurrence),
          {
            key: "date",
            node: () => <FormatDate value={scrap.editedOn || scrap.dateTime} />,
            label: "Edited",
          },
        ]}
      ></FooterStuff>
    </>
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

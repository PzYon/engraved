import React from "react";
import { ActionFactory } from "../../common/actions/ActionFactory";
import { IAction } from "../../common/actions/IAction";
import { Entry } from "../../common/entries/Entry";
import { JournalType } from "../../../serverApi/JournalType";
import { useDialogContext } from "../../layout/dialogs/DialogContext";
import { useScrapContext } from "./ScrapContext";

export const ScrapBody: React.FC<{
  hideActions: boolean;
  children: React.ReactNode;
  actions: IAction[];
  enableHotkeys?: boolean;
}> = ({ hideActions, children, actions, enableHotkeys }) => {
  const { renderDialog } = useDialogContext();
  const {
    isEditMode,
    setIsEditMode,
    isDirty,
    getCancelEditingFunction,
    upsertScrap,
    scrapToRender,
    propsRenderStyle,
    journalName,
  } = useScrapContext();

  const allActions = getActions();

  return (
    <Entry
      journalId={scrapToRender.parentId}
      journalType={JournalType.Scraps}
      entry={scrapToRender}
      actions={allActions}
      propsRenderStyle={propsRenderStyle}
      journalName={journalName}
    >
      {children}
    </Entry>
  );

  function getActions() {
    if (hideActions) {
      return [];
    }

    const allActions = [
      ...actions,
      ActionFactory.moveToAnotherScrap(scrapToRender),
      ActionFactory.editEntitySchedule(
        scrapToRender.parentId,
        scrapToRender.id,
      ),
      isEditMode
        ? ActionFactory.save(
            async () => await upsertScrap(),
            false,
            enableHotkeys,
          )
        : ActionFactory.editScrap(() => setIsEditMode(true), enableHotkeys),
    ];

    const cancelEditing = getCancelEditingFunction();

    if (cancelEditing) {
      allActions.push(
        ActionFactory.cancelEditing(
          cancelEditing,
          enableHotkeys,
          isDirty,
          renderDialog,
        ),
      );
    }

    if (scrapToRender.id) {
      allActions.push(ActionFactory.deleteEntry(scrapToRender));
    }

    return allActions;
  }
};

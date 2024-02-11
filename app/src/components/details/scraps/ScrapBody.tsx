import React from "react";
import { ActionFactory } from "../../common/actions/ActionFactory";
import { IAction } from "../../common/actions/IAction";
import { Entry } from "../../common/entries/Entry";
import { JournalType } from "../../../serverApi/JournalType";
import { useDialogContext } from "../../layout/dialogs/DialogContext";
import { useScrapContext } from "./ScrapContext";

export const ScrapBody: React.FC<{
  children: React.ReactNode;
  actions: IAction[];
  enableHotkeys?: boolean;
}> = ({ children, actions, enableHotkeys }) => {
  const { renderDialog } = useDialogContext();
  const {
    isEditMode,
    setIsEditMode,
    isDirty,
    getCancelEditingFunction,
    upsertScrap,
    scrapToRender,
    propsRenderStyle,
    actionsRenderStyle,
    journalName,
  } = useScrapContext();

  return (
    <Entry
      journalId={scrapToRender.parentId}
      journalType={JournalType.Scraps}
      entry={scrapToRender}
      actions={getActions()}
      propsRenderStyle={propsRenderStyle}
      journalName={journalName}
    >
      {children}
    </Entry>
  );

  function getActions() {
    if (actionsRenderStyle === "none") {
      return [];
    }

    const saveAction = isEditMode
      ? ActionFactory.save(
          async () => await upsertScrap(),
          false,
          enableHotkeys,
        )
      : ActionFactory.editScrap(() => setIsEditMode(true), enableHotkeys);

    if (actionsRenderStyle === "save-only") {
      if (saveAction) {
        return [saveAction];
      } else {
        return [];
      }
    }

    const allActions = [
      ...actions,
      ActionFactory.moveToAnotherScrap(scrapToRender),
      ActionFactory.editEntitySchedule(
        scrapToRender.parentId,
        scrapToRender.id,
      ),
      saveAction,
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

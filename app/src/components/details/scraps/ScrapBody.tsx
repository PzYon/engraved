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
}> = ({ children, actions }) => {
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
    hasFocus,
  } = useScrapContext();

  return (
    <Entry
      hasFocus={hasFocus}
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
      ? ActionFactory.save(async () => await upsertScrap(), false, hasFocus)
      : ActionFactory.editScrap(() => setIsEditMode(true), hasFocus);

    if (actionsRenderStyle === "save-only") {
      return saveAction ? [saveAction] : [];
    }

    const allActions = [
      ...actions,
      ActionFactory.moveToAnotherScrap(scrapToRender),
      ActionFactory.editEntrySchedule(scrapToRender.parentId, scrapToRender.id),
      saveAction,
    ];

    const cancelEditing = getCancelEditingFunction();

    if (cancelEditing) {
      allActions.push(
        ActionFactory.cancelEditing(
          cancelEditing,
          hasFocus,
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

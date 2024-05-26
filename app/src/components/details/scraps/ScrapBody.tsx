import React from "react";
import { ActionFactory } from "../../common/actions/ActionFactory";
import { IAction } from "../../common/actions/IAction";
import { Entry } from "../../common/entries/Entry";
import { JournalType } from "../../../serverApi/JournalType";
import { useDialogContext } from "../../layout/dialogs/DialogContext";
import { useScrapContext } from "./ScrapContext";
import { useAppContext } from "../../../AppContext";
import { getScheduleForUser } from "../../overview/scheduled/scheduleUtils";
import { useDisplayModeContext } from "../../overview/overviewList/DisplayModeContext";

export const ScrapBody: React.FC<{
  children: React.ReactNode;
  actions: IAction[];
}> = ({ children, actions }) => {
  const { renderDialog } = useDialogContext();
  const { user } = useAppContext();

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
    giveFocus,
  } = useScrapContext();

  const { isCompact } = useDisplayModeContext();

  return (
    <Entry
      hasFocus={hasFocus}
      journalId={scrapToRender.parentId}
      journalType={JournalType.Scraps}
      entry={scrapToRender}
      actions={getActions()}
      propsRenderStyle={propsRenderStyle}
      journalName={journalName}
      giveFocus={giveFocus}
    >
      {isCompact && !hasFocus ? null : children}
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
    ];

    if (!isEditMode) {
      allActions.push(
        ActionFactory.editEntryScheduleViaUrl(scrapToRender.id, hasFocus),
      );

      if (getScheduleForUser(scrapToRender, user.id).nextOccurrence) {
        allActions.push(
          ActionFactory.markEntryScheduleAsDone(scrapToRender, hasFocus),
        );
      }
    }

    allActions.push(saveAction);

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
      allActions.push(ActionFactory.deleteEntry(scrapToRender, hasFocus));
    }

    return allActions;
  }
};

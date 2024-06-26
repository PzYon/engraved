import React from "react";
import { ActionFactory } from "../../common/actions/ActionFactory";
import { IAction } from "../../common/actions/IAction";
import { Entry } from "../../common/entries/Entry";
import { useScrapContext } from "./ScrapContext";
import { useAppContext } from "../../../AppContext";
import {
  getScheduleForUser,
  getSchedulePropertyFromSchedule,
} from "../../overview/scheduled/scheduleUtils";
import { useDisplayModeContext } from "../../overview/overviewList/DisplayModeContext";

export const ScrapBody: React.FC<{
  children: React.ReactNode;
  actions: IAction[];
}> = ({ children, actions }) => {
  const { user } = useAppContext();

  const {
    isEditMode,
    setIsEditMode,
    cancelEditingAction,
    upsertScrap,
    scrapToRender,
    propsRenderStyle,
    actionsRenderStyle,
    journal,
    hasFocus,
    giveFocus,
    parsedDate,
  } = useScrapContext();

  const { isCompact } = useDisplayModeContext();

  return (
    <Entry
      hasFocus={hasFocus}
      journal={journal}
      entry={scrapToRender}
      actions={getActions()}
      propsRenderStyle={propsRenderStyle}
      giveFocus={giveFocus}
      propertyOverrides={
        parsedDate?.date
          ? [
              getSchedulePropertyFromSchedule({
                nextOccurrence: parsedDate.date.toString(),
                recurrence: parsedDate.recurrence,
              }),
            ]
          : []
      }
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

    if (cancelEditingAction) {
      allActions.push(cancelEditingAction);
    }

    if (scrapToRender.id) {
      allActions.push(ActionFactory.deleteEntry(scrapToRender, hasFocus));
    }

    return allActions;
  }
};

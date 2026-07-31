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
import { IPropertyDefinition } from "../../common/IPropertyDefinition";
import { ScrapFiles } from "./files/ScrapFiles";
import { useAddFileAction } from "./files/useAddFileAction";

export const ScrapBody: React.FC<{
  children: React.ReactNode;
  actions: IAction[];
  properties?: IPropertyDefinition[];
}> = ({ children, actions, properties = [] }) => {
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
    parsedDate,
  } = useScrapContext();

  const { isCompact } = useDisplayModeContext();

  const { action: addFileAction, fileInput } = useAddFileAction();

  return (
    <Entry
      isEditMode={isEditMode}
      hasFocus={hasFocus}
      journal={journal}
      entry={scrapToRender}
      actions={getActions().filter((a): a is IAction => a != null)}
      propsRenderStyle={propsRenderStyle}
      noCompactFooter={!scrapToRender.id}
      propertyOverrides={
        parsedDate?.date
          ? [
              getSchedulePropertyFromSchedule({
                nextOccurrence: parsedDate.date.toString(),
                recurrence: parsedDate.recurrence,
              }),
              ...properties,
            ]
          : properties
      }
    >
      {isCompact && !hasFocus && !isEditMode ? null : (
        <>
          {children}
          <ScrapFiles />
        </>
      )}

      {fileInput}
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
      return saveAction ? [cancelEditingAction, saveAction] : [];
    }

    return [
      ...actions,
      addFileAction,
      ActionFactory.moveToAnotherScrap(scrapToRender),
      ...getScheduleActions(),
      saveAction,
      cancelEditingAction,
      ...getPersistedEntryActions(),
    ];
  }

  // Only meaningful once the scrap exists: there is nothing to delete or to relate to before that.
  function getPersistedEntryActions() {
    if (!scrapToRender.id) {
      return [];
    }

    return [
      ActionFactory.deleteEntry(scrapToRender, hasFocus),
      isEditMode ? null : ActionFactory.showRelatedItems(scrapToRender.id),
    ];
  }

  function getScheduleActions() {
    if (isEditMode) {
      return [];
    }

    const hasSchedule = !!getScheduleForUser(scrapToRender, user.id ?? "")
      ?.nextOccurrence;

    return [
      ActionFactory.editEntryScheduleViaUrl(
        scrapToRender.id ?? "",
        hasFocus,
        hasSchedule,
      ),
    ];
  }
};

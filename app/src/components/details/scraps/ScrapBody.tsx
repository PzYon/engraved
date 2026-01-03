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
import { ActionIconButtonGroup } from "../../common/actions/ActionIconButtonGroup";
import { IPropertyDefinition } from "../../common/IPropertyDefinition";

export const ScrapBody: React.FC<{
  children: React.ReactNode;
  actions: IAction[];
  editModeActions: IAction[];
  properties?: IPropertyDefinition[];
}> = ({ children, actions, editModeActions, properties = [] }) => {
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

  return (
    <>
      <Entry
        hasFocus={hasFocus}
        journal={journal}
        entry={scrapToRender}
        actions={getActions()}
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
        {isCompact && !hasFocus && !isEditMode ? null : children}

        {isEditMode && editModeActions?.length ? (
          <div
            style={{
              marginTop: scrapToRender.scrapType === "List" ? "2px" : 0,
            }}
          >
            <ActionIconButtonGroup
              alignTo={"bottom"}
              actions={editModeActions}
            />
          </div>
        ) : null}
      </Entry>
    </>
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

    const allActions = [
      ...actions,
      ActionFactory.moveToAnotherScrap(scrapToRender),
    ];

    if (!isEditMode) {
      const hasSchedule = !!getScheduleForUser(scrapToRender, user.id)
        ?.nextOccurrence;

      allActions.push(
        ActionFactory.editEntryScheduleViaUrl(
          scrapToRender.id,
          hasFocus,
          hasSchedule,
        ),
      );
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

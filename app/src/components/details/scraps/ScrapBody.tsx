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
import { styled } from "@mui/material";
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
    giveFocus,
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
        giveFocus={giveFocus}
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
          <ActionsContainer>
            <ActionIconButtonGroup actions={editModeActions} />
          </ActionsContainer>
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

const ActionsContainer = styled("div")`
  display: flex;
  padding: 3px 0 4px 3px;
`;

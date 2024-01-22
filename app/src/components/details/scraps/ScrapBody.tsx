import React from "react";
import { styled } from "@mui/material";
import { FormatDate } from "../../common/FormatDate";
import { ActionGroup } from "../../common/actions/ActionGroup";
import { IScrapEntry } from "../../../serverApi/IScrapEntry";
import { ActionFactory } from "../../common/actions/ActionFactory";
import { IAction } from "../../common/actions/IAction";
import { Properties } from "../../common/Properties";
import { getScheduleProperty } from "../../scheduled/scheduleUtils";

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
  hideDate,
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

      <FooterContainer>
        {hideDate ? null : (
          <Properties
            properties={[
              getScheduleProperty(scrap.schedule?.nextOccurrence),
              {
                key: "date",
                node: () => (
                  <FormatDate value={scrap.editedOn || scrap.dateTime} />
                ),
                label: "Edited",
              },
            ]}
          />
        )}

        {allActions?.length ? (
          <ActionsContainer>
            <ActionGroup actions={allActions} />
          </ActionsContainer>
        ) : null}
      </FooterContainer>
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

const FooterContainer = styled("div")`
  display: flex;
  justify-content: end;
  align-items: center;
  margin-top: 6px;
`;

const ActionsContainer = styled("div")`
  margin-left: ${(p) => p.theme.spacing(2)};
`;

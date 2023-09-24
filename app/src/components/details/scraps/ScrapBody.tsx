import React from "react";
import { styled, Typography } from "@mui/material";
import { FormatDate } from "../../common/FormatDate";
import { ActionGroup } from "../../common/actions/ActionGroup";
import { IScrapMeasurement } from "../../../serverApi/IScrapMeasurement";
import { ActionFactory } from "../../common/actions/ActionFactory";
import { IAction } from "../../common/actions/IAction";

export const ScrapBody: React.FC<{
  scrap: IScrapMeasurement;
  hideDate: boolean;
  hideActions: boolean;
  editMode: boolean;
  setEditMode: (value: boolean) => void;
  children: React.ReactNode;
  actions: IAction[];
  onSave: () => Promise<void>;
  cancelEditing: () => void;
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
}) => {
  const allActions = getActions();

  return (
    <>
      {children}

      <FooterContainer>
        {hideDate ? null : (
          <Typography fontSize="small" component="span" sx={{ mr: 2 }}>
            {scrap.dateTime ? <FormatDate value={scrap.dateTime} /> : "now"}
          </Typography>
        )}

        {allActions?.length ? (
          <ActionsContainer>
            <ActionGroup actions={allActions} />
          </ActionsContainer>
        ) : null}
      </FooterContainer>
    </>
  );

  function getActions() {
    if (hideActions) {
      return [];
    }

    const allActions = [
      ...actions,
      ActionFactory.moveToAnotherScrap(scrap),
      editMode
        ? ActionFactory.save(async () => await onSave())
        : ActionFactory.edit(() => setEditMode(true)),
    ];

    if (cancelEditing) {
      allActions.push(ActionFactory.cancelEditing(cancelEditing));
    }

    if (scrap.id) {
      allActions.push(ActionFactory.deleteMeasurement(scrap));
    }

    return allActions;
  }
};

const FooterContainer = styled("div")`
  display: flex;
  justify-content: end;
  align-items: center;
`;

const ActionsContainer = styled("div")`
  margin-top: 4px;
`;

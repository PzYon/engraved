import React from "react";
import { IIconButtonAction } from "../../common/IconButtonWrapper";
import { styled, Typography } from "@mui/material";
import { FormatDate } from "../../common/FormatDate";
import { Actions } from "../../common/Actions";
import {
  DeleteOutlined,
  EditOutlined,
  Redo,
  SaveOutlined,
} from "@mui/icons-material";
import { IScrapMeasurement } from "../../../serverApi/IScrapMeasurement";

export const ScrapBody: React.FC<{
  scrap: IScrapMeasurement;
  hideDate: boolean;
  hideActions: boolean;
  editMode: boolean;
  setEditMode: (value: boolean) => void;
  children: React.ReactNode;
  actions: IIconButtonAction[];
  onSave: () => void;
}> = ({
  scrap,
  hideDate,
  hideActions,
  editMode,
  setEditMode,
  children,
  actions,
  onSave,
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
            <Actions actions={allActions} />
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
      {
        key: "move-to-other-scrap",
        label: "Move to another scrap",
        icon: <Redo fontSize="small" />,
        href: `/metrics/${scrap.metricId}/measurements/${scrap.id}/move`,
      },
      editMode
        ? {
            key: "save",
            label: "Save",
            icon: <SaveOutlined fontSize="small" />,
            onClick: () => {
              onSave();
              setEditMode(false);
            },
          }
        : {
            key: "edit",
            label: "Edit",
            icon: <EditOutlined fontSize="small" />,
            onClick: () => setEditMode(true),
          },
    ];

    if (scrap.id) {
      allActions.push({
        key: "delete",
        label: "Delete",
        icon: <DeleteOutlined fontSize="small" />,
        href: `/metrics/${scrap.metricId}/measurements/${scrap.id}/delete`,
      });
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

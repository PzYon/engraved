import React from "react";
import { IIconButtonAction } from "../../common/IconButtonWrapper";
import { styled, Typography } from "@mui/material";
import { FormatDate } from "../../common/FormatDate";
import { Actions } from "../../common/Actions";
import {
  DeleteOutlined,
  EditOutlined,
  SaveOutlined,
} from "@mui/icons-material";
import { IScrapMeasurement } from "../../../serverApi/IScrapMeasurement";

export const ScrapBody: React.FC<{
  scrap: IScrapMeasurement;
  hideDate: boolean;
  editMode: boolean;
  setEditMode: (value: boolean) => void;
  children: React.ReactNode;
  actions: IIconButtonAction[];
}> = ({ scrap, hideDate, editMode, setEditMode, children, actions }) => {
  return (
    <>
      {children}

      <FooterContainer>
        {hideDate ? null : (
          <Typography fontSize="small" component="span" sx={{ mr: 2 }}>
            {scrap.dateTime ? <FormatDate value={scrap.dateTime} /> : "now"}
          </Typography>
        )}

        <Actions actions={getActions()} />
      </FooterContainer>
    </>
  );

  function getActions() {
    const allActions = [
      ...actions,
      editMode
        ? {
            key: "save",
            label: "Save",
            icon: <SaveOutlined fontSize="small" />,
            onClick: () => setEditMode(false),
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

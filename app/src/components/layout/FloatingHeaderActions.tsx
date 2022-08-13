import { SpeedDial, SpeedDialAction, SpeedDialIcon } from "@mui/material";
import {
  executeActionClick,
  IIconButtonAction,
} from "../common/IconButtonWrapper";
import React from "react";
import { useNavigate } from "react-router-dom";

export const FloatingHeaderActions: React.FC<{
  actions: IIconButtonAction[];
}> = ({ actions }) => {
  const navigate = useNavigate();

  return (
    <SpeedDial
      ariaLabel="SpeedDial basic example"
      direction="down"
      sx={{ position: "fixed", top: 16, right: 16 }}
      icon={<SpeedDialIcon />}
    >
      {actions.map((action) => (
        <SpeedDialAction
          key={action.key}
          icon={action.icon}
          tooltipTitle={action.label}
          onClick={(e) => executeActionClick(e, action, navigate)}
        />
      ))}
    </SpeedDial>
  );
};

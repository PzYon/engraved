import { SpeedDial, SpeedDialAction, SpeedDialIcon } from "@mui/material";
import { executeActionClick } from "../common/actions/ActionIconButton";
import React from "react";
import { useNavigate } from "react-router-dom";
import { IAction } from "../common/actions/IAction";

export const FloatingHeaderActions: React.FC<{
  actions: IAction[];
}> = ({ actions }) => {
  const navigate = useNavigate();

  return (
    <SpeedDial
      ariaLabel="SpeedDial basic example"
      direction="down"
      sx={{ position: "fixed", top: 16, right: 16 }}
      icon={<SpeedDialIcon />}
    >
      {actions
        .filter((a) => !!a)
        .map((action) => (
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

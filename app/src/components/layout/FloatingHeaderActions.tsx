import { SpeedDial, SpeedDialAction, SpeedDialIcon } from "@mui/material";
import { ActionIconButton } from "../common/actions/ActionIconButton";
import React from "react";
import { IAction } from "../common/actions/IAction";

export const FloatingHeaderActions: React.FC<{
  actions: IAction[];
}> = ({ actions }) => {
  return (
    <SpeedDial
      ariaLabel="SpeedDial basic example"
      direction="down"
      sx={{ position: "fixed", top: 16, right: 16 }}
      icon={<SpeedDialIcon />}
      data-testid="floating-header-actions"
    >
      {actions
        .filter((a) => !!a)
        .map((action) => (
          <SpeedDialAction
            key={action.key}
            icon={<ActionIconButton action={action} />}
            tooltipTitle={action.label}
          />
        ))}
    </SpeedDial>
  );
};

import React from "react";
import { IconButton } from "@mui/material";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { IAction } from "./IAction";

export const ActionIconButton: React.FC<{
  action: IAction;
}> = ({ action }) => {
  const navigate = useNavigate();

  return (
    <IconButton
      key={action.key}
      title={action.label}
      color="default"
      aria-label={action.label}
      sx={{
        color: "primary.main",
        opacity: action.isNotActive ? 0.4 : 1,
        ...(action.sx || {}),
      }}
      onClick={(e) => executeActionClick(e, action, navigate)}
      disabled={action.isDisabled}
    >
      {action.icon}
    </IconButton>
  );
};

export function executeActionClick(
  e: React.MouseEvent<HTMLElement>,
  action: IAction,
  navigate: NavigateFunction
) {
  e.stopPropagation();

  if (action.href) {
    navigate(action.href);
  } else if (action.onClick) {
    action.onClick();
  }
}

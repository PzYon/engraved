import React from "react";
import { IconButton } from "@mui/material";
import { NavigateFunction } from "react-router-dom";
import { IAction } from "./IAction";
import { useActionHotkeys } from "./useActionHotkeys";
import { ActionLink } from "./ActionLink";

export const ActionIconButton: React.FC<{
  action: IAction;
}> = ({ action }) => {
  useActionHotkeys(action);

  const child = action.href ? <ActionLink action={action} /> : action.icon;

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
      onClick={action.onClick}
      disabled={action.isDisabled}
    >
      {child}
    </IconButton>
  );
};

export function executeActionClick(
  e: React.MouseEvent<HTMLElement>,
  action: IAction,
  navigate: NavigateFunction
) {
  e?.stopPropagation();

  if (action.href) {
    navigate(action.href);
  } else if (action.onClick) {
    action.onClick();
  }
}

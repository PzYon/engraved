import React from "react";
import { IconButton } from "@mui/material";
import { IAction } from "./IAction";
import { useActionHotkeys } from "./useActionHotkeys";
import { ActionLink } from "./ActionLink";
import { NavigateFunction } from "react-router-dom";

export const ActionIconButton: React.FC<{
  action: IAction;
}> = ({ action }) => {
  useActionHotkeys(action);

  if (action.href) {
    return (
      <ActionLink action={action} style={{ display: "flex" }}>
        {getIconButton()}
      </ActionLink>
    );
  }

  return getIconButton();

  function getIconButton() {
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
        {action.icon}
      </IconButton>
    );
  }
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

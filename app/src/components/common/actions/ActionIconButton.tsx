import React from "react";
import { IconButton } from "@mui/material";
import { IAction } from "./IAction";
import { ActionLink } from "./ActionLink";
import { useHotkeys } from "react-hotkeys-hook";

export const ActionIconButton: React.FC<{
  action: IAction;
}> = ({ action }) => {
  useHotkeys(
    action.hotkey,
    (keyboardEvent) => {
      keyboardEvent.preventDefault();
      action.onClick;
    },
    { enabled: !!action.hotkey && !action.href }
  );

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

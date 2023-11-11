import React from "react";
import { IconButton, styled } from "@mui/material";
import { IAction } from "./IAction";
import { ActionLink } from "./ActionLink";
import { useHotkeys } from "react-hotkeys-hook";

export const ActionIconButton: React.FC<{
  action: IAction;
  noButtons?: boolean;
}> = ({ action, noButtons }) => {
  useHotkeys(
    action.hotkey,
    (keyboardEvent) => {
      keyboardEvent.preventDefault();
      action.onClick();
    },
    {
      enabled: !!action.hotkey && !action.href,
      enableOnFormTags: ["textarea", "input"],
    },
  );

  if (action.href) {
    return (
      <ActionLink action={action} style={{ display: "flex" }}>
        {getIconNoButton()}
      </ActionLink>
    );
  }

  if (noButtons) {
    return getIconNoButton();
  }

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

  function getIconNoButton() {
    return (
      <NoButtons
        key={action.key}
        title={action.label}
        color="default"
        aria-label={action.label}
        onClick={action.onClick}
        sx={{
          display: "flex",
          color: "primary.main",
          padding: "8px",
          borderRadius: "100%",
          ":hover": {
            backgroundColor: "rgba(0, 0, 0, 0.04)",
          },
          opacity: action.isNotActive ? 0.4 : 1,
          ...(action.sx || {}),
        }}
      >
        {action.icon}
      </NoButtons>
    );
  }
};

const NoButtons = styled("span")``;

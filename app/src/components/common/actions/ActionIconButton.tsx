import React, { useEffect } from "react";
import { IconButton, styled } from "@mui/material";
import { IAction } from "./IAction";
import { ActionLink } from "./ActionLink";
import { useActionContext } from "./ActionContext";
import { useHotkeys } from "react-hotkeys-hook";

export const ActionIconButton: React.FC<{
  action: IAction;
  buttonsAsSpans?: boolean;
}> = ({ action, buttonsAsSpans }) => {
  const actionContext = useActionContext();

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

  useEffect(() => {
    actionContext.addAction(action);
    return () => actionContext.removeAction(action);
  }, [action]);

  if (action.href) {
    return (
      <ActionLink action={action} style={{ display: "flex" }}>
        {getNoButtonIcon()}
      </ActionLink>
    );
  }

  if (buttonsAsSpans) {
    return getNoButtonIcon();
  }

  return (
    <IconButton
      {...getCommonProps()}
      sx={getCommonSx()}
      disabled={action.isDisabled}
    >
      {action.icon}
    </IconButton>
  );

  function getNoButtonIcon() {
    return (
      <NoButtonIcon
        {...getCommonProps()}
        sx={{
          display: "flex",
          padding: "8px",
          borderRadius: "100%",
          ":hover": {
            backgroundColor: "rgba(0, 0, 0, 0.04)",
          },
          ...getCommonSx(),
        }}
      >
        {action.icon}
      </NoButtonIcon>
    );
  }

  function getCommonSx() {
    return {
      color: "primary.main",
      opacity: action.isNotActive ? 0.4 : 1,
      ...(action.sx || {}),
    };
  }

  function getCommonProps() {
    return {
      key: action.key,
      title: action.label + (action.hotkey ? ` (${action.hotkey})` : ""),
      "aria-label": action.label,
      onClick: action.onClick,
    };
  }
};

const NoButtonIcon = styled("span")``;

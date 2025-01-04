import React, { useEffect } from "react";
import { IconButton, styled, Theme, useTheme } from "@mui/material";
import { IAction } from "./IAction";
import { ActionLink } from "./ActionLink";
import { SxProps } from "@mui/system";
import { useActionContext } from "./ActionContext";
import { actionBorderWidth } from "../../../theming/engravedTheme";
import { useEngravedHotkeys } from "./useEngravedHotkeys";

export const ActionIconButton: React.FC<{
  action: IAction;
  buttonsAsSpans?: boolean;
  isActive?: boolean;
}> = ({ action, buttonsAsSpans, isActive }) => {
  const actionContext = useActionContext();
  const { palette } = useTheme();

  useEngravedHotkeys(
    action.hotkey,
    (keyboardEvent) => {
      keyboardEvent.preventDefault();
      action.onClick();
    },
    {
      // we only register actions with functions here.
      // actions with URLs are registered in ActionLink component.
      enabled: !!action.hotkey && !!action.onClick,
      enableOnFormTags: ["textarea", "input"],
    },
    undefined,
    action.hotkeyRequiredCount,
  );

  useEffect(() => {
    actionContext.addAction(action);
    return () => actionContext.removeAction(action);
  }, [action, actionContext]);

  if (action.href || Object.keys(action.search ?? {}).length) {
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
      key={action.key}
      {...getCommonProps()}
      sx={{ ...getCommonSx(), padding: actionBorderWidth }}
      disabled={action.isDisabled}
    >
      {action.icon}
    </IconButton>
  );

  function getNoButtonIcon() {
    return (
      <NoButtonIcon
        key={action.key}
        {...getCommonProps()}
        sx={{
          display: "flex",
          padding: actionBorderWidth,
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

  function getCommonSx(): SxProps<Theme> {
    return {
      color: "primary.main",
      opacity: action.isNotActive ? 0.4 : 1,
      ...(action.sx || {}),
      border: `${actionBorderWidth} solid ${isActive ? palette.primary.main : "transparent"}`,
    };
  }

  function getCommonProps() {
    return {
      title: action.label + (action.hotkey ? ` (${action.hotkey})` : ""),
      "aria-label": action.label,
      onClick: action.onClick,
    };
  }
};

const NoButtonIcon = styled("span")``;

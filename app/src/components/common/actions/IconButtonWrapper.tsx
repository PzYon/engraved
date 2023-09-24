import React from "react";
import { IconButton } from "@mui/material";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { IIconButtonAction } from "./IIconButtonAction";

export const IconButtonWrapper: React.FC<{
  action: IIconButtonAction;
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
  action: IIconButtonAction,
  navigate: NavigateFunction
) {
  e.stopPropagation();

  if (action.href) {
    navigate(action.href);
  } else if (action.onClick) {
    action.onClick();
  }
}

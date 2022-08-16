import React from "react";
import { IconButton, Theme } from "@mui/material";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { SxProps } from "@mui/system";

export interface IIconButtonAction {
  key: string;
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  href?: string;
  sx?: SxProps<Theme>;
}

export const IconButtonWrapper: React.FC<{
  action: IIconButtonAction;
}> = ({ action }) => {
  const navigate = useNavigate();

  return (
    <IconButton
      key={action.key}
      color="default"
      aria-label={action.label}
      sx={{ color: "primary.main", ...(action.sx || {}) }}
      onClick={(e) => executeActionClick(e, action, navigate)}
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

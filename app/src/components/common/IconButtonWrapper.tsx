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
  isNotActive?: boolean;
}

export const IconButtonWrapper: React.FC<{
  action: IIconButtonAction;
  disabled?: boolean;
}> = ({ action, disabled }) => {
  const navigate = useNavigate();

  return (
    <IconButton
      key={action.key}
      color="default"
      title={action.label}
      aria-label={action.label}
      sx={{
        color: "primary.main",
        opacity: action.isNotActive ? 0.4 : 1,
        ...(action.sx || {}),
      }}
      onClick={(e) => executeActionClick(e, action, navigate)}
      disabled={disabled}
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

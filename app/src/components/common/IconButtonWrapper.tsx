import React from "react";
import { IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";

export interface IIconButtonAction {
  key: string;
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  href?: string;
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
      sx={{ color: "primary.main" }}
      onClick={(e) => {
        e.stopPropagation();

        if (action.href) {
          navigate(action.href);
        } else if (action.onClick) {
          action.onClick();
        }
      }}
    >
      {action.icon}
    </IconButton>
  );
};

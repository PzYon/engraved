import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, IconButton, styled } from "@mui/material";

export interface IAction {
  key: string;
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  href?: string;
}

export const HeaderActions: React.FC<{ actions: IAction[] }> = ({
  actions,
}) => {
  const navigate = useNavigate();

  if (!actions?.length) {
    return null;
  }

  return (
    <ButtonContainer>
      {actions.map((action) => (
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
      ))}
    </ButtonContainer>
  );
};

const ButtonContainer = styled(Box)({
  display: "flex",
  flexGrow: 1,
  justifyContent: "end",
});

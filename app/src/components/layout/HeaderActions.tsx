import React from "react";
import { useNavigate } from "react-router-dom";
import { IconButton } from "@mui/material";
import styled from "styled-components";

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

const ButtonContainer = styled.div`
  display: flex;
  flex-grow: 1;
  justify-content: end;
`;

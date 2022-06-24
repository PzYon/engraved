import React from "react";
import styled from "styled-components";
import {
  IconButtonWrapper,
  IIconButtonAction,
} from "../common/IconButtonWrapper";

export const HeaderActions: React.FC<{ actions: IIconButtonAction[] }> = ({
  actions,
}) => {
  if (!actions?.length) {
    return null;
  }

  return (
    <ButtonContainer>
      {actions.map((action) => (
        <IconButtonWrapper key={action.key} action={action} />
      ))}
    </ButtonContainer>
  );
};

const ButtonContainer = styled.div`
  display: flex;
  flex-grow: 1;
  justify-content: end;
`;

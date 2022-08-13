import React, { useRef } from "react";
import styled from "styled-components";
import {
  IconButtonWrapper,
  IIconButtonAction,
} from "../common/IconButtonWrapper";
import { FloatingHeaderActions } from "./FloatingHeaderActions";
import { useIsInViewport } from "../common/useIsInViewPort";

export const HeaderActions: React.FC<{
  actions: IIconButtonAction[];
  enableFloatingActions?: boolean;
}> = ({ actions, enableFloatingActions }) => {
  const buttonContainerRef = useRef<HTMLDivElement>();
  const areHeaderActionsInViewPort = useIsInViewport(buttonContainerRef);

  if (!actions?.length) {
    return null;
  }

  return (
    <>
      {!areHeaderActionsInViewPort && enableFloatingActions ? (
        <FloatingHeaderActions actions={actions} />
      ) : null}
      <ButtonContainer ref={buttonContainerRef}>
        {actions.map((action) => (
          <IconButtonWrapper key={action.key} action={action} />
        ))}
      </ButtonContainer>
    </>
  );
};

const ButtonContainer = styled.div`
  display: flex;
  flex-grow: 1;
  justify-content: end;
`;

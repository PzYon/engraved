import React, { useEffect, useRef, useState } from "react";
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

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsReady(true), 1000);
  }, []);

  if (!actions?.length) {
    return null;
  }

  return (
    <>
      {!areHeaderActionsInViewPort && enableFloatingActions && isReady ? (
        <FloatingHeaderActions actions={actions} />
      ) : null}
      <ButtonContainer ref={buttonContainerRef}>
        {actions.map((action) =>
          action ? (
            <IconButtonWrapper key={action.key} action={action} />
          ) : (
            <Separator key={"separator"} />
          )
        )}
      </ButtonContainer>
    </>
  );
};

const ButtonContainer = styled.div`
  display: flex;
  flex-grow: 1;
  justify-content: end;
  align-items: center;
`;

const Separator: React.FC = () => {
  return (
    <>
      <div style={{ marginLeft: "20px" }} />
      <div
        style={{
          height: "30px",
          width: "2px",
          backgroundColor: "white",
        }}
      />
      <div style={{ marginRight: "20px" }} />
    </>
  );
};

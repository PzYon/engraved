import React, { useEffect, useRef, useState } from "react";
import {
  IconButtonWrapper,
  IIconButtonAction,
} from "../common/IconButtonWrapper";
import { FloatingHeaderActions } from "./FloatingHeaderActions";
import { useIsInViewport } from "../common/useIsInViewPort";
import { styled } from "@mui/material";

export const HeaderActions: React.FC<{
  actions: IIconButtonAction[];
  enableFloatingActions?: boolean;
  style?: React.CSSProperties;
}> = ({ actions, enableFloatingActions, style }) => {
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
    <div style={style}>
      {!areHeaderActionsInViewPort && enableFloatingActions && isReady ? (
        <FloatingHeaderActions actions={actions} />
      ) : null}
      <ButtonContainer ref={buttonContainerRef}>
        {actions
          .filter((a) => a !== undefined)
          .map((action) =>
            action ? (
              <IconButtonWrapper key={action.key} action={action} />
            ) : (
              <SeparatorElement key={"separator"} />
            )
          )}
      </ButtonContainer>
    </div>
  );
};

const ButtonContainer = styled("div")`
  display: flex;
  flex-grow: 1;
  justify-content: end;
  align-items: center;
  background-color: ${(p) => p.theme.palette.background.default};
  border-radius: 20px;
`;

const SeparatorElement = styled("div")`
  height: 30px;
  width: 1px;
  background-color: ${(p) => p.theme.palette.primary.main};
  margin: 0 ${(p) => p.theme.spacing(2)};
`;

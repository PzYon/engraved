import React, { useEffect, useRef, useState } from "react";
import { ActionIconButton } from "./ActionIconButton";
import { FloatingHeaderActions } from "../../layout/FloatingHeaderActions";
import { useIsInViewport } from "../useIsInViewPort";
import { styled, useTheme } from "@mui/material";
import { IAction } from "./IAction";

export const ActionIconButtonGroup: React.FC<{
  actions: IAction[];
  enableFloatingActions?: boolean;
  testId?: string;
  backgroundColor?: string;
}> = ({ actions, enableFloatingActions, testId, backgroundColor }) => {
  const domElementRef = useRef<HTMLDivElement>();

  const { palette } = useTheme();

  const areHeaderActionsInViewPort = useIsInViewport(domElementRef);

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsReady(true), 1000);

    return () => {
      window.clearTimeout(timer);
      setIsReady(false);
    };
  }, []);

  if (!actions?.length) {
    return null;
  }

  return (
    <>
      {!areHeaderActionsInViewPort && enableFloatingActions && isReady ? (
        <FloatingHeaderActions actions={actions} />
      ) : null}
      <ButtonContainer
        data-testid={testId}
        sx={{ backgroundColor: backgroundColor ?? palette.background.default }}
      >
        <div ref={domElementRef} />
        {actions
          .filter((a) => a !== undefined)
          .map((action) =>
            action ? (
              <ActionIconButton key={action.key} action={action} />
            ) : (
              <SeparatorElement key={"separator"} />
            ),
          )}
      </ButtonContainer>
    </>
  );
};

const ButtonContainer = styled("div")`
  display: flex;
  justify-content: end;
  align-items: center;
  border-radius: 20px;

  .MuiButtonBase-root:first-of-type {
    margin-left: 0;
  }
`;

export const SeparatorElement = styled("div")`
  height: 25px;
  width: 2px;
  background-color: ${(p) => p.theme.palette.primary.main};
  margin: 0 ${(p) => p.theme.spacing(2)};
`;

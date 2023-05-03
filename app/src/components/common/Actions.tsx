import React, { useEffect, useRef, useState } from "react";
import { IconButtonWrapper, IIconButtonAction } from "./IconButtonWrapper";
import { FloatingHeaderActions } from "../layout/FloatingHeaderActions";
import { useIsInViewport } from "./useIsInViewPort";
import { IconButton, styled } from "@mui/material";
import { AssistWalker } from "@mui/icons-material";

export const Actions: React.FC<{
  actions: IIconButtonAction[];
  enableFloatingActions?: boolean;
}> = ({ actions, enableFloatingActions }) => {
  const domElementRef = useRef<HTMLDivElement>();

  const areHeaderActionsInViewPort = useIsInViewport(domElementRef);

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 1000);

    return () => {
      clearTimeout(timer);
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
      <ButtonContainer>
        <div ref={domElementRef} />
        <IconButton
          sx={{ visibility: "hidden", width: "1px", margin: 0, padding: 0 }}
        >
          <AssistWalker />
        </IconButton>
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
    </>
  );
};

const ButtonContainer = styled("div")`
  display: flex;
  justify-content: end;
  align-items: center;
  background-color: ${(p) => p.theme.palette.background.default};
  border-radius: 20px;
`;

const SeparatorElement = styled("div")`
  height: 25px;
  width: 1px;
  background-color: ${(p) => p.theme.palette.primary.main};
  margin: 0 ${(p) => p.theme.spacing(2)};
`;

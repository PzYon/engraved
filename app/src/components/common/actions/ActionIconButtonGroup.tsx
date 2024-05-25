import React, { useEffect, useRef, useState } from "react";
import { ActionIconButton } from "./ActionIconButton";
import { FloatingHeaderActions } from "../../layout/FloatingHeaderActions";
import { useIsInViewport } from "../useIsInViewPort";
import { styled, useTheme } from "@mui/material";
import { IAction } from "./IAction";
import { useLocation } from "react-router-dom";

export const ActionIconButtonGroup: React.FC<{
  actionsDefinition: {
    actions: IAction[];
    routes?: React.ReactElement;
  };
  enableFloatingActions?: boolean;
  testId?: string;
  backgroundColor?: string;
}> = ({
  actionsDefinition,
  enableFloatingActions,
  testId,
  backgroundColor,
}) => {
  const domElementRef = useRef<HTMLDivElement>();

  debugger;
  const { palette } = useTheme();

  const areHeaderActionsInViewPort = useIsInViewport(domElementRef);

  const loc = useLocation();

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsReady(true), 1000);

    return () => {
      window.clearTimeout(timer);
      setIsReady(false);
    };
  }, []);

  if (!actionsDefinition.actions?.length) {
    return null;
  }

  return (
    <>
      {!areHeaderActionsInViewPort && enableFloatingActions && isReady ? (
        <FloatingHeaderActions actions={actionsDefinition.actions} />
      ) : null}
      <ButtonContainer
        data-testid={testId}
        sx={{ backgroundColor: backgroundColor ?? palette.background.default }}
      >
        <div ref={domElementRef} />
        {actionsDefinition.actions
          .filter((a) => a !== undefined)
          .map((action) => {
            if (!action) {
              return <SeparatorElement key={"separator"} />;
            }

            const markAsAction = loc.pathname.endsWith(action.href);

            return (
              <span key={action.key}>
                <ActionIconButton action={action} />
                {markAsAction ? (
                  <span
                    style={{
                      position: "absolute",
                      borderLeft: "16px solid transparent",
                      borderRight: "16px solid transparent  ",
                      borderBottom: "16px solid #d4e3eb",
                      height: 0,
                      width: 0,
                    }}
                  />
                ) : null}
              </span>
            );
          })}
      </ButtonContainer>
      <div className="actionnnnnn">{actionsDefinition.routes}</div>
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

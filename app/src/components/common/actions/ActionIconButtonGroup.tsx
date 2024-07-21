import React, { useEffect, useRef, useState } from "react";
import { ActionIconButton } from "./ActionIconButton";
import { FloatingHeaderActions } from "../../layout/FloatingHeaderActions";
import { useIsInViewport } from "../useIsInViewPort";
import { styled, useTheme } from "@mui/material";
import { IAction } from "./IAction";
import { useLocation } from "react-router-dom";
import { useCustomSearchParams } from "./itemActionHook";

export const ActionIconButtonGroup: React.FC<{
  actions: IAction[];
  enableFloatingActions?: boolean;
  testId?: string;
  backgroundColor?: string;
}> = ({ actions, enableFloatingActions, testId, backgroundColor }) => {
  const domElementRef = useRef<HTMLDivElement>();

  const { palette } = useTheme();

  const areHeaderActionsInViewPort = useIsInViewport(domElementRef);

  const loc = useLocation();
  const { getParam } = useCustomSearchParams();

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
          .map((action) => {
            if (!action) {
              return <SeparatorElement key={"separator"} />;
            }

            return (
              <span key={action.key}>
                <ActionIconButton action={action} />
                {isActionActive(action) ? (
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
    </>
  );

  function isActionActive(action: IAction) {
    if (action.href) {
      return loc.pathname.endsWith(action.href);
    }

    if (!action.search || !Object.keys(action.search).length) {
      return false;
    }

    for (const key in action.search) {
      if (action.search[key] !== getParam(key)) {
        return false;
      }
    }

    return true;
  }
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

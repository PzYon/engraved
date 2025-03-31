import React, { useEffect, useRef, useState } from "react";
import { ActionIconButton } from "./ActionIconButton";
import { FloatingHeaderActions } from "../../layout/FloatingHeaderActions";
import { useIsInViewport } from "../useIsInViewPort";
import { styled, useTheme } from "@mui/material";
import { IAction } from "./IAction";
import { useEngravedSearchParams } from "./searchParamHooks";
import { Triangle } from "../Triangle";
import { MuiTheme } from "../../../theming/engravedTheme";

export const ActionIconButtonGroup: React.FC<{
  actions: IAction[];
  enableFloatingActions?: boolean;
  testId?: string;
  backgroundColor?: string;
}> = ({ actions, enableFloatingActions, testId, backgroundColor }) => {
  const domElementRef = useRef<HTMLDivElement>(undefined);

  const { palette } = useTheme();

  const areHeaderActionsInViewPort = useIsInViewport(domElementRef);

  const { getSearchParam } = useEngravedSearchParams();

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

            const isActive = isActionActive(action);

            return (
              <span key={action.key} style={{ position: "relative" }}>
                <ActionIconButton action={action} isActive={isActive} />
                {isActive ? <Triangle /> : null}
              </span>
            );
          })}
      </ButtonContainer>
    </>
  );

  function isActionActive(action: IAction) {
    // actions that have a URL (i.e. point to a different page) are ignored
    // for the moment, because they might not even have a "action panel"
    if (action.href) {
      return false;
    }

    if (!action.search || !Object.keys(action.search).length) {
      return false;
    }

    for (const key in action.search) {
      if (action.search[key] !== getSearchParam(key)) {
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
  background-color: ${(p: MuiTheme) => p.theme.palette.primary.main};
  margin: 0 ${(p: MuiTheme) => p.theme.spacing(2)};
`;

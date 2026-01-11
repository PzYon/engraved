import React, { useEffect, useRef, useState } from "react";
import { ActionIconButton } from "./ActionIconButton";
import { FloatingHeaderActions } from "../../layout/FloatingHeaderActions";
import { useIsInViewport } from "../useIsInViewPort";
import { css, styled, useTheme } from "@mui/material";
import { IAction } from "./IAction";
import { useEngravedSearchParams } from "./searchParamHooks";
import { Triangle } from "../Triangle";
import { StickTo } from "../StickTo";

export type Position = "none" | "top" | "bottom";

export const ActionIconButtonGroup: React.FC<{
  actions: IAction[];
  enableFloatingActions?: boolean;
  testId?: string;
  backgroundColor?: string;
  alignToPosition?: Position;
  stickToPosition?: Position;
  stickToView?: boolean;
}> = ({
  actions,
  enableFloatingActions,
  testId,
  backgroundColor,
  alignToPosition,
  stickToPosition,
  stickToView,
}) => {
  const domElementRef = useRef<HTMLDivElement>(undefined);
  const stickyRef = useRef<HTMLDivElement>(undefined);

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

  const finalAlignTo = alignToPosition ?? "none";
  const finalBackgroundColor = backgroundColor ?? palette.background.default;

  return (
    <StickTo
      isDisabled={!stickToView}
      position={stickToPosition}
      stickyRef={stickyRef}
      render={(isStuck) => (
        <Host ref={stickyRef}>
          {!areHeaderActionsInViewPort && enableFloatingActions && isReady ? (
            <FloatingHeaderActions actions={actions} />
          ) : null}
          <RadiusSpacer
            backgroundColor={finalBackgroundColor}
            alignTo={finalAlignTo}
            position={"left"}
            isStuck={isStuck}
          />
          <ButtonContainer
            stickToView={stickToView}
            alignTo={finalAlignTo}
            data-testid={testId}
            sx={{ backgroundColor: finalBackgroundColor }}
            isStuck={isStuck}
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
          <RadiusSpacer
            backgroundColor={finalBackgroundColor}
            alignTo={finalAlignTo}
            position={"right"}
            isStuck={isStuck}
          />
        </Host>
      )}
    ></StickTo>
  );

  function isActionActive(action: IAction) {
    // actions that have a URL (i.e. point to a different page) are ignored
    // for the moment, because they might not even have an "action panel"
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

const RadiusSpacer: React.FC<{
  backgroundColor: string;
  alignTo: Position;
  position: "left" | "right";
  isStuck: boolean;
}> = ({ backgroundColor, alignTo, position, isStuck }) => {
  const { palette } = useTheme();

  if (alignTo === "none") {
    return null;
  }

  return (
    <div
      style={{
        visibility: isStuck ? "hidden" : "initial",
        width: "30px",
        backgroundColor: backgroundColor,
      }}
    >
      <div
        style={{
          height: "100%",
          backgroundColor: palette.common.white,
          borderTopLeftRadius:
            position === "right" && alignTo === "bottom" ? "20px" : 0,
          borderBottomLeftRadius:
            position === "right" && alignTo === "top" ? "20px" : 0,
          borderTopRightRadius:
            position === "left" && alignTo === "bottom" ? "20px" : 0,
          borderBottomRightRadius:
            position === "left" && alignTo === "top" ? "20px" : 0,
        }}
      ></div>
    </div>
  );
};

const Host = styled("div")`
  display: flex;
`;

const ButtonContainer = styled("div")<{
  alignTo: Position;
  isStuck: boolean;
  stickToView: boolean;
}>`
  flex-shrink: 1;
  display: flex;
  border-radius: 20px;
  margin-top: ${(p) => (p.stickToView ? "5px" : "0")};

  ${(p) => {
    if (p.isStuck) {
      return;
    }

    if (p.alignTo === "top") {
      return css`
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
      `;
    }

    if (p.alignTo === "bottom") {
      return css`
        border-top-left-radius: 0;
        border-top-right-radius: 0;
      `;
    }
  }}

  .MuiButtonBase-root:first-of-type {
    margin-left: 0;
  }
`;

const SeparatorElement = styled("div")`
  height: 25px;
  width: 2px;
  background-color: ${(p) => p.theme.palette.primary.main};
  margin: 0 ${(p) => p.theme.spacing(2)};
`;

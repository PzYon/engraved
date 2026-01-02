import React, { useEffect, useRef, useState } from "react";
import { ActionIconButton } from "./ActionIconButton";
import { FloatingHeaderActions } from "../../layout/FloatingHeaderActions";
import { useIsInViewport } from "../useIsInViewPort";
import { css, styled, useTheme } from "@mui/material";
import { IAction } from "./IAction";
import { useEngravedSearchParams } from "./searchParamHooks";
import { Triangle } from "../Triangle";

type AlignTo = "none" | "top" | "bottom";

export const ActionIconButtonGroup: React.FC<{
  actions: IAction[];
  enableFloatingActions?: boolean;
  testId?: string;
  backgroundColor?: string;
  alignTo?: AlignTo;
}> = ({ actions, enableFloatingActions, testId, backgroundColor, alignTo }) => {
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

  const finalAlignTo = alignTo ?? "none";
  const finalBackgroundColor = backgroundColor ?? palette.background.default;

  return (
    <Host>
      {!areHeaderActionsInViewPort && enableFloatingActions && isReady ? (
        <FloatingHeaderActions actions={actions} />
      ) : null}
      {finalAlignTo !== "none" ? (
        <SpacerHost
          alignTo={finalAlignTo}
          backgroundColor={finalBackgroundColor}
        >
          <LeftSpacer alignTo={finalAlignTo} />
        </SpacerHost>
      ) : null}
      <ButtonContainer
        alignTo={finalAlignTo}
        data-testid={testId}
        sx={{ backgroundColor: finalBackgroundColor }}
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
      {finalAlignTo !== "none" ? (
        <SpacerHost
          alignTo={finalAlignTo}
          backgroundColor={finalBackgroundColor}
        >
          <RightSpacer alignTo={finalAlignTo} />
        </SpacerHost>
      ) : null}
    </Host>
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

const Host = styled("div")`
  display: flex;
`;

const SpacerHost = styled("div")<{ backgroundColor: string; alignTo: AlignTo }>`
  width: 20px;
  background-color: ${(p) => p.backgroundColor};
  position: relative;

  ${(p) =>
    p.alignTo === "bottom"
      ? css`
          margin-top: 2px;
        `
      : undefined}
`;

const LeftSpacer = styled("div")<{ alignTo: AlignTo }>`
  width: 20px;
  height: 100%;
  background-color: ${(p) => p.theme.palette.common.white};

  ${(p) =>
    p.alignTo === "top"
      ? css`
          border-bottom-right-radius: 20px;
        `
      : p.alignTo === "bottom"
        ? css`
            border-top-right-radius: 20px;
          `
        : undefined}
`;

const RightSpacer = styled("div")<{ alignTo: AlignTo }>`
  width: 20px;
  height: 100%;
  background-color: ${(p) => p.theme.palette.common.white};

  ${(p) =>
    p.alignTo === "top"
      ? css`
          border-bottom-left-radius: 20px;
        `
      : p.alignTo === "bottom"
        ? css`
            border-top-left-radius: 20px;
          `
        : undefined}
`;

const ButtonContainer = styled("div")<{ alignTo: AlignTo }>`
  flex-shrink: 1;
  display: flex;
  border-radius: 20px;

  ${(p) =>
    p.alignTo === "top"
      ? css`
          border-bottom-left-radius: 0;
          border-bottom-right-radius: 0;
        `
      : p.alignTo === "bottom"
        ? css`
            border-top-left-radius: 0;
            border-top-right-radius: 0;
          `
        : undefined}

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

import React, { useEffect, useRef } from "react";
import { ClickAwayListener, styled } from "@mui/material";
import {
  actionBorderWidth,
  paperBorderRadius,
} from "../../../theming/engravedTheme";
import { useItemAction } from "./searchParamHooks";

export const NavigationActionContainer: React.FC<{
  children: React.ReactNode;
  shrinkWidthIfPossible?: boolean;
  growWidthIfPossible?: boolean;
}> = ({ children, growWidthIfPossible, shrinkWidthIfPossible }) => {
  const domElement = useRef<HTMLDivElement>(undefined);

  const { closeAction } = useItemAction();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      domElement.current?.scrollIntoView({
        block: "nearest",
        inline: "nearest",
        behavior: "smooth",
      });
    }, 500);

    return () => window.clearTimeout(timer);
     
  }, []);

  return (
    <Host ref={domElement}>
      <Inner
        className="action-container"
        style={{
          width: shrinkWidthIfPossible ? "auto" : "100%",
          maxWidth: growWidthIfPossible ? "100%" : "500px",
        }}
      >
        <ClickAwayListener onClickAway={closeAction} mouseEvent="onMouseUp">
          <InnerInner>{children}</InnerInner>
        </ClickAwayListener>
      </Inner>
    </Host>
  );
};

const Host = styled("div")`
  display: flex;
  justify-content: end;
`;

const Inner = styled("div")`
  position: relative;
  z-index: 2;
  margin-top: calc(${(p) => p.theme.spacing(2)} - ${actionBorderWidth});
  padding: ${actionBorderWidth};
  border-radius: ${paperBorderRadius};
  background: linear-gradient(
    50deg,
    ${(p) => p.theme.palette.text.primary} 0%,
    ${(p) => p.theme.palette.primary.main} 80%
  );
`;

const InnerInner = styled("div")`
  padding: ${(p) => p.theme.spacing(2)};
  background-color: ${(p) => p.theme.palette.common.white};
  border-radius: ${paperBorderRadius};
`;

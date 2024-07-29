import React, { useEffect } from "react";
import { styled } from "@mui/material";
import { paperBorderRadius } from "../../../theming/engravedTheme";

export const NavigationActionContainer: React.FC<{
  children: React.ReactNode;
  shrinkWidthIfPossible?: boolean;
  growWidthIfPossible?: boolean;
  giveFocus?: () => void;
}> = ({ children, growWidthIfPossible, shrinkWidthIfPossible, giveFocus }) => {
  useEffect(() => {
    giveFocus?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Host>
      <Inner
        style={{
          width: shrinkWidthIfPossible ? "auto" : "100%",
          maxWidth: growWidthIfPossible ? "100%" : "500px",
        }}
      >
        <InnerInner>{children}</InnerInner>
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
  margin-top: ${(p) => p.theme.spacing(2)};
  border-radius: ${paperBorderRadius};

  &:before {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: -1;
    margin: -4px;
    border-radius: ${paperBorderRadius};
    background: linear-gradient(
      140deg,
      ${(p) => p.theme.palette.text.primary} 0%,
      ${(p) => p.theme.palette.primary.main} 80%
    );
  }
`;

const InnerInner = styled("div")`
  padding: ${(p) => p.theme.spacing(2)};
  background-color: ${(p) => p.theme.palette.common.white};
  border-radius: ${paperBorderRadius};
`;
